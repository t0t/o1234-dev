# Estructura del Proyecto O1234

## 🏠 Explicación Simple

Imagina que tienes:

1. Una "casa principal" (`o1234-dev`):
   - Contiene TODO el proyecto (frontend, backend, docs)
   - Está en tu ordenador local y en GitHub
   - El frontend se despliega automáticamente desde la carpeta `/docs` a GitHub Pages

2. Un "apartamento" separado (`o1234-backend`):
   - Es una copia SOLO del backend
   - Se usa exclusivamente para desplegar en fly.io
   - Cuando haces cambios en `/o1234-dev/backend`, debes copiarlos manualmente a este repositorio

Esta estructura nos permite:
- Tener todo el código junto para desarrollo
- Desplegar el frontend fácilmente en GitHub Pages
- Desplegar el backend de forma limpia en fly.io

## 📦 Repositorios

### 1. Repositorio Principal: `o1234-dev`
- **URL**: https://github.com/t0t/o1234-dev
- **Descripción**: Contiene tanto el frontend como el backend
- **Ramas**: 
  - `main`: Rama principal

### 2. Repositorio Backend: `o1234-backend`
- **URL**: https://github.com/t0t/o1234-backend
- **Descripción**: Copia separada del backend para despliegue en fly.io
- **Ramas**:
  - `main`: Rama principal

## 📂 Estructura de Carpetas

### En `o1234-dev` (Repositorio Principal)
```
o1234-dev/
├── backend/                 # Código del backend
│   ├── main.py             # Configuración de FastAPI y CORS
│   ├── model.py            # Lógica de OpenAI
│   ├── api.py              # Endpoints de la API
│   ├── requirements.txt    # Dependencias Python
│   └── Dockerfile          # Configuración para fly.io
│
├── docs/                   # Frontend desplegado en GitHub Pages
│   ├── assets/            # Archivos generados por Vite
│   ├── src/
│   │   ├── main.js        # Lógica principal del frontend
│   │   └── styles.css     # Estilos Tailwind
│   ├── index.html         # Página principal
│   ├── favicon.svg        # Favicon del sitio
│   └── package.json       # Dependencias Node.js
│
├── frontend/              # Código fuente del frontend
│   ├── src/              # Código fuente original
│   ├── public/           # Archivos estáticos
│   └── package.json      # Configuración del proyecto
│
├── .gitignore            # Archivos ignorados por git
├── README.md             # Documentación principal
├── estructura.md         # Este archivo
└── fly.toml              # Configuración de fly.io
```

### En `o1234-backend` (Repositorio Separado)
```
o1234-backend/
├── main.py              # Configuración de FastAPI y CORS
├── model.py             # Lógica de OpenAI
├── api.py               # Endpoints de la API
├── requirements.txt     # Dependencias Python
├── Dockerfile          # Configuración para fly.io
├── README.md           # Documentación específica del backend
└── fly.toml            # Configuración de fly.io
```

## 🔄 Flujo de Trabajo

1. **Desarrollo Local**
   - Trabajar en el repositorio `o1234-dev`
   - Frontend en `http://localhost:5173`
   - Backend en `http://localhost:8080`

2. **Despliegue Frontend**
   - Los cambios en `/frontend` se compilan a `/docs`
   - GitHub Pages sirve el contenido de `/docs`
   - URL: https://t0t.github.io/o1234-dev/

3. **Despliegue Backend**
   - Los cambios en `/backend` se copian a `o1234-backend`
   - Se despliega en fly.io
   - URL: https://o1234-dev.fly.dev

## 🔑 Configuración

### Variables de Entorno
- **Desarrollo**: Archivo `.env` en `/backend`
- **Producción**: Secretos en fly.io

### URLs
- **Frontend Desarrollo**: `http://localhost:5173`
- **Frontend Producción**: `https://t0t.github.io/o1234-dev/`
- **Backend Desarrollo**: `http://localhost:8080`
- **Backend Producción**: `https://o1234-dev.fly.dev`

## 📝 Notas Importantes

1. El directorio `/docs` es generado automáticamente al hacer build del frontend
2. Los cambios en el backend deben sincronizarse manualmente con `o1234-backend`
3. La configuración CORS en el backend incluye todas las URLs necesarias
4. Los archivos de build no deben editarse directamente
