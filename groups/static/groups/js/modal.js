document.addEventListener('DOMContentLoaded', function() {
    const addUsersButton = document.querySelector('#add_users');
    const modal_1 = document.querySelector('#modal_1');
    const popupBg = document.querySelector('#popup-bg');
    const close_modal_1 = document.querySelector('#close-modal_1');
    const btn_next_modal = document.querySelector('#next_modal');
    const groupId = document.getElementById('group-id').textContent;

    addUsersButton.addEventListener('click', function() {
        modal_1.classList.add('show');
        popupBg.classList.add('show');
    });

    btn_next_modal.addEventListener('click', function() {
        modal_1.classList.remove('show');
    });

    const closeModalElements = [popupBg, close_modal_1];
    closeModalElements.forEach(function(element) {
        element.addEventListener('click', function() {
            modal_1.classList.remove('show');
            popupBg.classList.remove('show');
        });
    });

    const addUserButtons = document.querySelectorAll('.add-user-button');
    addUserButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.dataset.userId;
            fetch(`/add_user_to_group/${groupId}/${userId}/`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            })
            .then(response => response.json())
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