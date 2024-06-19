document.addEventListener('DOMContentLoaded', function() {
    const btnDelete = document.querySelector('.delete');
    const modal_1 = document.querySelector('#modal_1');
    const popupBg = document.querySelector('#popup-bg');
    const close_modal_1 = document.querySelector('#close-modal_1');
    const btn_yes = document.querySelector('#btn-yes');
    const btn_no = document.querySelector('#btn-no');

    btnDelete.addEventListener('click', function() {
        modal_1.classList.add('show');
        popupBg.classList.add('show');
    });

    btn_yes.addEventListener('click', function() {
        modal_1.classList.remove('show');
    });

    const closeModalElements = [popupBg, close_modal_1, btn_no, btn_yes];
    closeModalElements.forEach(function(element) {
        element.addEventListener('click', function() {
            modal_1.classList.remove('show');
            popupBg.classList.remove('show');
        });
    });
});