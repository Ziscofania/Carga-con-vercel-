document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const addProductBtn = document.getElementById('addProductBtn');
    const importExcelBtn = document.getElementById('importExcelBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const searchInput = document.getElementById('searchInput');
    const productModal = document.getElementById('productModal');
    const closeModal = document.querySelector('.close');
    const productForm = document.getElementById('productForm');
    const excelFileInput = document.getElementById('excelFileInput');
    const inventoryTableBody = document.getElementById('inventoryTableBody');
    
    // Variables
    let products = JSON.parse(localStorage.getItem('inventory')) || [];
    let currentProductId = null;
    
    // Event Listeners
    addProductBtn.addEventListener('click', openAddProductModal);
    importExcelBtn.addEventListener('click', () => excelFileInput.click());
    exportExcelBtn.addEventListener('click', exportToExcel);
    closeModal.addEventListener('click', closeProductModal);
    productForm.addEventListener('submit', saveProduct);
    searchInput.addEventListener('input', filterProducts);
    excelFileInput.addEventListener('change', handleExcelImport);
    window.addEventListener('click', (event) => {
        if (event.target === productModal) {
            closeProductModal();
        }
    });
    
    // Inicializar tabla
    renderInventoryTable();
    
    // Funciones
    function openAddProductModal(product = null) {
        currentProductId = product ? product.id : null;
        
        if (product) {
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productQuantity').value = product.quantity;
            document.getElementById('productCategory').value = product.category || '';
            document.getElementById('productNotes').value = product.notes || '';
        } else {
            productForm.reset();
        }
        
        productModal.style.display = 'block';
    }
    
    function closeProductModal() {
        productModal.style.display = 'none';
        currentProductId = null;
    }
    
    function saveProduct(e) {
        e.preventDefault();
        
        const product = {
            id: currentProductId || Date.now().toString(),
            name: document.getElementById('productName').value,
            quantity: parseInt(document.getElementById('productQuantity').value),
            category: document.getElementById('productCategory').value,
            notes: document.getElementById('productNotes').value
        };
        
        if (currentProductId) {
            // Editar producto existente
            const index = products.findIndex(p => p.id === currentProductId);
            if (index !== -1) {
                products[index] = product;
            }
        } else {
            // Agregar nuevo producto
            products.push(product);
        }
        
        saveToLocalStorage();
        renderInventoryTable();
        closeProductModal();
    }
    
    function deleteProduct(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            products = products.filter(product => product.id !== id);
            saveToLocalStorage();
            renderInventoryTable();
        }
    }
    
    function adjustQuantity(id, amount) {
        const product = products.find(p => p.id === id);
        if (product) {
            product.quantity += amount;
            if (product.quantity < 0) product.quantity = 0;
            saveToLocalStorage();
            renderInventoryTable();
        }
    }
    
    function saveToLocalStorage() {
        localStorage.setItem('inventory', JSON.stringify(products));
    }
    
    function renderInventoryTable(filteredProducts = null) {
        const itemsToRender = filteredProducts || products;
        
        inventoryTableBody.innerHTML = itemsToRender.map(product => `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>${product.category || ''}</td>
                <td>${product.notes || ''}</td>
                <td class="actions">
                    <button onclick="window.editProduct('${product.id}')">Editar</button>
                    <button onclick="window.deleteProduct('${product.id}')">Eliminar</button>
                    <button onclick="window.adjustQuantity('${product.id}', 1)">+1</button>
                    <button onclick="window.adjustQuantity('${product.id}', -1)">-1</button>
                </td>
            </tr>
        `).join('');
    }
    
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        if (!searchTerm) {
            renderInventoryTable();
            return;
        }
        
        const filtered = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            (product.category && product.category.toLowerCase().includes(searchTerm)) ||
            (product.notes && product.notes.toLowerCase().includes(searchTerm))
        );
        
        renderInventoryTable(filtered);
    }
    
    function exportToExcel() {
        const ws = XLSX.utils.json_to_sheet(products);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Inventario");
        XLSX.writeFile(wb, "inventario.xlsx");
    }
    
    function handleExcelImport(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Suponiendo que la primera hoja contiene los datos
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            // Procesar los datos importados
            processImportedData(jsonData);
            
            // Limpiar el input de archivo
            excelFileInput.value = '';
        };
        reader.readAsArrayBuffer(file);
    }
    
    function processImportedData(data) {
        // Aquí puedes personalizar cómo se procesan los datos importados
        // Por ahora, simplemente los agregamos al inventario
        
        const newProducts = data.map(item => ({
            id: item.ID || Date.now().toString(),
            name: item.Nombre || item.Producto || 'Producto sin nombre',
            quantity: parseInt(item.Cantidad || item.Quantity || 0),
            category: item.Categoría || item.Category || '',
            notes: item.Notas || item.Notes || ''
        }));
        
        // Fusionar con productos existentes (actualizar cantidades si ya existen)
        newProducts.forEach(newProduct => {
            const existingIndex = products.findIndex(p => p.id === newProduct.id || p.name.toLowerCase() === newProduct.name.toLowerCase());
            
            if (existingIndex !== -1) {
                // Producto existente - sumar cantidades
                products[existingIndex].quantity += newProduct.quantity;
            } else {
                // Nuevo producto - agregar
                products.push(newProduct);
            }
        });
        
        saveToLocalStorage();
        renderInventoryTable();
    }
    
    // Hacer funciones disponibles globalmente para los botones en la tabla
    window.editProduct = function(id) {
        const product = products.find(p => p.id === id);
        if (product) openAddProductModal(product);
    };
    
    window.deleteProduct = function(id) {
        deleteProduct(id);
    };
    
    window.adjustQuantity = function(id, amount) {
        adjustQuantity(id, amount);
    };
});