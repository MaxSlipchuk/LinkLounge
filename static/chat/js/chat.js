document.addEventListener('DOMContentLoaded', (event) => {
    const chatId = window.location.pathname.split('/').slice(-2, -1)[0];
    const chatSocket = new WebSocket(
        'wss://' + window.location.host + '/ws/chat/' + chatId + '/'
    );

    const messagesContainer = document.querySelector('.messages');
    const messageInputDom = document.querySelector('#message-input');
    const sendButton = document.querySelector('.btn-send');

    // Деактивувати кнопку при завантаженні
    sendButton.disabled = true;

    // Активація або деактивація кнопки залежно від введеного тексту
    messageInputDom.addEventListener('input', function() {
        if (messageInputDom.value.trim() === '') {
            sendButton.disabled = true;  // якщо поле порожнє або містить лише пробіли
            console.log('неактивна');
        } else {
            sendButton.disabled = false; // активуємо, якщо є текст
            console.log('активна');
        }
    });

    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);

        if (data.error) {
            console.error("Отримано помилку:", data.error);
            return; // Просто повертаємо і нічого не робимо з повідомленням
        }

        if (data.message && data.username) {
            // Якщо дані містять повідомлення та ім'я користувача
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            if (data.username === user) {
                messageElement.classList.add('me');
            } else {
                messageElement.classList.add('other');
            }
            messageElement.innerHTML = `
                <div class="message-content">
                    <strong class="message-username"><span>@</span>${data.username}</strong>
                    <span class="message-text">${data.message}</span>
                </div>`;
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            console.log(`має з'явитись блок з іменем ${data.username} і повідомленням ${data.message}`);
        } else if (data.notification && data.from_user) {
            // Якщо дані містять сповіщення
            console.log(`Отримано сповіщення: ${data.notification} від користувача ${data.from_user}`);
            // Тут можна додати обробку сповіщення, наприклад, показати його на сторінці
        } else {
            console.error("Отримано некоректні дані:", data);
        }
    };

    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };

    document.querySelector('#chat-form').onsubmit = function(e) {
        e.preventDefault();
        const message = messageInputDom.value.trim();

        // Перевіряємо, щоб повідомлення не було порожнім
        if (message === '') {
            console.warn('Порожнє повідомлення не може бути відправлено.');
            return;
        }

        chatSocket.send(JSON.stringify({
            'message': message,
            'username': user
        }));

        // Очищуємо поле введення і деактивуємо кнопку
        messageInputDom.value = '';
        sendButton.disabled = true;
    };

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});