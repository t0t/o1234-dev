---
title: Documentos Qa
emoji: 🌍
colorFrom: pink
colorTo: blue
sdk: docker
pinned: false
license: apache-2.0
---

# Documentos-QA 📚

Una aplicación web que permite hacer preguntas sobre documentos usando un modelo de lenguaje de código abierto.

## 🌟 Características

- Interfaz web moderna y responsive
- Procesamiento de documentos PDF y texto
- Búsqueda semántica usando embeddings
- Modelo de lenguaje de código abierto (flan-alpaca-large)
- Soporte para temas claro/oscuro
- Interfaz en español

## 🛠️ Tecnologías

- **Backend**: FastAPI, LangChain, Chroma DB
- **Frontend**: HTML5, CSS3, JavaScript moderno
- **Modelo**: declare-lab/flan-alpaca-large (2.7GB)
- **Base de Datos**: Chroma (vectorial)
- **Despliegue**: Hugging Face Spaces

## 🚀 Uso en Hugging Face Spaces

La aplicación está desplegada en [Hugging Face Spaces](https://huggingface.co/spaces/t0t01234/documentos-qa).

1. Visita el espacio en Hugging Face
2. Espera a que el contenedor se inicie (~2 minutos)
3. Haz preguntas sobre los documentos cargados

## 💻 Desarrollo Local

### Requisitos

- Python 3.10+
- pip

### Instalación

1. Clona el repositorio:
```bash
git clone https://huggingface.co/spaces/t0t01234/documentos-qa
cd documentos-qa
```

2. Instala las dependencias:
```bash
pip install -r requirements.txt
```

3. Ejecuta la aplicación:
```bash
python -m uvicorn app.app:app --reload
```

4. Abre http://localhost:8000 en tu navegador

## 📝 Uso

1. La aplicación viene con documentos de ejemplo
2. Escribe tu pregunta en el campo de texto
3. Presiona "Preguntar" o Enter
4. Espera la respuesta del modelo

## 🔧 Configuración

Las configuraciones principales están en `app/config.py`:

- `MODEL_ID`: Modelo a utilizar
- `MAX_LENGTH`: Longitud máxima de respuesta
- `TEMPERATURE`: Temperatura para generación

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del repositorio
2. Crea una rama para tu feature
3. Haz commit de tus cambios
4. Envía un pull request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
