// About component functionality
document.addEventListener('component:about:loaded', function () {
    initAboutComponent();
});

// Initialize about component
function initAboutComponent() {
    // Add animations for skills badges
    animateSkillBadges();

    // Add scroll animation for about section
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const observeAbout = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    aboutSection.classList.add('animated');

                    // Animate the skills container separately
                    const skillsContainer = aboutSection.querySelector('.skills-container');
                    if (skillsContainer) {
                        setTimeout(() => {
                            skillsContainer.classList.add('animated');
                        }, 500);
                    }

                    observeAbout.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observeAbout.observe(aboutSection);
    }
}

// Animate skill badges with a slight delay between each
function animateSkillBadges() {
    const skillBadges = document.querySelectorAll('.skill-badge');

    skillBadges.forEach((badge, index) => {
        // Add data attribute for animation delay
        badge.setAttribute('data-delay', index * 100);

        // Add hover effect
        badge.addEventListener('mouseenter', function () {
            this.classList.add('pulse');
        });

        badge.addEventListener('mouseleave', function () {
            this.classList.remove('pulse');
        });
    });

    // Add click functionality to show skill details (placeholder)
    skillBadges.forEach(badge => {
        badge.addEventListener('click', function () {
            const skillName = this.querySelector('.skill-badge-name').textContent;
            console.log(`Skill clicked: ${skillName}`);

            // Toggle an 'active' class for visual feedback
            this.classList.toggle('active');

            // In a complete implementation, this could show skill details
        });
    });
}

// Optional: Add a particle effect to the about image
function initAboutImageEffects() {
    const aboutImage = document.querySelector('.about-image-frame');

    if (aboutImage) {
        // Add glow effect on hover
        aboutImage.addEventListener('mouseenter', function () {
            this.classList.add('glowing');
        });

        aboutImage.addEventListener('mouseleave', function () {
            this.classList.remove('glowing');
        });
    }
}