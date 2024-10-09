// $(document).ready(function() {

//     function loadContent(url) {
//         $.ajax({
//             url: url,
//             type: 'GET',
//             success: function(data) {
//                 let newContent = $(data).find('.main_container').html();
//                 $('.main_container').html(newContent);
    
//                 history.pushState(null, '', url);
//             },
//             error: function(xhr, status, error) {
//                 console.error('помилка: ', error);
//             }
//         });
//     }

//     $('body').on('click', 'a.ajax-link', function(e) {
//         e.preventDefault();
//         let url = $(this).attr('href'); 
//         let main = '/main/'
//         if (main === url){
//             console.log(url, 'перевірка url')
//             let linkMain = document.querySelector("#link-main")
//         }
//         // console.log(document.querySelectorAll("link"))
//         loadContent(url); 
//     });

//     $(window).on('popstate', function() {
//         loadContent(location.pathname); 
//     });
// });


$(document).ready(function() {
    // function clearPageSpecificStyles() {
    //     $('link.page-specific').remove();  
    // }
    function loadPageStyles(url) {
        
        if (url.includes("/main/")) {
            let allStyles = document.querySelectorAll('.page-specific')
            console.log(allStyles)
            allStyles.forEach(function(linkElement){
                let id = linkElement.getAttribute('id')
                console.log(id)
            })
            // $('head').append('<link rel="stylesheet" href="/static/main/css/style.css" class="page-main">');
            console.log('ми на сторінці main')
            // $('link.page-main').remove();  
        }

        else if (url.includes("/all_users/")) {
            // $('head').append('<link rel="stylesheet" href="/static/all_users/css/style.css" class="page-specific">');
            let allStyles = document.querySelectorAll('.page-specific')
            console.log(allStyles)
            allStyles.forEach(function(linkElement){
                let id = linkElement.getAttribute('id')
                console.log(id)
            })
            console.log('ми на сторінці all_users')
        }

        else if (url.includes("/groups/")) {
            // $('head').append('<link rel="stylesheet" href="/static/all_users/css/style.css" class="page-specific">');
            let allStyles = document.querySelectorAll('.page-specific')
            // console.log(allStyles)
            allStyles.forEach(function(linkElement){
                let id = linkElement.getAttribute('id')
                // console.log(id)
            })
            // console.log('ми на сторінці groups')
        }
    }
    function loadContent(url) {
        // clearPageSpecificStyles();  
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

    $('body').on('click', 'a.ajax-link, a.in-group, a.a-pc, a.chat-item-item', function(e) {
        e.preventDefault();
        let url = $(this).attr('href');
        loadContent(url);
    });


    window.onpopstate = function() {
        loadContent(location.pathname); 
    };
});