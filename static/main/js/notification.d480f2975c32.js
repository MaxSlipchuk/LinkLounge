// document.addEventListener('DOMContentLoaded', (event) => {
//     // Використовуємо глобальні змінні userId і username
//     const notificationSocket = new WebSocket(
//         'ws://' + window.location.host + '/ws/notify/' + userId + '/'
//     );

//     notificationSocket.onmessage = function(e) {
//         const data = JSON.parse(e.data);
//         if (data.notification) {
//             if (Notification.permission === 'granted') {
//                 const notification = new Notification("Нове сповіщення", {
//                     body: `${data.from_user} надіслав вам повідомлення: ${data.notification}`,
//                     icon: '/path/to/icon.png'
//                 });

//                 notification.onclick = function() {
//                     window.focus();  // Зробити вкладку активною
//                     this.close();    // Закрити сповіщення
//                 };
//             }
//         }
//     };

//     notificationSocket.onclose = function(e) {
//         console.error('Notification socket closed unexpectedly');
//     };

//     notificationSocket.onerror = function(error) {
//         console.error('WebSocket error:', error);
//     };

//     if (Notification.permission === 'default' || Notification.permission === 'denied') {
//         Notification.requestPermission().then(function(permission) {
//             if (permission === 'granted') {
//                 console.log('Notification permission granted.');
//             }
//         });
//     }
// });