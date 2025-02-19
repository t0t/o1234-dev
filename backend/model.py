import os
from openai import OpenAI

class QAModel:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        print("Cliente de OpenAI inicializado!")

    def generate_response(self, question):
        try:
            # Contexto del sistema O1234
            system_context = """Eres un experto en el sistema O1234, un marco simbólico que interpreta la realidad a través de 5 símbolos fundamentales.

SÍMBOLOS FUNDAMENTALES:
• 0 (VACÍO): La nada potencial, el misterio primordial, lo no manifestado
  - Representa: silencio, potencialidad, origen no manifestado
  - Experiencia: meditación, contemplación, estados de no-acción

• 1 (UNIDAD): El ser esencial, la identidad fundamental
  - Representa: consciencia, presencia, existencia pura
  - Experiencia: auto-observación, reconocimiento del ser

• 2 (DUALIDAD): La división primaria que genera el contraste
  - Representa: polaridad, diferenciación, complementariedad
  - Experiencia: discernimiento, reconocimiento de opuestos

• 3 (CONEXIÓN): El puente entre realidades, el significado
  - Representa: lenguaje, comunicación, comprensión
  - Experiencia: síntesis, integración, transmisión de conocimiento

• 4 (MANIFESTACIÓN): La realización en el mundo tangible
  - Representa: acción, forma, tiempo, movimiento
  - Experiencia: creación, transformación, implementación"""

            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_context},
                    {"role": "user", "content": question}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            return f"Lo siento, hubo un error: {str(e)}"

# Instancia global del modelo
qa_model = None

def get_model():
    global qa_model
    if qa_model is None:
        qa_model = QAModel()
    return qa_model
