document.addEventListener('DOMContentLoaded', (event) => {
    // Використовуємо глобальні змінні userId і username
    const notificationSocket = new WebSocket(
        'ws://' + window.location.host + '/ws/notify/' + userId + '/'
    );
    let notif = document.querySelector('.count-notif')
    let users = localStorage.getItem('allMessageUsers');
    
    let arrayUsers = users ? JSON.parse(users) : [];
    let storedNotifCount = Number(localStorage.getItem('notifCount'));
    let otherUser = parseInt(`{{ other_user.id|default:"null" }}`);
    let hiddenValueElement = document.getElementById('otherUserId');
    let hiddenValue = hiddenValueElement ? Number(hiddenValueElement.value) : null;
    
    // Handle NaN if it occurs
    if (isNaN(otherUser)) {
        otherUser = null;
    }

    if (hiddenValue !== null) {
        console.log('Hidden value:', hiddenValue);
        otherUser = hiddenValue
        if (arrayUsers.includes(otherUser)){
            console.log(arrayUsers.includes(otherUser))
            console.log(`всього сповіщень ${storedNotifCount}`)
            let indexEl = arrayUsers.indexOf(otherUser)
            console.log(`індекс який я хочу видалити ${indexEl}`)
            arrayUsers.splice(indexEl, 1)
            console.log(`список ${arrayUsers} має бути без ${indexEl}`)
            localStorage.setItem('allMessageUsers', JSON.stringify(arrayUsers))
            storedNotifCount -= 1
            notif.textContent = storedNotifCount
            localStorage.setItem('notifCount', notif.textContent)
        }
        
        // Ваш код для сторінки, де є цей елемент
    } else {
        console.log('Ця сторінка не має елемента otherUserId');
        // Ваш код для сторінок, де цього елемента немає
    }
    console.log(otherUser)
    
    if (storedNotifCount >= 1) {
        notif.textContent = storedNotifCount;
        notif.classList.add('show');
    }

    notificationSocket.onopen = function(e) {
        console.log('вебсокет сповіщень відкритий');
    };

    notificationSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        if (data.notification) {
            console.log(`прийшло  повідомлення від ` + data.from_user);

            if (!arrayUsers.includes(data.from_user) && data.from_user !== otherUser) {
                // console.log(data.from_user, otherUser)
                arrayUsers.push(data.from_user)
                // console.log(arrayUsers)
                localStorage.setItem('allMessageUsers', JSON.stringify(arrayUsers))

                let currentCount = parseInt(notif.textContent) || 0;
                notif.textContent = currentCount + 1;

                localStorage.setItem('notifCount', notif.textContent)

            }

        }
        let storedNotifCount = Number(localStorage.getItem('notifCount'));
        if (storedNotifCount >= 1) {
            notif.classList.add('show');
        }
        
        
    };

    notificationSocket.onclose = function(e) {
        console.error('вебсокет сповіщень закритий');
    };

    notificationSocket.onerror = function(error) {
        console.error('WebSocket error:', error);
    };
});

console.log('hello')