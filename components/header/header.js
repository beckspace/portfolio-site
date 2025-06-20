// Header-specific JavaScript functionality
document.addEventListener('headerLoaded', function () {
    initMobileMenu();
    initScrollEffect();
});

// Initialize mobile menu functionality
function initMobileMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', function () {
            navMenu.classList.toggle('header-active');
            menuBtn.classList.toggle('header-active');

            // Change menu button text based on state
            if (menuBtn.classList.contains('header-active')) {
                menuBtn.innerHTML = '✕';
            } else {
                menuBtn.innerHTML = '☰';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            if (!navMenu.contains(event.target) &&
                !menuBtn.contains(event.target) &&
                navMenu.classList.contains('header-active')) {
                navMenu.classList.remove('header-active');
                menuBtn.classList.remove('header-active');
                menuBtn.innerHTML = '☰';
            }
        });
    }
}

// Header scroll effect
function initScrollEffect() {
    const header = document.getElementById('header');

    if (header) {
        // Apply initial state based on current scroll position
        if (window.scrollY > 100) {
            header.classList.add('header-scrolled');
        }

        // Update on scroll
        window.addEventListener('scroll', function () {
            if (window.scrollY > 100) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        });
    }
}