// Contact component functionality
document.addEventListener('component:contact:loaded', function () {
    initContactComponent();
});

// Initialize contact component
function initContactComponent() {
    // Form validation
    setupFormValidation();

    // Add animations for contact links
    animateContactLinks();

    // Add scroll animation for contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const observeContact = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    contactSection.classList.add('animated');
                    observeContact.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observeContact.observe(contactSection);
    }
}

// Set up contact form validation
function setupFormValidation() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        // Add input validation
        const inputs = contactForm.querySelectorAll('input, textarea');

        inputs.forEach(input => {
            // Add focus and blur effects
            input.addEventListener('focus', function () {
                this.closest('.form-group').classList.add('focused');
            });

            input.addEventListener('blur', function () {
                this.closest('.form-group').classList.remove('focused');

                // Add valid/invalid class based on input value
                if (this.value.trim() !== '') {
                    this.classList.add('valid');
                    this.classList.remove('invalid');
                } else if (this.required) {
                    this.classList.add('invalid');
                    this.classList.remove('valid');
                }
            });
        });

        // Form submission handling
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // Basic validation
            let isValid = true;
            const requiredInputs = contactForm.querySelectorAll('[required]');

            requiredInputs.forEach(input => {
                if (input.value.trim() === '') {
                    input.classList.add('invalid');
                    isValid = false;
                }
            });

            // Email validation
            const emailInput = contactForm.querySelector('input[type="email"]');
            if (emailInput && !isValidEmail(emailInput.value)) {
                emailInput.classList.add('invalid');
                isValid = false;
            }

            if (isValid) {
                // Simulate form submission
                simulateFormSubmission();
            } else {
                // Show validation message
                alert('Please fill out all required fields correctly.');
            }
        });
    }
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Simulate form submission (placeholder for actual submission)
function simulateFormSubmission() {
    const submitButton = document.querySelector('.form-submit');

    if (submitButton) {
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        submitButton.innerHTML = 'Sending...';

        // Simulate server delay
        setTimeout(() => {
            // Show success message
            submitButton.classList.remove('loading');
            submitButton.classList.add('success');
            submitButton.innerHTML = 'Message Sent!';

            // Reset form
            document.getElementById('contact-form').reset();

            // Reset button after delay
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.classList.remove('success');
                submitButton.innerHTML = 'Send Message';
            }, 3000);
        }, 1500);
    }
}

// Animate contact links
function animateContactLinks() {
    const contactLinks = document.querySelectorAll('.contact-link');

    contactLinks.forEach((link, index) => {
        // Add staggered animation delay
        link.style.animationDelay = `${index * 0.15}s`;

        // Add hover effect
        link.addEventListener('mouseenter', function () {
            this.classList.add('pulse');
        });

        link.addEventListener('mouseleave', function () {
            this.classList.remove('pulse');
        });
    });
}