# O1234 - Sistema de Documentación Inteligente

Sistema de preguntas y respuestas basado en el marco simbólico O1234, utilizando OpenAI GPT para proporcionar respuestas contextualizadas.

## Características

- 🤖 Integración con OpenAI GPT-3.5
- 🌐 Frontend moderno con Vite y TailwindCSS
- ⚡ Backend rápido con FastAPI
- 💡 Preguntas rápidas predefinidas
- 🎨 Interfaz responsiva y amigable

## Estructura del Proyecto

```
├── backend/           # Servidor FastAPI
│   ├── main.py       # Punto de entrada
│   ├── model.py      # Lógica del modelo
│   └── api.py        # Rutas de la API
│
└── frontend/         # Cliente web (Vite)
    ├── src/          # Código fuente
    ├── public/       # Archivos estáticos
    └── index.html    # Página principal
```

## Requisitos

- Python 3.12+
- Node.js 18+
- API key de OpenAI

## Desarrollo Local

1. **Backend**
```bash
# Crear entorno virtual
python -m venv venv
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar API key
export OPENAI_API_KEY="tu-api-key"

# Iniciar servidor
uvicorn main:app --reload --port 8005
```

2. **Frontend**
```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## Despliegue

El proyecto está configurado para desplegarse en:
- Backend: fly.io
- Frontend: Netlify/Vercel/GitHub Pages

## Licencia

Este proyecto es privado y confidencial.
# o1234-dev
