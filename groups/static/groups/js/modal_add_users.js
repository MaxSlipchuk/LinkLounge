document.addEventListener('DOMContentLoaded', function() {
    const addUsersButton = document.querySelector('#add_users');
    const modal_1 = document.querySelector('#modal_1');
    const popupBg = document.querySelector('#popup-bg');
    const close_modal_1 = document.querySelector('#close-modal_1');
    const groupId = document.getElementById('group-id').textContent;

    addUsersButton.addEventListener('click', function() {
        modal_1.classList.add('show');
        popupBg.classList.add('show');
    });

    const closeModalElements = [popupBg, close_modal_1];
    closeModalElements.forEach(function(element) {
        element.addEventListener('click', function() {
            modal_1.classList.remove('show');
            popupBg.classList.remove('show');
        });
    });

    // Отримуємо всі кнопки додавання користувача
    const addUserButtons = document.querySelectorAll('.add-user-button');
    addUserButtons.forEach(button => {
        // Додаємо обробник події для кожної кнопки додавання користувача
        button.addEventListener('click', function() {
            const userId = this.dataset.userId; // Отримуємо ідентифікатор користувача з атрибуту data-user-id
            fetch(`/add_user_to_group/${groupId}/${userId}/`, {
                method: 'GET', // Виконуємо GET-запит на сервер для додавання користувача до групи
                headers: {
                    'X-Requested-With': 'XMLHttpRequest', // Вказуємо, що це асинхронний запит
                },
            })
            .then(response => response.json()) // Парсимо відповідь сервера як JSON
            .then(data => {
                if (data.status === 'ok') {
                    alert('Користувач доданий до групи'); 
                } else {
                    alert('Сталася помилка'); 
                }
            });
        });
    });
});