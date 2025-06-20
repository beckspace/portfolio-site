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
                    aboutSection.classList.add('about-animated');

                    // Animate the skills container separately
                    const skillsContainer = aboutSection.querySelector('.about-skills-container');
                    if (skillsContainer) {
                        setTimeout(() => {
                            skillsContainer.classList.add('about-animated');
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
    const skillBadges = document.querySelectorAll('.about-skill-badge');

    skillBadges.forEach((badge, index) => {
        // Add data attribute for animation delay
        badge.setAttribute('data-delay', index * 100);

        // Add hover effect
        badge.addEventListener('mouseenter', function () {
            this.classList.add('about-pulse');
        });

        badge.addEventListener('mouseleave', function () {
            this.classList.remove('about-pulse');
        });
    });

    // Add click functionality to show skill details (placeholder)
    skillBadges.forEach(badge => {
        badge.addEventListener('click', function () {
            const skillName = this.querySelector('.about-skill-badge-name').textContent;
            console.log(`Skill clicked: ${skillName}`);

            // Toggle an 'about-active' class for visual feedback
            this.classList.toggle('about-active');

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
            this.classList.add('about-glowing');
        });

        aboutImage.addEventListener('mouseleave', function () {
            this.classList.remove('about-glowing');
        });
    }
}