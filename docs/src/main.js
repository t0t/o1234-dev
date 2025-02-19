import './styles.css'
import 'tailwindcss/tailwind.css'

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const questionInput = document.getElementById('question')
    const askButton = document.getElementById('ask-button')
    const responseContainer = document.getElementById('response')
    const loadingIndicator = document.getElementById('loading')

    // Función para manejar la pregunta
    const handleQuestion = () => {
        const question = questionInput.value.trim()
        if (question) {
            askQuestion(question)
        }
    }

    // Add event listeners
    askButton.addEventListener('click', handleQuestion)
    
    // Añadir evento de tecla enter
    questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleQuestion()
        }
    })

    // Añadir icono al botón
    askButton.innerHTML = `
        <span class="mr-2">Preguntar</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
        button.className = 'inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200';
        button.textContent = question;
        button.onclick = () => {
            document.getElementById('question').value = question;
            askQuestion(question);
        };
        container.appendChild(button);
    });

    // Insertar después del botón de preguntar
    const askButtonParent = askButton.parentNode;
    askButtonParent.parentNode.insertBefore(container, askButtonParent.nextSibling);
})

// Configuración de la API
const API_URL = 'https://o1234-dev.fly.dev';  // URL del backend en producción

// Función principal para hacer preguntas
async function askQuestion(question) {
    const responseContent = document.getElementById('response');
    const loading = document.getElementById('loading');

    try {
        // Show loading state
        loading.classList.remove('hidden');
        responseContent.innerHTML = '';

        const response = await fetch(`${API_URL}/api/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question })
        });

        const data = await response.json();
        
        // Display the response
        responseContent.innerHTML = `<div class="message p-4 bg-white rounded-lg shadow-sm">${data.response}</div>`;

    } catch (error) {
        responseContent.innerHTML = `<div class="error p-4 bg-red-100 text-red-700 rounded-lg">Error: ${error.message}</div>`;
    } finally {
        loading.classList.add('hidden');
    }
}