# O1234 - Asistente de Documentación

Sistema de preguntas y respuestas inteligente sobre el framework simbólico O1234.

## 🚀 Características

- Interfaz minimalista y moderna
- Respuestas contextuales usando GPT-3.5-turbo
- Preguntas rápidas predefinidas
- Soporte para múltiples idiomas
- Diseño responsive

## 🏗 Estructura del Proyecto

```
o1234-dev/
├── frontend/           # Código fuente del frontend
│   ├── src/           # Archivos fuente
│   ├── public/        # Archivos estáticos
│   └── index.html     # Plantilla HTML principal
├── backend/           # API en FastAPI
│   └── main.py        # Endpoints y lógica
└── docs/             # Build del frontend para GitHub Pages
```

## 💻 Desarrollo Local

1. **Backend**
   ```bash
   cd backend
   uvicorn main:app --reload --port 8005
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   El frontend estará disponible en http://localhost:5173

## 🌐 Flujo de Trabajo

1. Desarrollo en la carpeta `frontend/`
2. Pruebas en local con `npm run dev`
3. Cuando los cambios estén listos:
   - Ejecutar `npm run build` en `frontend/`
   - Los archivos compilados se generarán en `docs/`
4. Commit y push para desplegar en GitHub Pages

## 📦 Despliegue

- **Frontend**: GitHub Pages
  - URL: https://t0t.github.io/o1234-dev/
  - Se despliega automáticamente desde la carpeta `docs/`

- **Backend**: fly.io
  - URL: https://o1234-dev.fly.dev
  - Despliegue manual desde repositorio separado

## 🔒 Variables de Entorno

- `OPENAI_API_KEY`: Requerida para el backend
  - En desarrollo: archivo `.env`
  - En producción: secreto en fly.io

## 🛠 Tecnologías

- Frontend:
  - Vite
  - TailwindCSS
  - JavaScript moderno
  - HTML5

- Backend:
  - FastAPI
  - OpenAI API
  - Python 3.9+

## 📝 Convenciones

- Código en inglés
- Comentarios en español
- Commits en español
- Semantic versioning

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit (`git commit -m 'Añade nueva característica'`)
4. Push (`git push origin feature/NuevaCaracteristica`)
5. Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
