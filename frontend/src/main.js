import './styles.css'
import 'tailwindcss/tailwind.css'

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const questionInput = document.getElementById('question')
    const askButton = document.getElementById('ask-button')
    const responseContainer = document.getElementById('response')
    const loadingIndicator = document.getElementById('loading')

    // Add event listeners and application logic here
    console.log('Application initialized')
})

// Debug panel to display request/response information
function createDebugPanel() {
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.className = 'fixed bottom-0 right-0 w-96 bg-gray-800 text-white p-4 overflow-y-auto max-h-96';
    debugPanel.innerHTML = `
        <h3 class="font-bold mb-2">Debug Panel</h3>
        <div id="debug-content" class="text-sm font-mono"></div>
    `;
    document.body.appendChild(debugPanel);
}

// Function to log debug information
function logDebug(message, type = 'info') {
    const debugContent = document.getElementById('debug-content');
    const timestamp = new Date().toLocaleTimeString();
    const colors = {
        info: 'text-blue-400',
        error: 'text-red-400',
        success: 'text-green-400'
    };
    
    debugContent.innerHTML = `
        <div class="${colors[type]} mb-2">
            [${timestamp}] ${message}
        </div>
    ` + debugContent.innerHTML;
    console.log(`[${type.toUpperCase()}] ${message}`);
}

document.addEventListener('DOMContentLoaded', () => {
    // Create debug panel
    createDebugPanel();
    logDebug('Application initialized');

    const questionInput = document.getElementById('question');
    const askButton = document.getElementById('ask-button');
    const responseArea = document.getElementById('response-container');
    const responseContent = document.getElementById('response');
    const loading = document.getElementById('loading');

    // Event listener for the ask button
    askButton.addEventListener('click', () => {
        const question = questionInput.value.trim();
        if (question) {
            logDebug(`Question submitted: ${question}`);
            askQuestion(question);
        } else {
            logDebug('Empty question submitted', 'error');
        }
    });

    // Event listener for Enter key
    questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const question = questionInput.value.trim();
            if (question) {
                logDebug(`Question submitted via Enter key: ${question}`);
                askQuestion(question);
            }
        }
    });

    // Initialize quick questions
    createQuickQuestions();
    logDebug('Quick questions initialized');

    // Remove initial hidden state from response area
    responseArea.classList.remove('hidden');
});

// Preguntas frecuentes predefinidas
const quickQuestions = [
    '¿Qué es O1234?',
    '¿Qué significa el número 0?',
    '¿Qué significa el número 1?',
    '¿Para qué sirve O1234?'
];

// Función para crear preguntas rápidas
function createQuickQuestions() {
    const container = document.getElementById('quick-questions');
    quickQuestions.forEach(question => {
        const button = document.createElement('button');
        button.className = 'inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';
        button.textContent = question;
        button.onclick = () => {
            document.getElementById('question').value = question;
            logDebug(`Quick question selected: ${question}`);
            askQuestion(question);
        };
        container.appendChild(button);
    });
}

// Función principal para hacer preguntas
async function askQuestion(question) {
    const responseArea = document.getElementById('response-container');
    const responseContent = document.getElementById('response');
    const loading = document.getElementById('loading');
    const questionInput = document.getElementById('question');

    if (!responseArea || !responseContent || !loading || !questionInput) {
        console.error('Required DOM elements not found');
        return;
    }

    try {
        // Reset and show loading state
        loading.classList.remove('hidden');
        responseContent.innerHTML = '';
        responseArea.classList.remove('hidden');
        logDebug('Sending request to server...');
        questionInput.disabled = true;

        const response = await fetch('/o1234-qa/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question })
        });

        logDebug(`Server response status: ${response.status}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || (response.status === 404 ? 'Endpoint not found' : 'Error en la solicitud'));
        }

        const data = await response.json();
        logDebug('Response received from server', 'success');
        logDebug(`Response data: ${JSON.stringify(data)}`, 'info');

        if (data.error) {
            throw new Error(data.error);
        }

        // Format and display the response
        const formattedResponse = formatResponse(data.response || '');
        responseContent.innerHTML = `<div class="message assistant p-4 bg-white rounded-lg shadow-sm">${formattedResponse}</div>`;
        responseArea.scrollIntoView({ behavior: 'smooth' });
        logDebug('Response displayed successfully', 'success');

        // Clear input after successful response
        questionInput.value = '';

    } catch (error) {
        logDebug(`Error: ${error.message}`, 'error');
        responseContent.innerHTML = `
            <div class="bg-red-50 border-l-4 border-red-400 p-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-red-700">Lo siento, ha ocurrido un error al procesar tu pregunta. Por favor, intenta de nuevo en unos momentos.</p>
                    </div>
                </div>
            </div>`;
    } finally {
        loading.classList.add('hidden');
        questionInput.disabled = false;
        logDebug('Request completed');
    }
}

// Function to format response text with proper HTML
function formatResponse(text) {
    // Convert URLs to links
    text = text.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" class="text-blue-600 hover:text-blue-800">$1</a>'
    );

    // Convert line breaks to <br>
    text = text.replace(/\n\n/g, '<br><br>');

    // Convert bullet points
    text = text.replace(/\n-/g, '<br>•');

    // Convert numbered lists
    text = text.replace(/\n(\d+)\./g, '<br>$1.');

    return text;
}