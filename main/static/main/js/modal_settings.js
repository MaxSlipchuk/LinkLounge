
// налаштування паролей
function setPassword(){
    let oldPassword = document.querySelector('#id_password')
    let newPassword = document.querySelector('#id_new_password')
    let confirmPassword = document.querySelector('#id_confirm_password')

    newPassword.setAttribute('disabled', 'disabled');
    newPassword.style.backgroundColor = "#A9A9A9";
    confirmPassword.setAttribute('disabled', 'disabled');
    confirmPassword.style.backgroundColor = "#A9A9A9";
    console.log(oldPassword);
    if (oldPassword){
        console.log('активна');
        oldPassword.addEventListener('input', function() {
            console.log('активна');
            // document.getElementById('new-password').setAttribute('disabled', 'disabled');
            if (oldPassword.value.trim().length === 0) {
                // sendButton.disabled = true;  // якщо поле порожнє або містить лише пробіли
                console.log('неактивна');
                newPassword.setAttribute('disabled', 'disabled');
                confirmPassword.setAttribute('disabled', 'disabled');
                newPassword.style.backgroundColor = "#A9A9A9";
                confirmPassword.style.backgroundColor = "#A9A9A9";  
            } else {
                // sendButton.disabled = false; // активуємо, якщо є текст
                console.log('активна');
                newPassword.style.backgroundColor = "";
                confirmPassword.style.backgroundColor = "";
                newPassword.removeAttribute("disabled");
                confirmPassword.removeAttribute("disabled");
            }
        });
    }    
}



function initializeModalSettings() {
    let icon = document.querySelector('.svg-icon');
    let popupBg = document.querySelector('#popup-bg');
    let modalSettings = document.querySelector('#modal-settings');
    let closeModalSettings = document.querySelector('#close-modal-settings');
    console.log('js налаштувань');

    if (icon && popupBg && modalSettings && closeModalSettings) {
        icon.addEventListener('click', function(){
            popupBg.classList.add('show');
            modalSettings.classList.add('show');
            console.log('натискаємо на налаштування');

            setPassword()
            // displayErrors()
            $('.form-error').remove();
        });

        const closeModalElements = [popupBg, closeModalSettings];
        closeModalElements.forEach(function(element) {
            element.addEventListener('click', function() {
                modalSettings.classList.remove('show');
                popupBg.classList.remove('show');
                $('.form-control').css('border-color', '');
            });
        });
    }
}

function clearFieldErrors(input) {
    $(input).css('border-color', '');  // Знімаємо червону рамку
    $(input).next('.form-error').remove();  // Видаляємо повідомлення про помилку
}


$(document).ready(function() {
    initializeModalSettings();
    console.log('test');

    
    $('.form-set').on('submit', function(event) {
        event.preventDefault();
        const form = $(this);
        
        $.ajax({
            type: 'POST',
            url: '/main/',
            data: form.serialize(),
            success: function(response) {
                if (response.status === 'valid') {
                    console.log('форма валідна');
                    let data = response.data

                    $('.form-control').each(function() {
                        clearFieldErrors(this);
                    });

                    let usernameAside = document.querySelector('.a-side-bar-3-text')
                    let usernameMain = document.querySelector('.username')
                    let firstName = document.querySelector('#first-name')
                    let lastName = document.querySelector('#last-name')

                    usernameAside.textContent = `@${data['username']}`
                    usernameMain.textContent = `@${data['username']}`
                    firstName.textContent = `${data['first_name']}`
                    lastName.textContent = `${data['last_name']}`
                    console.log(username)
                    // alert('зміни збереглись')
                    let modalSet = document.querySelector('#modal-settings')
                    let popupBg = document.querySelector('#popup-bg')
                    modalSet.classList.remove('show')
                    popupBg.classList.remove('show')

                } else if (response.status === 'invalid') {
                    console.log('форма не валідна');

                    displayErrors(response.errors);  
                }
            }
        });
    });

    function displayErrors(errors) {
        $('.form-error').remove();
        $('.form-control').css('border-color', ''); 
        
        $.each(JSON.parse(errors), function(field, errorList) {
            let errorText = errorList[0].message;  // Отримуємо першу помилку для кожного поля
            let input = $('[name=' + field + ']');
            console.log(input)
            $(input).css('border-color', 'red');
            input.after(`<div class="form-error text-danger">${errorText}</div>`);
        });
    }

});











// $('#btn-yes').on('click', function(event) {
//     event.preventDefault();
//     const groupId = $('#delete-group-id').val();
//     $.ajax({
//         url: '/delete_group_ajax/',
//         type: 'POST',
//         data: {
//             form_user: groupId,
//             csrfmiddlewaretoken: $('[name=csrfmiddlewaretoken]').val()
//         },
//         success: function(response) {
//             if (response.status === 'invalid') {
//                 console.log('порядок');
//             } else {
//                 console.log('помилка');
//             }
//         },
//     });
// });

// Викликаємо функцію при початковому завантаженні сторінки
// document.addEventListener('DOMContentLoaded', () => {
//     initializeModalSettings();
// });