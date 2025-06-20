// Projects component functionality
document.addEventListener('component:projects:loaded', function () {
    initProjectsComponent();
});

// Initialize projects component
function initProjectsComponent() {
    // Add scroll-triggered animation
    setupScrollAnimation();

    // Setup project details modal functionality
    setupProjectDetails();
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
                            // Set initial state
                            square.style.transition = 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 1s ease';
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

                                    // Add floating animation classes
                                    square.classList.add('projects-floating');

                                    if (squareCircle) {
                                        squareCircle.classList.add('projects-glowing');
                                    }

                                    if (squareShadow) {
                                        squareShadow.classList.add('projects-floating');
                                    }
                                }, 1200);
                            }, 300);
                        }

                        // Ensure square circle is visible
                        if (squareCircle) {
                            squareCircle.style.opacity = 1;
                        }
                    }, index * 150); // Stagger each card animation
                });

                // Stop observing after animation is triggered
                observeProjects.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    // Start observing the projects section
    observeProjects.observe(projectsSection);
}

// Setup project details modal functionality
function setupProjectDetails() {
    const viewButtons = document.querySelectorAll('.projects-link');

    viewButtons.forEach(button => {
        if (button.textContent.trim().includes('View')) {
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
                alert(`Viewing ${projectTitle} details - Modal functionality coming soon!`);
            });
        }
    });
}