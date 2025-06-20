// Simple Main JavaScript - No Dependencies, Smooth Loading
document.addEventListener('DOMContentLoaded', function () {
    // Load all components
    loadAllComponents();
    
    // Setup global functionality
    setupGlobalEventListeners();
});

// Simple but effective component loading
function loadAllComponents() {
    const components = [
        { name: 'header', target: '#header-container' },
        { name: 'hero', target: '#hero-container' },
        { name: 'projects', target: '#projects-container' },
        { name: 'about', target: '#about-container' },
        { name: 'contact', target: '#contact-container' },
        { name: 'footer', target: '#footer-container' }
    ];

    // Load all components in parallel - this should eliminate choppiness
    const loadPromises = components.map(component => 
        loadComponent(component.name, component.target)
    );

    // Wait for all to complete
    Promise.allSettled(loadPromises)
        .then(results => {
            const successful = results.filter(r => r.status === 'fulfilled').length;
            console.log(`✅ Components loaded: ${successful}/${components.length}`);
            
            // Dispatch completion event
            document.dispatchEvent(new CustomEvent('allComponentsLoaded'));

            // Add smooth entrance - but only once everything is loaded
            setTimeout(() => addSmoothEntranceAnimations(), 50);
        });
}

// Streamlined component loading
function loadComponent(name, targetSelector) {
    return fetch(`components/${name}/${name}.html`)
        .then(response => {
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            return response.text();
        })
        .then(html => {
            const target = document.querySelector(targetSelector);
            if (!target) throw new Error(`Target ${targetSelector} not found`);

            // Insert HTML
            target.innerHTML = html;

            // Set ID for CSS targeting
            const mainElement = target.firstElementChild;
            if (mainElement && !mainElement.id) {
                mainElement.id = name;
            }

            // Dispatch events for component JS
            document.dispatchEvent(new CustomEvent(`${name}Loaded`));
            document.dispatchEvent(new CustomEvent(`component:${name}:loaded`));

            return name;
        })
        .catch(error => {
            console.error(`❌ ${name} failed:`, error);
            
            // Show minimal error
            const target = document.querySelector(targetSelector);
            if (target) {
                target.innerHTML = `<div style="padding: 1rem; color: #ff6b6b; text-align: center;">Failed to load ${name}</div>`;
            }
            
            throw error;
        });
}

// Smooth entrance animations - this should fix the choppy feeling
function addSmoothEntranceAnimations() {
    // Get all loaded sections (excluding magic circles background)
    const sections = document.querySelectorAll('section, header, footer');
    
    sections.forEach((section, index) => {
        if (!section) return;
        
        // Set initial invisible state
        section.style.opacity = '0';
        section.style.transform = 'translateY(15px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // Animate in with minimal stagger
        requestAnimationFrame(() => {
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 60); // Very quick stagger
        });
    });
}

// Global event listeners
function setupGlobalEventListeners() {
    // Smooth scroll handling
    let scrollTimer;
    window.addEventListener('scroll', () => {
        if (scrollTimer) return;
        scrollTimer = requestAnimationFrame(() => {
            handleScroll();
            scrollTimer = null;
        });
    });

    // Resize handling
    window.addEventListener('resize', debounce(handleResize, 200));

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);

    // Smooth anchor scrolling
    setupSmoothScrolling();

    console.log('✅ Event listeners ready');
}

// Handle scroll events
function handleScroll() {
    // Header scroll effect
    const header = document.querySelector('header');
    if (header) {
        header.classList.toggle('scrolled', window.scrollY > 100);
    }

    // Setup scroll animations (one-time)
    if (!window.scrollObserver) {
        setupScrollAnimations();
    }
}

// Setup intersection observer for scroll animations
function setupScrollAnimations() {
    window.scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                window.scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Observe elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        window.scrollObserver.observe(el);
    });
}

// Handle resize
function handleResize() {
    document.dispatchEvent(new CustomEvent('windowResized', {
        detail: { width: window.innerWidth, height: window.innerHeight }
    }));
}



// Smooth scrolling
function setupSmoothScrolling() {
    document.addEventListener('click', function(event) {
        const link = event.target.closest('a[href^="#"]');
        if (!link) return;

        const href = link.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        if (history.pushState) {
            history.pushState(null, null, href);
        }
    });
}

// Utility
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Error handling
window.addEventListener('error', (e) => console.error('Error:', e.error));
window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rejection:', e.reason);
    e.preventDefault();
});

// Performance monitoring
window.addEventListener('load', () => {
    if (performance?.getEntriesByType) {
        setTimeout(() => {
            const [nav] = performance.getEntriesByType('navigation');
            if (nav) {
                console.log(`📊 Loaded in ${Math.round(nav.loadEventEnd - nav.fetchStart)}ms`);
            }
        }, 100);
    }
});