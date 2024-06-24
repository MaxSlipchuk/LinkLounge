document.addEventListener('DOMContentLoaded', function() {
    const btnCreate = document.querySelector('.btn-create');
    const deleteButtons = document.querySelectorAll('.delete');
    const exitButtons = document.querySelectorAll('.exit');
    const modalCreate = document.querySelector('#modal-create-group');
    const modalDelete = document.querySelector('#modal-delete-group');
    const modalExit = document.querySelector('#modal-exit-group');
    const popupBg = document.querySelector('#popup-bg');
    const closeModalCreate = document.querySelector('#close-modal-create-group');
    const closeModalDelete = document.querySelector('#close-modal-delete-group');
    const closeModalExit = document.querySelector('#close-modal-exit-group');
    const btnYes = document.querySelector('#btn-yes');
    const btnNo = document.querySelector('#btn-no');
    const btnExitYes = document.querySelector('#btn-exit-yes');
    const btnExitNo = document.querySelector('#btn-exit-no');
    const modalGroupname = document.querySelector('#modal-groupname');
    const modalExitGroupname = document.querySelector('#modal-exit-groupname');
    const deleteGroupIdInput = document.querySelector('#delete-group-id');
    const exitGroupIdInput = document.querySelector('#exit-group-id');

    btnCreate.addEventListener('click', function() {
        modalCreate.classList.add('show');
        popupBg.classList.add('show');
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const groupId = this.getAttribute('data-group-id');
            const groupName = this.getAttribute('data-group-name');

            deleteGroupIdInput.value = groupId;
            modalGroupname.textContent = groupName;

            modalDelete.classList.add('show');
            popupBg.classList.add('show');
        });
    });

    exitButtons.forEach(button => {
        button.addEventListener('click', function() {
            const groupId = this.getAttribute('data-group-id');
            const groupName = this.getAttribute('data-group-name');

            exitGroupIdInput.value = groupId;
            modalExitGroupname.textContent = groupName;

            modalExit.classList.add('show');
            popupBg.classList.add('show');
        });
    });

    const closeModalElements = [popupBg, closeModalCreate, closeModalDelete, closeModalExit, btnNo, btnYes, btnExitNo, btnExitYes];
    closeModalElements.forEach(function(element) {
        element.addEventListener('click', function() {
            modalCreate.classList.remove('show');
            modalDelete.classList.remove('show');
            modalExit.classList.remove('show');
            popupBg.classList.remove('show');
        });
    });
});
