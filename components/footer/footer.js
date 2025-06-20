// Footer component functionality
document.addEventListener('component:footer:loaded', function () {
    initFooterComponent();
});

// Initialize footer component
function initFooterComponent() {
    // Add animations for footer links
    animateFooterLinks();

    // Add scroll-to-top functionality
    setupScrollToTop();

    // Update copyright year dynamically
    updateCopyrightYear();
}

// Animate footer links with hover effects
function animateFooterLinks() {
    const footerLinks = document.querySelectorAll('.footer-link');

    footerLinks.forEach(link => {
        // Add hover effect
        link.addEventListener('mouseenter', function () {
            this.classList.add('footer-hover');
        });

        link.addEventListener('mouseleave', function () {
            this.classList.remove('footer-hover');
        });
    });
}

// Set up scroll-to-top functionality
function setupScrollToTop() {
    const footer = document.querySelector('.footer-main');

    if (footer) {
        // Create scroll-to-top button if it doesn't exist
        let scrollTopButton = document.querySelector('.footer-scroll-top');

        if (!scrollTopButton) {
            scrollTopButton = document.createElement('button');
            scrollTopButton.className = 'footer-scroll-top';
            scrollTopButton.innerHTML = '↑';
            scrollTopButton.setAttribute('aria-label', 'Scroll to top');
            scrollTopButton.setAttribute('title', 'Scroll to top');

            // Add button to the DOM (starts hidden by CSS)
            document.body.appendChild(scrollTopButton);

            // Show/hide button based on scroll position
            window.addEventListener('scroll', function () {
                if (window.scrollY > 500) {
                    scrollTopButton.classList.add('footer-visible');
                } else {
                    scrollTopButton.classList.remove('footer-visible');
                }
            });

            // Add click event
            scrollTopButton.addEventListener('click', function () {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
}

// Update copyright year dynamically
function updateCopyrightYear() {
    const copyrightElement = document.querySelector('.footer-bottom p');

    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        const copyrightText = copyrightElement.textContent;

        // Replace the year in the copyright text with the current year
        copyrightElement.textContent = copyrightText.replace(/\d{4}/, currentYear);
    }
}

// Optional: Add footer animations when scrolled into view
function addFooterAnimations() {
    const footer = document.querySelector('.footer-main');

    if (footer) {
        const observeFooter = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    footer.classList.add('footer-animated');
                    observeFooter.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observeFooter.observe(footer);
    }
}