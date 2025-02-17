---
title: Documentos Qa
emoji: 🌍
colorFrom: pink
colorTo: blue
sdk: docker
pinned: false
license: apache-2.0
---

# Asistente de Documentos con LangChain y FastAPI

Esta aplicación permite hacer preguntas sobre tus documentos usando un modelo de lenguaje open source y una base de datos vectorial local.

## Características

- 🚀 Backend con FastAPI
- 💾 Base de datos vectorial local con Chroma
- 🤖 Modelo de lenguaje open source (flan-alpaca-large)
- 📱 Frontend responsive con HTML5 y CSS Grid
- 🔄 Sistema de routing y componentes
- 🎨 Diseño moderno y accesible

## Requisitos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)
- Aproximadamente 3GB de espacio en disco para el modelo

## Instalación

1. Clona el repositorio:
```bash
git clone <tu-repositorio>
cd <tu-repositorio>
```

2. Instala las dependencias:
```bash
pip install -r requirements.txt
```

3. Coloca tus documentos en la carpeta `app/documents/`. Se aceptan:
   - PDFs (*.pdf)
   - Archivos de texto (*.txt)
   - Imágenes (*.jpg, *.png) - se extraerá el texto

4. Procesa los documentos:
```bash
python app/ingest.py
```

## Uso Local

1. Inicia el servidor:
```bash
cd app
uvicorn app:app --reload
```

2. Abre tu navegador en `http://localhost:8000`

## Despliegue en Hugging Face Spaces

1. Crea un nuevo Space en Hugging Face:
   - Tipo: "Custom"
   - Framework: "FastAPI"

2. Sube el código:
```bash
git remote add space https://huggingface.co/spaces/TU_USUARIO/TU_SPACE
git push space main
```

3. Configura los requisitos de hardware:
   - RAM: Mínimo 4GB
   - CPU: 2 vCPUs

## Consejos

- El modelo `flan-alpaca-large` requiere aproximadamente 2.7GB de RAM
- La primera carga puede tardar unos minutos
- Los documentos muy grandes se dividen automáticamente en chunks
- La base de datos vectorial se guarda en `app/chroma_data/`

## Limitaciones

- Tamaño máximo de respuesta: 512 tokens
- Tiempo de respuesta: 2-5 segundos por pregunta
- El modelo funciona mejor con preguntas claras y específicas

## Soporte

Si encuentras algún problema, por favor abre un issue en el repositorio.

Para más información sobre la configuración de Spaces, visita: https://huggingface.co/docs/hub/spaces-config-reference
