document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.background-video');

    if (video && window.innerWidth < 768) {
        video.removeAttribute('autoplay');
        video.pause();
        console.log('перевырка')
    }
});