document.addEventListener('DOMContentLoaded', function() {
    const deleteButtons = document.querySelectorAll('.delete');
    const modal_1 = document.querySelector('#modal_1');
    const popupBg = document.querySelector('#popup-bg');
    const close_modal_1 = document.querySelector('#close-modal_1');
    const btn_no = document.querySelector('#btn-no');
    const btn_yes = document.querySelector('#btn-yes');
    const modalUsername = document.querySelector('#modal-username');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const chatId = this.getAttribute('data-chat-id');
            const chatUsername = this.getAttribute('data-chat-username');

            btn_yes.value = chatId;
            modalUsername.textContent = chatUsername;

            modal_1.classList.add('show');
            popupBg.classList.add('show');
        });
    });

    const closeModalElements = [popupBg, close_modal_1, btn_no];
    closeModalElements.forEach(function(element) {
        element.addEventListener('click', function() {
            modal_1.classList.remove('show');
            popupBg.classList.remove('show');
        });
    });
});