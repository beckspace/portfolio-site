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
                const cards = projectsSection.querySelectorAll('.project-card');

                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('fade-in');

                        // Animate the cube entrance
                        const cube = card.querySelector('.cube');
                        const cubeCircle = card.querySelector('.cube-circle');
                        const cubeShadow = card.querySelector('.cube-shadow');

                        if (cube) {
                            // Set initial state
                            cube.style.transition = 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 1s ease';
                            cube.style.opacity = '0';
                            cube.style.transform = 'translate(-50%, -50%) rotateX(-15deg) rotateY(15deg) scale(0.8)';

                            // Trigger animation after a short delay
                            setTimeout(() => {
                                cube.style.opacity = '1';
                                cube.style.transform = 'translate(-50%, -50%) rotateX(-15deg) rotateY(15deg) scale(1)';

                                // After entrance animation completes, apply floating animation
                                setTimeout(() => {
                                    // Remove inline styles that might conflict with animation
                                    cube.style.transition = '';
                                    cube.style.transform = '';

                                    // Add floating animation classes
                                    cube.classList.add('floating');

                                    if (cubeCircle) {
                                        cubeCircle.classList.add('glowing');
                                    }

                                    if (cubeShadow) {
                                        cubeShadow.classList.add('floating');
                                    }
                                }, 1200);
                            }, 300);
                        }

                        // Ensure cube circle is visible
                        if (cubeCircle) {
                            cubeCircle.style.opacity = 1;
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
    const viewButtons = document.querySelectorAll('.project-link');

    viewButtons.forEach(button => {
        if (button.textContent.trim().includes('View')) {
            button.addEventListener('click', function (event) {
                event.preventDefault();

                // Get project data from parent elements
                const projectCard = this.closest('.project-card');
                const projectTitle = projectCard.querySelector('.project-title').textContent;
                const projectDescription = projectCard.querySelector('.project-description').textContent;

                // Log the data (for development purposes)
                console.log(`Viewing project: ${projectTitle}`);
                console.log(`Description: ${projectDescription}`);

                // In a complete implementation, this would open a modal with project details
                alert(`Viewing ${projectTitle} details - Modal functionality coming soon!`);
            });
        }
    });
}