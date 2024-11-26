$(document).ready(function() {
    function loadPageStyles(url) {
        if (url.includes("/main/")) {
            initializeModalSettings()
            console.log('ми на сторінці main') 
        }
    }
    function loadContent(url) { 
        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            success: function(data) {
                console.log('ми в аякс');
                $('.main_container').html(data.html);
                loadPageStyles(url); 
                history.pushState(null, '', url);
            },
            error: function(xhr, status, error) {
                console.log(error);
            }
        });
    }

    $('body').on('click', 'a.ajax-link', function(e) {
        e.preventDefault();
        let url = $(this).attr('href');
        loadContent(url);
    });

    window.onpopstate = function() {
        loadContent(location.pathname); 
    };
});