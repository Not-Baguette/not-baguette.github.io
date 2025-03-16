document.addEventListener("scroll", function() {
    const parallaxElements = document.querySelectorAll('.parallax');
    const scrollPosition = window.pageYOffset;
    
    parallaxElements.forEach(element => {
        const speed = parseFloat(element.dataset.speed) || 0.5;
        const offset = scrollPosition * speed;
        element.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
});