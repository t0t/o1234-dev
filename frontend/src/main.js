import './styles.css'
import 'tailwindcss/tailwind.css'

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const questionInput = document.getElementById('question')
    const askButton = document.getElementById('ask-button')
    const responseContainer = document.getElementById('response')
    const loadingIndicator = document.getElementById('loading')
    const charCount = document.getElementById('char-count')
    const MAX_LENGTH = 280

    // Función para validar y actualizar la UI
    const validateInput = () => {
        const question = questionInput.value.trim()
        const length = question.length
        
        // Actualizar contador de caracteres
        charCount.textContent = `${length}/${MAX_LENGTH}`
        charCount.classList.toggle('hidden', length === 0)
        
        // Habilitar/deshabilitar botón
        askButton.disabled = length === 0 || length > MAX_LENGTH
        
        // Actualizar clases del input
        questionInput.classList.toggle('border-red-300', length > MAX_LENGTH)
        questionInput.classList.toggle('focus:ring-red-500', length > MAX_LENGTH)
        questionInput.classList.toggle('focus:border-red-500', length > MAX_LENGTH)
        
        return length > 0 && length <= MAX_LENGTH
    }

    // Función para manejar la pregunta
    const handleQuestion = async () => {
        if (!validateInput()) return

        const question = questionInput.value.trim()
        
        // Deshabilitar input y botón durante la petición
        questionInput.disabled = true
        askButton.disabled = true
        
        // Añadir clase de procesando al botón
        askButton.classList.add('processing')
        
        try {
            await askQuestion(question)
        } finally {
            // Restaurar estado
            questionInput.disabled = false
            askButton.disabled = false
            askButton.classList.remove('processing')
            validateInput()
            questionInput.focus()
        }
    }

    // Event listeners
    questionInput.addEventListener('input', validateInput)
    askButton.addEventListener('click', handleQuestion)
    questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && validateInput()) {
            e.preventDefault()
            handleQuestion()
        }
    })

    // Añadir icono al botón
    askButton.innerHTML = `
        <span class="mr-2">Preguntar</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd" />
        </svg>
    `

    // Preguntas frecuentes predefinidas
    const quickQuestions = [
        '¿Qué es O1234?',
        '¿Qué significa el número 0?',
        '¿Qué significa el número 1?',
        '¿Para qué sirve O1234?'
    ];

    // Añadir las preguntas rápidas al DOM
    const container = document.createElement('div');
    container.id = 'quick-questions';
    container.className = 'mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2';
    
    quickQuestions.forEach(question => {
        const button = document.createElement('button');
        button.className = 'inline-flex items-center px-4 py-2 border border-stone-600 shadow-sm text-sm font-medium rounded-md text-stone-300 bg-stone-800 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 hover:shadow';
        button.textContent = question;
        button.onclick = () => {
            questionInput.value = question;
            validateInput();
            handleQuestion();
        };
        container.appendChild(button);
    });

    // Insertar después del botón de preguntar
    const quickQuestionsContainer = document.getElementById('quick-questions');
    quickQuestionsContainer.appendChild(container);

    // Inicializar estado del botón
    validateInput();
})

// Configuración de la API
const API_URL = 'http://localhost:8005';  // URL del backend en desarrollo

// Función principal para hacer preguntas
async function askQuestion(question) {
    const responseContainer = document.getElementById('response')
    const loadingIndicator = document.getElementById('loading')

    try {
        // Mostrar indicador de carga
        loadingIndicator.classList.remove('hidden')
        responseContainer.innerHTML = ''

        // Hacer la petición al backend
        const response = await fetch(`${API_URL}/api/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question })
        })

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor')
        }

        const data = await response.json()

        // Ocultar indicador de carga
        loadingIndicator.classList.add('hidden')

        // Formatear la respuesta
        const formattedResponse = formatResponse(data.response)

        // Mostrar la respuesta con una animación suave
        const responseElement = document.createElement('div')
        responseElement.className = 'mt-4 bg-gray-800 rounded-lg p-8 opacity-0 transition-opacity duration-300'
        responseElement.innerHTML = formattedResponse
        
        responseContainer.appendChild(responseElement)
        // Forzar un reflow para que la animación funcione
        responseElement.offsetHeight
        responseElement.classList.remove('opacity-0')

    } catch (error) {
        // Ocultar indicador de carga
        loadingIndicator.classList.add('hidden')

        // Mostrar error con animación suave
        const errorElement = document.createElement('div')
        errorElement.className = 'mt-4 bg-red-50 text-red-700 rounded-lg p-4 opacity-0 transition-opacity duration-300'
        errorElement.innerHTML = `
            <div class="flex items-center">
                <svg class="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <p>Error: ${error.message}</p>
            </div>
        `
        
        responseContainer.appendChild(errorElement)
        // Forzar un reflow para que la animación funcione
        errorElement.offsetHeight
        errorElement.classList.remove('opacity-0')
    }
}

// Función para formatear la respuesta
function formatResponse(text) {
    // Dividir el texto en líneas
    let lines = text.split('\n')
    
    // Procesar cada línea
    lines = lines.map(line => {
        // Detectar y formatear títulos
        if (line.startsWith('Objetivos principales:')) {
            return `<h1>${line}</h1>`
        }
        if (line.match(/^\d+\.\s+\*\*[^*]+\*\*/)) {
            return `<h2>${line.replace(/^\d+\.\s+\*\*([^*]+)\*\*/, '$1')}</h2>`
        }
        
        // Formatear texto en negrita
        line = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        
        // Formatear listas
        if (line.startsWith('- ')) {
            return `<li>${line.substring(2)}</li>`
        }
        if (line.match(/^\d+\./)) {
            return `<li>${line}</li>`
        }
        
        // Envolver el resto en párrafos si no está vacío
        return line.trim() ? `<p>${line}</p>` : ''
    })
    
    // Agrupar elementos de lista
    let html = ''
    let inList = false
    
    lines.forEach(line => {
        if (line.startsWith('<li>') && !inList) {
            html += '<ul>'
            inList = true
        } else if (!line.startsWith('<li>') && inList) {
            html += '</ul>'
            inList = false
        }
        html += line
    })
    
    if (inList) {
        html += '</ul>'
    }
    
    return html
}