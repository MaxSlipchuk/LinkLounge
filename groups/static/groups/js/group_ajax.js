$(document).ready(function() {
    $('#search-form').on('submit', function(event) {
        event.preventDefault();
        const search = $('#search').val();
        const csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
        $.ajax({
            type: 'POST',
            url: '/search_group/',
            data: {
                'search': search,
                'csrfmiddlewaretoken': csrfToken,
            },
            success: function(response) {
                if (response.status === 'success') {
                    $('#owned_groups').empty();
                    $('#member_groups').empty();
                    response.owned_groups.forEach(group => {
                        const groupCard = `
                            <div class="group-item">
                                <a class="in-group" href="${group.url}">
                                    <div>${group.name}</div>
                                </a>
                                <button class="delete" data-group-id="${group.id}" data-group-name="${group.name}">
                                    <svg id='delete' xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e8eaed"><path d="M306.46-166.15q-25.58 0-43.56-17.98-17.98-17.99-17.98-43.56v-490.46h-39.38v-36.8h155.69v-29.67h238.15v29.54h155.7v36.93h-39.39v490.64q0 25.76-17.8 43.56t-43.74 17.8H306.46Zm372.31-552H281.85v490.46q0 10.77 6.92 17.69 6.92 6.92 17.69 6.92h347.69q9.23 0 16.93-7.69 7.69-7.69 7.69-16.92v-490.46Zm-283.39 435.8h36.93v-356.92h-36.93v356.92Zm132.93 0h36.92v-356.92h-36.92v356.92Zm-246.46-435.8V-203.08-718.15Z"/></svg>
                                </button>
                            </div>`;
                        $('#owned_groups').append(groupCard);
                    });
                    response.member_groups.forEach(group => {
                        const groupCard = `
                            <div class="group-item">
                                <a class="in-group" href="${group.url}">
                                    <div>${group.name}</div>
                                </a>
                                <button class="exit" data-group-id="${group.id}" data-group-name="${group.name}">
                                    <svg id="exit" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M227.51-163.08q-25.76 0-43.56-17.8t-17.8-43.74v-507.69q0-25.94 17.8-43.74t43.56-17.8h253.87v36.93H227.69q-9.23 0-16.92 7.69-7.69 7.69-7.69 16.92v507.69q0 9.24 7.69 16.93 7.69 7.69 16.92 7.69h253.69v36.92H227.51Zm430.34-179.57-26.35-25.81L723.04-460h-353.5v-36.92h353.5l-91.54-91.54 26.35-26.19 136 136-136 136Z"/></svg>
                                </button>
                            </div>`;
                        $('#member_groups').append(groupCard);
                    });
                    // Ініціалізуємо обробники подій для нових елементів
                    initializeEventHandlers();
                }
            },
            error: function(xhr, errmsg, err) {
                console.error(`${xhr.status}: ${xhr.responseText}`);
            }
        });
    });
    // Викликаємо функцію, щоб ініціалізувати обробники подій для елементів, які вже є на сторінці
    initializeEventHandlers();
});
function initializeEventHandlers() {
    // Обробники подій для кнопок створення, видалення та виходу
    $('.btn-create').on('click', function() {
        $('#modal-create-group').addClass('show');
        $('#popup-bg').addClass('show');
    });
    $('.delete').off('click').on('click', function() {
        const groupId = $(this).data('group-id');
        const groupName = $(this).data('group-name');
        $('#delete-group-id').val(groupId);
        $('#modal-groupname').text(groupName);
        $('#modal-delete-group').addClass('show');
        $('#popup-bg').addClass('show');
    });
    $('.exit').off('click').on('click', function() {
        const groupId = $(this).data('group-id');
        const groupName = $(this).data('group-name');
        $('#exit-group-id').val(groupId);
        $('#modal-exit-groupname').text(groupName);
        $('#modal-exit-group').addClass('show');
        $('#popup-bg').addClass('show');
    });

    // Закриття модальних вікон
    $('#popup-bg, #close-modal-create-group, #close-modal-delete-group, #close-modal-exit-group, #btn-no, #btn-yes, #btn-exit-no, #btn-exit-yes').on('click', function() {
        $('#modal-create-group').removeClass('show');
        $('#modal-delete-group').removeClass('show');
        $('#modal-exit-group').removeClass('show');
        $('#popup-bg').removeClass('show');
    });
    $('#btn-yes').on('click', function(event) {
        event.preventDefault();
        const groupId = $('#delete-group-id').val();
        $.ajax({
            url: '/delete_group_ajax/',
            type: 'POST',
            data: {
                group_id: groupId,
                csrfmiddlewaretoken: $('[name=csrfmiddlewaretoken]').val()
            },
            success: function(response) {
                if (response.status === 'success') {
                    $(`[data-group-id="${groupId}"]`).closest('.group-item').remove();
                    $('#modal-delete-group').removeClass('show');
                    $('#popup-bg').removeClass('show');
                } else {
                    console.error(response.message);
                }
            },
        });
    });
    $('#btn-exit-yes').on('click', function(event) {
        event.preventDefault();
        const groupId = $('#exit-group-id').val();
        $.ajax({
            url: '/exit_group_ajax/',
            type: 'POST',
            data: {
                group_id: groupId,
                csrfmiddlewaretoken: $('[name=csrfmiddlewaretoken]').val()
            },
            success: function(response) {
                if (response.status === 'success') {
                    $(`[data-group-id="${groupId}"]`).closest('.group-item').remove();
                    $('#modal-exit-group').removeClass('show');
                    $('#popup-bg').removeClass('show');
                } else {
                    console.error(response.message);
                }
            },
        });
    });
}