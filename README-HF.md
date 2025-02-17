---
title: Documentos-QA
emoji: 📚
colorFrom: blue
colorTo: indigo
sdk: docker
pinned: false
app_port: 7860
---

# Documentos-QA

Una aplicación web que permite hacer preguntas sobre documentos usando un modelo de lenguaje de código abierto.

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
