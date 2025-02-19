document.addEventListener('DOMContentLoaded', function() {
    const questionInput = document.getElementById('question');
    const askButton = document.getElementById('askButton');
    const responseArea = document.getElementById('responseArea');
    const responseContent = document.getElementById('response');
    const loading = document.getElementById('loading');
    const quickQuestions = document.querySelectorAll('.quick-question');

    // Función para hacer la pregunta
    async function askQuestion(question) {
        try {
            // Mostrar loading y ocultar respuesta anterior
            loading.classList.remove('hidden');
            responseArea.classList.add('hidden');

            const response = await fetch('http://localhost:8000/api/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: question })
            });

            responseContent.innerHTML = '<div class="animate-pulse">Procesando pregunta...</div>';

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Error en la solicitud';
                
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.detail || errorMessage;
                } catch (e) {
                    errorMessage = errorText || errorMessage;
                }
                
                logDebug(`Error del servidor: ${errorMessage}`, 'error');
                throw new Error(errorMessage);
            }

            try {
                let data;
                try {
                    data = await response.json();
                } catch (e) {
                    logDebug(`Error parseando respuesta JSON: ${e.message}`, 'error');
                    throw new Error('Respuesta inválida del servidor');
                }
                
                if (data.response) {
                    // Convertir saltos de línea en <br> y formatear listas
                    const formattedResponse = data.response
                        .replace(/\n\n/g, '<br><br>')
                        .replace(/\n-/g, '<br>•')
                        .replace(/\n(\d+)\./g, '<br>$1.');
                    
                    responseContent.innerHTML = `<div class="response-content">${formattedResponse}</div>`;
                } else {
                    throw new Error('Respuesta vacía del servidor');
                }

                // Mostrar la respuesta
                responseArea.classList.remove('hidden');
                responseArea.classList.add('fade-in');

            } catch (error) {
                responseContent.innerHTML = `
                    <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                                </svg>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-red-700">
                                    ${error.message}
                                </p>
                            </div>
                        </div>
                    </div>`;
                console.error('Error:', error);
            } finally {
                loading.classList.add('hidden');
            }
        } catch (error) {
            responseContent.innerHTML = `
                <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-red-700">
                                ${error.message}
                            </p>
                        </div>
                    </div>
                </div>`;
            console.error('Error:', error);
        } finally {
            loading.classList.add('hidden');
        }
    }

    // Event listener para el botón de preguntar
    askButton.addEventListener('click', () => {
        const question = questionInput.value.trim();
        if (question) {
            askQuestion(question);
        }
    });

    // Event listener para el input (Enter)
    questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const question = questionInput.value.trim();
            if (question) {
                askQuestion(question);
            }
        }
    });

    // Event listeners para preguntas rápidas
    quickQuestions.forEach(button => {
        button.addEventListener('click', () => {
            const question = button.textContent.trim();
            questionInput.value = question;
            askQuestion(question);
        });
    });

    // Función para formatear la respuesta
    function formatResponse(text) {
        // Convertir URLs en enlaces
        text = text.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank" class="text-blue-600 hover:text-blue-800">$1</a>'
        );

        // Convertir listas
        text = text.replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>');
        text = text.replace(/(<li>.*<\/li>)/s, '<ul class="list-disc pl-5">$1</ul>');

        return text;
    }
});
