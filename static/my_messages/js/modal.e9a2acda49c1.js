document.addEventListener('DOMContentLoaded', function() {
    const deleteButtons = document.querySelectorAll('.delete');
    const modal_1 = document.querySelector('#modal_1');
    const popupBg = document.querySelector('#popup-bg');
    const close_modal_1 = document.querySelector('#close-modal_1');
    const btn_no = document.querySelector('#btn-no');
    const btn_yes = document.querySelector('#btn-yes');
    const modalUsername = document.querySelector('#modal-username');
    // для сповіщення 
    let senderId = ''
    let notif = document.querySelector('.count-notif')
    let notifMob = document.querySelector('.count-notif-mob')

    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const chatId = this.getAttribute('data-chat-id');
            const chatUsername = this.getAttribute('data-chat-username');
            senderId = Number(this.getAttribute('data-sender-id'));
            console.log(`перевірка в модальному вікні має бути ІД ${senderId} відправника`)

            btn_yes.value = chatId;
            modalUsername.textContent = chatUsername;

            modal_1.classList.add('show');
            popupBg.classList.add('show');
        });
    });

    btn_yes.addEventListener('click', function(){
        console.log(`натиснули на ні і побачили id ${senderId}`)
        let users = localStorage.getItem('allMessageUsers');
        let storedNotifCount = Number(localStorage.getItem('notifCount'));
    
        let arrayUsers = users ? JSON.parse(users) : [];
        console.log(arrayUsers)
        if (arrayUsers.includes(senderId)){
            console.log(arrayUsers.includes(senderId))
            let indexEl = arrayUsers.indexOf(senderId)
            // console.log(`індекс який я хочу видалити ${indexEl}`)
            arrayUsers.splice(indexEl, 1)
            // console.log(`список ${arrayUsers} має бути без ${indexEl}`)
            localStorage.setItem('allMessageUsers', JSON.stringify(arrayUsers))
            storedNotifCount -= 1
            notif.textContent = storedNotifCount
            notifMob.textContent = storedNotifCount
            console.log(`${storedNotifCount} стореднотіф каунт`)
            // notif.textContent = storedNotifCount
            localStorage.setItem('notifCount', notif.textContent)
        }
        if (storedNotifCount < 1) {
            notif.classList.add('hide');
            notifMob.classList.add('hide');
        }

    })

    

    const closeModalElements = [popupBg, close_modal_1, btn_no];
    closeModalElements.forEach(function(element) {
        element.addEventListener('click', function() {
            modal_1.classList.remove('show');
            popupBg.classList.remove('show');
        });
    });
});