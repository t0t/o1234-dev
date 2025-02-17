document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('question-form');
    const input = document.getElementById('question-input');
    const submitBtn = document.getElementById('submit-btn');
    const messagesContainer = document.getElementById('chat-messages');

    // Función para añadir un mensaje al chat
    function addMessage(content, type = 'assistant') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = content;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Función para manejar errores
    function handleError(error) {
        addMessage(`Error: ${error.message}`, 'error');
        submitBtn.disabled = false;
        input.disabled = false;
    }

    // Manejar el envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const question = input.value.trim();
        if (!question) return;

        // Deshabilitar input y botón mientras se procesa
        submitBtn.disabled = true;
        input.disabled = true;

        // Añadir la pregunta del usuario al chat
        addMessage(question, 'user');

        try {
            // Enviar la pregunta al backend
            const response = await fetch('/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });

            if (!response.ok) {
                throw new Error('Error al obtener respuesta del servidor');
            }

            const data = await response.json();
            
            // Añadir la respuesta al chat
            addMessage(data.response);

        } catch (error) {
            handleError(error);
        } finally {
            // Rehabilitar input y botón
            submitBtn.disabled = false;
            input.disabled = false;
            input.value = '';
            input.focus();
        }
    });

    // Manejar el estado de carga inicial
    const updateSystemStatus = () => {
        const statusDiv = document.getElementById('system-status');
        fetch('/health')
            .then(response => {
                if (response.ok) {
                    statusDiv.innerHTML = `
                        <p>✅ Sistema listo</p>
                        <p>💾 Base de conocimiento cargada</p>
                        <p>🤖 Modelo AI activo</p>
                    `;
                } else {
                    throw new Error();
                }
            })
            .catch(() => {
                statusDiv.innerHTML = `
                    <p>❌ Sistema no disponible</p>
                    <p>Por favor, intenta más tarde</p>
                `;
            });
    };

    // Actualizar estado cada 30 segundos
    updateSystemStatus();
    setInterval(updateSystemStatus, 30000);
});
