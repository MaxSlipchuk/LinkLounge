document.addEventListener('DOMContentLoaded', (event) => {
    // Використовуємо глобальні змінні userId і username
    const notificationSocket = new WebSocket(
        'wss://' + window.location.host + '/ws/notify/' + userId + '/'
    );
    let notif = document.querySelector('.count-notif')
    let users = localStorage.getItem('allMessageUsers');
    
    let arrayUsers = users ? JSON.parse(users) : [];
    let storedNotifCount = Number(localStorage.getItem('notifCount'));
    let otherUser = parseInt(`{{ other_user.id|default:"null" }}`);
    let hiddenValueElement = document.getElementById('otherUserId');
    let hiddenValue = hiddenValueElement ? Number(hiddenValueElement.value) : null;


    let hiddenValueSenderid = document.getElementById('senderId');
    let senderId = hiddenValueSenderid ? Number(hiddenValueSenderid.value) : null;

    // для телефону
    let notifMob = document.querySelector('.count-notif-mob')


    if (isNaN(otherUser)) {
        otherUser = null;
    }

    if (hiddenValue !== null) {
        otherUser = hiddenValue
        if (arrayUsers.includes(otherUser)){
            let indexEl = arrayUsers.indexOf(otherUser)
            arrayUsers.splice(indexEl, 1)
            localStorage.setItem('allMessageUsers', JSON.stringify(arrayUsers))
            storedNotifCount -= 1
            notif.textContent = storedNotifCount
            notifMob.textContent = storedNotifCount
            localStorage.setItem('notifCount', notif.textContent)
        }

    } else {
        console.log('ця сторінка не має елемента otherUserId');
    }


    // функція для фарбування блоків коли прийшло сповіщення
    function style(){
        let arrayBloks = []
        let blocks = document.querySelectorAll('.chat-item-item')
        blocks.forEach(el => {
            let senderId = el.getAttribute('data-sender-id');
            arrayBloks.push(Number(senderId))
            if (arrayUsers.includes(Number(senderId))){
                el.classList.add('notif-style')
            }
        })

        arrayUsers.forEach(function(entry) {
            console.log(entry)
            console.log(arrayBloks)
            if (arrayBloks.includes(entry)){
                console.log(`Cторінка блоків має сповіщення - ${entry}`);
                
            }
            else{
                console.log(`Cторінка блоків немає сповіщення - ${entry}`);
                let reboot = document.querySelector('.reboot')
                reboot.classList.add('show-reboot')
                reboot.onclick = function () {
                    location.reload();
                };
            }
        })
    }

    // для сповіщень на сторінці my_messages
    if (senderId !== null) {
        style()
    } else {
        console.log('ця сторінка не має елемента SenderUserId');
    }
    
    if (storedNotifCount >= 1) {
        notif.textContent = storedNotifCount;
        notifMob.textContent = storedNotifCount
        notif.classList.add('show');
        notifMob.classList.add('show')

    } else {
        notif.classList.remove('show');
        notifMob.classList.remove('show')
    }

    notificationSocket.onopen = function(e) {
        console.log('вебсокет сповіщень відкритий');
    };

    notificationSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        if (data.notification) {
            console.log(`прийшло  повідомлення від ` + data.from_user);

            if (!arrayUsers.includes(data.from_user) && data.from_user !== otherUser) {
                arrayUsers.push(data.from_user)
                localStorage.setItem('allMessageUsers', JSON.stringify(arrayUsers))

                let currentCount = parseInt(notif.textContent) || 0;
                notif.textContent = currentCount + 1;
                notifMob.textContent = currentCount + 1
                localStorage.setItem('notifCount', notif.textContent)
            }
            style()
        }

        let storedNotifCount = Number(localStorage.getItem('notifCount'));
        if (storedNotifCount >= 1) {
            notif.classList.add('show');
            notifMob.classList.add('show')

        } else {
            // notif.classList.add('hide');
            // notifMob.classList.add('hide')
        }
    };    

    notificationSocket.onclose = function(e) {
        console.error('вебсокет сповіщень закритий');
    };

    notificationSocket.onerror = function(error) {
        console.error('WebSocket error:', error);
    };
});
