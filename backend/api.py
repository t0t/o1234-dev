from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from typing import Dict
from model import get_model

router = APIRouter()

# Diccionario de respuestas detalladas
RESPONSES = {
    "¿Qué es O1234?": """O1234 es un sistema avanzado de gestión documental y base de conocimiento que implementa una metodología única de organización jerárquica. 

Características principales:
- **Organización Inteligente**: Sistema de clasificación numérico que facilita la navegación y búsqueda.
- **Documentación Estructurada**: Cada documento sigue una estructura clara y consistente.
- **Acceso Rápido**: Interfaz intuitiva que permite encontrar información en segundos.
- **Integración Continua**: Se actualiza constantemente con nueva información y mejores prácticas.

El nombre "O1234" representa:
- O: Organización
- 1: Primer nivel de jerarquía
- 2: Segundo nivel de clasificación
- 3: Tercer nivel de especificidad
- 4: Cuarto nivel de detalle

Este sistema está diseñado para mantener la documentación siempre actualizada, accesible y fácil de entender.""",

    "¿Qué significa el número 0?": """El número 0 en O1234 representa el nivel fundamental o raíz del sistema de documentación, actuando como el punto de partida para toda la estructura jerárquica.

Características del nivel 0:
- **Base del Conocimiento**: Contiene los conceptos fundamentales y principios básicos.
- **Visión General**: Proporciona una vista panorámica de todo el sistema.
- **Documentos Maestros**: Almacena las guías principales y documentos de referencia.
- **Políticas Globales**: Define las reglas y estándares que aplican a todos los niveles.

Ejemplos de contenido en nivel 0:
1. Guías de estilo y mejores prácticas
2. Documentación de arquitectura general
3. Políticas de seguridad y compliance
4. Procedimientos estándar de operación

El nivel 0 es esencial para entender la estructura completa del sistema y sus principios fundamentales.""",

    "¿Qué significa el número 1?": """El número 1 en O1234 representa el primer nivel de especialización en la jerarquía documental, donde se organizan las categorías principales de información.

Características del nivel 1:
- **Categorización Principal**: Define las áreas fundamentales del conocimiento.
- **Estructura Organizativa**: Establece la base para la clasificación detallada.
- **Puntos de Entrada**: Actúa como gateway hacia información más específica.
- **Referencias Cruzadas**: Permite la conexión entre diferentes áreas de conocimiento.

Componentes típicos del nivel 1:
1. Documentación técnica
2. Procesos de negocio
3. Guías de usuario
4. Documentación de APIs
5. Manuales de operación

Este nivel es crucial para:
- Navegación eficiente
- Búsqueda rápida
- Organización lógica
- Mantenimiento estructurado""",

    "¿Para qué sirve O1234?": """O1234 es una herramienta integral de gestión del conocimiento diseñada para optimizar la organización, acceso y mantenimiento de la documentación empresarial.

Objetivos principales:
1. **Gestión Eficiente**
   - Organización clara y estructurada
   - Búsqueda rápida y precisa
   - Actualización sencilla y controlada

2. **Mejora de Productividad**
   - Reducción del tiempo de búsqueda
   - Eliminación de duplicados
   - Acceso instantáneo a información crítica

3. **Garantía de Calidad**
   - Validación de contenido
   - Versionado de documentos
   - Trazabilidad de cambios

4. **Colaboración Efectiva**
   - Trabajo en equipo simplificado
   - Compartición de conocimiento
   - Integración de equipos distribuidos

Casos de uso comunes:
- Documentación técnica
- Procesos de negocio
- Guías de usuario
- Políticas y procedimientos
- Base de conocimiento
- Gestión de proyectos

El sistema está diseñado para adaptarse a las necesidades específicas de cada organización mientras mantiene una estructura coherente y fácil de navegar."""
}

@router.options("/ask")
async def options_ask():
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    )

@router.post("/ask")
async def handle_question(question: Dict[str, str]):
    try:
        # Obtener la pregunta del cuerpo de la solicitud
        q = question.get("question", "")
        if not q:
            raise HTTPException(status_code=400, detail="La pregunta no puede estar vacía")
        
        # Primero intentar obtener una respuesta predefinida
        if q in RESPONSES:
            return {"response": RESPONSES[q]}
        
        # Si no hay respuesta predefinida, usar el modelo
        model = get_model()
        response = model.generate_response(q)
        return {"response": response}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
