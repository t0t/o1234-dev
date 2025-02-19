import './styles.css'
import 'tailwindcss/tailwind.css'

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const questionInput = document.getElementById('question')
    const askButton = document.getElementById('ask-button')
    const responseContainer = document.getElementById('response')
    const loadingIndicator = document.getElementById('loading')

    // Add event listeners
    askButton.addEventListener('click', () => {
        const question = questionInput.value.trim()
        if (question) {
            askQuestion(question)
        }
    })

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
        button.className = 'inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';
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
const API_URL = 'http://127.0.0.1:8005';

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