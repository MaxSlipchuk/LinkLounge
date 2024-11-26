$(document).ready(function() {
    function loadPageStyles(url) {
        if (url.includes("/main/")) {
            initializeModalSettings()
            let allStyles = document.querySelectorAll('.page-specific')
            console.log(allStyles)
            allStyles.forEach(function(linkElement){
                let id = linkElement.getAttribute('id')
                console.log(id)
            })
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