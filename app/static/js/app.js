document.addEventListener('DOMContentLoaded', function() {
    const questionInput = document.getElementById('question');
    const askButton = document.getElementById('askButton');
    const responseArea = document.getElementById('responseArea');
    const response = document.getElementById('response');
    const loading = document.getElementById('loading');
    const quickQuestions = document.querySelectorAll('.quick-question');

    // Función para hacer la pregunta
    async function askQuestion(question) {
        try {
            // Mostrar loading y ocultar respuesta anterior
            loading.classList.remove('hidden');
            responseArea.classList.add('hidden');

            // Hacer la petición
            const res = await fetch('/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: question })
            });

            // Procesar respuesta
            const data = await res.json();
            
            // Formatear la respuesta (convertir saltos de línea en <br>)
            const formattedResponse = data.response.replace(/\n/g, '<br>');
            
            // Mostrar la respuesta
            response.innerHTML = formattedResponse;
            responseArea.classList.remove('hidden');
            responseArea.classList.add('fade-in');

        } catch (error) {
            console.error('Error:', error);
            response.innerHTML = 'Lo siento, ha ocurrido un error al procesar tu pregunta.';
            responseArea.classList.remove('hidden');
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
