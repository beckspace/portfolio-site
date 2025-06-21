// Projects component functionality - Mobile Optimized
document.addEventListener('component:projects:loaded', function () {
    initProjectsComponent();
});

// Initialize projects component
function initProjectsComponent() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Add scroll-triggered animation (respecting motion preferences)
    if (!prefersReducedMotion) {
        setupScrollAnimation();
    } else {
        // For users who prefer reduced motion, just fade in without complex animations
        setupSimpleScrollAnimation();
    }

    // Setup project details modal functionality
    setupProjectDetails();
    
    // Setup mobile-specific optimizations
    setupMobileOptimizations();
}

// Setup scroll-triggered animation for project cards
function setupScrollAnimation() {
    const projectsSection = document.querySelector('.projects');

    if (!projectsSection) return;

    const observeProjects = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger the animation of project cards
                const cards = projectsSection.querySelectorAll('.projects-card');

                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('projects-fade-in');

                        // Animate the square entrance
                        const square = card.querySelector('.projects-square');
                        const squareCircle = card.querySelector('.projects-square-circle');
                        const squareShadow = card.querySelector('.projects-square-shadow');

                        if (square) {
                            // Check if we're on mobile for performance optimization
                            const isMobile = window.innerWidth <= 768;
                            const animationDuration = isMobile ? '0.8s' : '1.2s';
                            
                            // Set initial state
                            square.style.transition = `transform ${animationDuration} cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease`;
                            square.style.opacity = '0';
                            square.style.transform = 'translate(-50%, -50%) scale(0.8)';

                            // Trigger animation after a short delay
                            setTimeout(() => {
                                square.style.opacity = '1';
                                square.style.transform = 'translate(-50%, -50%) scale(1)';

                                // After entrance animation completes, apply floating animation
                                setTimeout(() => {
                                    // Remove inline styles that might conflict with animation
                                    square.style.transition = '';
                                    square.style.transform = '';

                                    // Add floating animation classes (only on desktop for performance)
                                    if (!isMobile) {
                                        square.classList.add('projects-floating');

                                        if (squareCircle) {
                                            squareCircle.classList.add('projects-glowing');
                                        }

                                        if (squareShadow) {
                                            squareShadow.classList.add('projects-floating');
                                        }
                                    }
                                }, isMobile ? 800 : 1200);
                            }, 200);
                        }

                        // Ensure square circle is visible
                        if (squareCircle) {
                            squareCircle.style.opacity = 1;
                        }
                    }, index * 100); // Reduced stagger time for mobile
                });

                // Stop observing after animation is triggered
                observeProjects.unobserve(entry.target);
            }
        });
    }, { 
        threshold: window.innerWidth <= 768 ? 0.1 : 0.2, // Lower threshold for mobile
        rootMargin: '50px 0px' // Start animation earlier on mobile
    });

    // Start observing the projects section
    observeProjects.observe(projectsSection);
}

// Simple scroll animation for users who prefer reduced motion
function setupSimpleScrollAnimation() {
    const projectsSection = document.querySelector('.projects');

    if (!projectsSection) return;

    const observeProjects = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = projectsSection.querySelectorAll('.projects-card');
                
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 50);
                });

                observeProjects.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Set initial state for reduced motion
    const cards = projectsSection.querySelectorAll('.projects-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    observeProjects.observe(projectsSection);
}

// Setup project details modal functionality
function setupProjectDetails() {
    const sourceButtons = document.querySelectorAll('.projects-source-link');

    sourceButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();

            // Get project data from parent elements
            const projectCard = this.closest('.projects-card');
            const projectTitle = projectCard.querySelector('.projects-title').textContent;
            const projectDescription = projectCard.querySelector('.projects-description').textContent;

            // Log the data (for development purposes)
            console.log(`Viewing project: ${projectTitle}`);
            console.log(`Description: ${projectDescription}`);

            // In a complete implementation, this would open a modal with project details
            // For now, we'll provide feedback that respects mobile UX
            if (window.innerWidth <= 768) {
                // Mobile: use a simple alert or could integrate with a mobile-friendly modal
                alert(`${projectTitle} - Source code coming soon!`);
            } else {
                // Desktop: could use a more elaborate modal
                alert(`Viewing ${projectTitle} details - Modal functionality coming soon!`);
            }
        });

        // Add touch feedback for mobile
        if ('ontouchstart' in window) {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'translateY(-1px) scale(0.98)';
            });
            
            button.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        }
    });
}

// Setup mobile-specific optimizations
function setupMobileOptimizations() {
    // Disable complex animations on low-end devices
    if (isLowEndDevice()) {
        disableComplexAnimations();
    }

    // Handle orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Handle viewport changes for mobile browsers
    window.addEventListener('resize', debounce(handleViewportChange, 250));
    
    // Setup intersection observer for performance
    setupPerformanceOptimizations();
}

// Check if device might be low-end
function isLowEndDevice() {
    // Simple heuristic for low-end device detection
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    const deviceMemory = navigator.deviceMemory || 4;
    
    // Consider low-end if:
    // - Less than 4 CPU cores
    // - Less than 2GB RAM
    // - Slow connection
    return (
        hardwareConcurrency < 4 ||
        deviceMemory < 2 ||
        (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'))
    );
}

// Disable complex animations for performance
function disableComplexAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        .projects-card::after,
        .projects-square-circle,
        .projects-square-shadow {
            animation: none !important;
        }
        .projects-square {
            animation-duration: 6s !important;
        }
    `;
    document.head.appendChild(style);
}

// Handle orientation changes
function handleOrientationChange() {
    // Small delay to ensure viewport has updated
    setTimeout(() => {
        // Force recalculation of viewport-dependent styles
        const cards = document.querySelectorAll('.projects-card');
        cards.forEach(card => {
            card.style.transform = 'translateZ(0)'; // Trigger hardware acceleration
        });
        
        // Remove the temporary style after a frame
        requestAnimationFrame(() => {
            cards.forEach(card => {
                card.style.transform = '';
            });
        });
    }, 100);
}

// Handle viewport changes (e.g., mobile browser UI showing/hiding)
function handleViewportChange() {
    // Update CSS custom properties if needed for viewport units
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Setup performance optimizations using Intersection Observer
function setupPerformanceOptimizations() {
    // Lazy load expensive effects only when they come into view
    const cards = document.querySelectorAll('.projects-card');
    
    const performanceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Enable animations for this card
                const card = entry.target;
                card.classList.add('projects-performance-enabled');
                
                // Stop observing this card
                performanceObserver.unobserve(card);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '100px 0px' // Start loading effects early
    });
    
    cards.forEach(card => {
        performanceObserver.observe(card);
    });
}

// Utility function for debouncing events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle touch events for better mobile interaction
document.addEventListener('DOMContentLoaded', function() {
    // Improve touch responsiveness
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Add custom touch handling for project cards
        const cards = document.querySelectorAll('.projects-card');
        cards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            card.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            });
        });
    }
});

// Export functions for testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initProjectsComponent,
        setupScrollAnimation,
        setupMobileOptimizations,
        isLowEndDevice,
        debounce
    };
}