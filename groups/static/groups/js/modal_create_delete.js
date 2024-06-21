document.addEventListener('DOMContentLoaded', function() {
    const btnCreate = document.querySelector('.btn-create');
    const deleteButtons = document.querySelectorAll('.delete');
    const modalCreate = document.querySelector('#modal-create-group');
    const modalDelete = document.querySelector('#modal-delete-group');
    const popupBg = document.querySelector('#popup-bg');
    const closeModalCreate = document.querySelector('#close-modal-create-group');
    const closeModalDelete = document.querySelector('#close-modal-delete-group');
    const btnYes = document.querySelector('#btn-yes');
    const btnNo = document.querySelector('#btn-no');

    btnCreate.addEventListener('click', function() {
        modalCreate.classList.add('show');
        popupBg.classList.add('show');
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            modalDelete.classList.add('show');
            popupBg.classList.add('show');
        });
    });

    const closeModalElements = [popupBg, closeModalCreate, closeModalDelete, btnNo, btnYes];
    closeModalElements.forEach(function(element) {
        element.addEventListener('click', function() {
            modalCreate.classList.remove('show');
            modalDelete.classList.remove('show');
            popupBg.classList.remove('show');
        });
    });
});