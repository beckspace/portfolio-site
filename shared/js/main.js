// Main JavaScript for Mechsec website
document.addEventListener('DOMContentLoaded', function () {
    // Load all components
    loadAllComponents();

    // Initialize particle background
    initParticleBackground();

    // Set up global event listeners
    setupGlobalEventListeners();
});

// Function to load all components
function loadAllComponents() {
    // Define components with their container IDs
    const components = [
        { name: 'header', target: '#header-container' },
        { name: 'hero', target: '#hero-container' },
        { name: 'services', target: '#services-container' },
        { name: 'projects', target: '#projects-container' },
        { name: 'about', target: '#about-container' },
        { name: 'contact', target: '#contact-container' },
        { name: 'footer', target: '#footer-container' }
    ];

    // Load each component
    components.forEach(component => {
        loadComponent(component.name, component.target);
    });
}

// Function to load an individual component
function loadComponent(name, targetSelector) {
    fetch(`components/${name}/${name}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${name} component (${response.status} ${response.statusText})`);
            }
            return response.text();
        })
        .then(html => {
            const targetElement = document.querySelector(targetSelector);
            if (targetElement) {
                targetElement.innerHTML = html;

                // Fix any ID issues - ensure the component's main element has the correct ID
                // This helps CSS selectors still work
                const mainElement = targetElement.firstElementChild;
                if (mainElement && !mainElement.id) {
                    mainElement.id = name;
                }

                // Dispatch component loaded events
                document.dispatchEvent(new CustomEvent(`${name}Loaded`, {
                    bubbles: true,
                    detail: { component: name }
                }));

                console.log(`Component loaded: ${name}`);
            } else {
                console.error(`Target element ${targetSelector} not found for component ${name}`);
            }
        })
        .catch(error => {
            console.error(`Error loading ${name} component:`, error);
            // Fallback: Show error in container
            const targetElement = document.querySelector(targetSelector);
            if (targetElement) {
                targetElement.innerHTML = `<div class="error-message">Failed to load ${name} component</div>`;
            }
        });
}

// Initialize particle background
function initParticleBackground() {
    const particleContainer = document.getElementById('particleContainer');
    if (!particleContainer) return;

    // Simple particle background implementation
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        // Random size
        const size = Math.random() * 5 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Random opacity
        particle.style.opacity = Math.random() * 0.5 + 0.1;

        // Random animation duration
        particle.style.animationDuration = `${Math.random() * 20 + 10}s`;

        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 5}s`;

        // Add to container
        particleContainer.appendChild(particle);
    }
}

// Set up global event listeners
function setupGlobalEventListeners() {
    // Handle scroll events for various effects
    window.addEventListener('scroll', handleScroll);

    // Handle window resize events
    window.addEventListener('resize', debounce(handleResize, 250));

    // Add scroll to top button
    addScrollToTopButton();
}

// Create and add scroll to top button
function addScrollToTopButton() {
    const scrollTopButton = document.createElement('button');
    scrollTopButton.className = 'scroll-top';
    scrollTopButton.innerHTML = '↑';
    scrollTopButton.setAttribute('aria-label', 'Scroll to top');
    scrollTopButton.setAttribute('title', 'Scroll to top');

    document.body.appendChild(scrollTopButton);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function () {
        if (window.scrollY > 500) {
            scrollTopButton.classList.add('visible');
        } else {
            scrollTopButton.classList.remove('visible');
        }
    });

    // Scroll to top when clicked
    scrollTopButton.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Handle scroll events
function handleScroll() {
    // Header transformation on scroll
    const header = document.getElementById('header');
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Add animations to elements when they come into view
    animateOnScroll();
}

// Animate elements when they become visible
function animateOnScroll() {
    // Get all elements that should be animated
    const animateElements = document.querySelectorAll('.animate-on-scroll:not(.animated)');

    animateElements.forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.add('animated');
        }
    });

    // Handle section titles
    const sectionTitles = document.querySelectorAll('.section-title-reveal:not(.animate-in)');

    sectionTitles.forEach(title => {
        if (isElementInViewport(title)) {
            title.classList.add('animate-in');
        }
    });
}

// Check if an element is in the viewport
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
        rect.bottom >= 0 &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right >= 0
    );
}

// Handle window resize events
function handleResize() {
    // Implement resize handling if needed
    console.log('Window resized');
}

// Utility function to debounce frequent events like scroll and resize
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}
