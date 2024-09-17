document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.video');

    if (video && window.innerWidth < 768) {
        video.removeAttribute('autoplay');
        video.pause();
    }
});
