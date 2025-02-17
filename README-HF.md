---
title: O1234 Asistente de Documentación
emoji: 📚
colorFrom: indigo
colorTo: blue
sdk: docker
pinned: false
app_port: 7860
fullscreen: false
hide_header: true
---

# O1234 Asistente de Documentación

Este espacio proporciona un asistente inteligente para consultar documentación sobre O1234.

## 🌟 Características

- Interfaz web moderna y responsive
- Procesamiento de documentos PDF y texto
- Búsqueda semántica usando embeddings
- Modelo de lenguaje de código abierto (flan-alpaca-large)
- Soporte para temas claro/oscuro
- Interfaz en español

## 🚀 Uso

1. Espera a que el contenedor se inicie (~2 minutos)
2. Haz preguntas sobre los documentos cargados
3. El modelo procesará tu pregunta y dará una respuesta basada en los documentos

## 🛠️ Tecnologías

- Backend: FastAPI, LangChain, Chroma DB
- Frontend: HTML5, CSS3, JavaScript moderno
- Modelo: declare-lab/flan-alpaca-large (2.7GB)
- Base de Datos: Chroma (vectorial)

## 📝 Notas

- Primera carga: ~2 minutos (descarga del modelo)
- RAM requerida: 4GB mínimo
- CPU: 2 vCPUs recomendado
- Espacio en disco: ~3GB
