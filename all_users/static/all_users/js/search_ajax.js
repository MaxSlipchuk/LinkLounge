$(document).ready(function() {
    $('#search-form').on('submit', function(event) {
        event.preventDefault();
        const search = $('#search').val();
        const csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

        $.ajax({
            type: 'POST',
            url: '/search/', 
            data: {
                'search': search,
                'csrfmiddlewaretoken': csrfToken,
            },
            success: function(response) {
                if (response.status === 'success') {
                    $('#user-cards').empty();
                    response.users.forEach(user => {
                        const userCard = `
                            <div class="card-user">
                                <div class="info1">
                                    <h3>${user.first_name}</h3>
                                    <h3>${user.last_name}</h3>
                                    <h5>@${user.username}</h5>
                                    <div class="image">
                                        <img src="${user.profile_image}" alt="Profile Picture">
                                    </div>
                                </div>
                                <a href="/chat_with_user/${user.id}/"><button class="button">написати</button></a>
                            </div>`;
                        $('#user-cards').append(userCard);
                    });
                }
            },
            error: function(xhr, errmsg, err) {
                console.error(`${xhr.status}: ${xhr.responseText}`);
            }
        });
    });
});
