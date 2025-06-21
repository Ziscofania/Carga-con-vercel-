# Sistema de Inventario - Prueba de Carga para Vercel

## Descripción del Proyecto

Este sistema de inventario fue desarrollado como una prueba técnica para evaluar:
- La capacidad de despliegue en **Vercel** (plataforma de hosting para aplicaciones web y APIs)
- El manejo de cargas de datos mediante archivos Excel
- La creación de entornos virtuales en Python
- La estructuración de proyectos fullstack (frontend + backend)

## ¿Qué es Vercel?

Vercel es una plataforma en la nube especializada en:
- Hosting de aplicaciones web estáticas y dinámicas
- Despliegue automático desde repositorios Git
- Escalado automático para manejar tráfico variable
- Funciones serverless para backend
- Ideal para proyectos con Next.js, React, Node.js y Python

## Arquitectura del Sistema

El proyecto está dividido en dos partes principales:

### Frontend (Interfaz de Usuario)
- Tecnologías: HTML5, CSS3, JavaScript puro
- Características:
  - Interfaz moderna con diseño responsive
  - Manejo de inventario con CRUD completo
  - Importación/exportación de datos en Excel
  - Filtrado y búsqueda en tiempo real

### Backend (Lógica y Datos)
- Tecnologías: Python + Flask
- Estructura:
  - `app.py`: Punto de entrada con todas las rutas API
  - `database.py`: Manejo de conexión a base de datos SQLite
  - `requirements.txt`: Lista de dependencias necesarias

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Python 3.8+
- Navegador web moderno
- Git (opcional para clonación)

### Pasos para Configuración

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git
   cd tu-repositorio
   ```

    Configurar entorno virtual:
```bash

python -m venv venv
```
Activar el entorno virtual:

Windows:
```bash

venv\Scripts\activate
```

Linux/Mac:
```bash

source venv/bin/activate
```
Instalar dependencias del backend:
```bash
cd backend
pip install -r requirements.txt
cd ..
```
Iniciar el servidor backend:
```bash
cd backend/src
python app.py
```
Abrir el frontend:

        Abrir frontend/src/index.html en tu navegador

        O usar extensión "Live Server" en VS Code

📊 Funcionalidades Clave

    Gestión de Inventario:

        Añadir/editar/eliminar productos

        Ajustar cantidades (+1/-1)

        Agregar notas y categorías

    Importación/Exportación:

        Cargar datos desde archivos Excel

        Exportar inventario completo a Excel

        Mapeo automático de columnas

    Filtrado y Búsqueda:

        Búsqueda en tiempo real

        Filtrado por categorías

        Ordenamiento por columnas

🧪 Pruebas Técnicas Implementadas

    Prueba de Carga:

        Simulación de múltiples usuarios accediendo simultáneamente

        Medición de tiempos de respuesta

        Evaluación del consumo de recursos

    Prueba de Requerimientos:

        Validación de instalación automática de dependencias

        Verificación de versiones compatibles

        Prueba de entorno virtual aislado
