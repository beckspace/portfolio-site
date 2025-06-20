// Hero section-specific JavaScript functionality
document.addEventListener('heroLoaded', function () {
    initHeroSlider();

    // Wait until window is fully loaded before initializing MagicCircles
    if (document.readyState === 'complete') {
        initMagicCircles();
    } else {
        window.addEventListener('load', initMagicCircles);
    }
});

// Separate function to initialize magic circles
function initMagicCircles() {
    // Make sure the magic-circles component has been loaded
    if (window.MagicCircles) {
        const container = document.getElementById('magic-circles-container');

        if (container) {
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.position = 'absolute';
            container.style.top = '0';
            container.style.left = '0';

            container.classList.add('hero-magic-circles-container');

            window.MagicCircles.init('magic-circles-container', {
                sizes: [600, 400, 800],
                fadeInDelay: 800,
                colors: {
                    primary: '#ff5050',
                    secondary: '#ffa500'
                },
                randomPositioning: false,
                debug: true
            });

            console.log('Magic circles initialized successfully');
        } else {
            console.error('Magic circles container not found');
        }
    } else {
        console.error('MagicCircles component not loaded');
        setTimeout(function () {
            console.log('Retrying magic circles initialization...');
            initMagicCircles();
        }, 500);
    }
}

// Debug version to identify what's changing the styles
function initHeroSlider() {
    const sliderElement = document.getElementById('previewSlider');
    const indicatorsElement = document.getElementById('sliderIndicators');
    const prevButton = document.getElementById('prevSlide');
    const nextButton = document.getElementById('nextSlide');

    if (!sliderElement || !indicatorsElement || !prevButton || !nextButton) {
        console.error('Slider elements not found');
        return;
    }

    const slides = [
        {
            image: '/shared/images/nasa-app.jpg',
            alt: 'NASA API Integration Project',
            title: 'Full-Stack Development',
            description: 'Android app with NASA API integration, demonstrating REST API consumption, data parsing, and mobile UI design.',
            highlight: 'Java • REST APIs • Android Development',
            link: '#projects'
        },
        {
            image: '/shared/images/technical-support.jpg',
            alt: 'Technical Support Excellence',
            title: 'Technical Support Experience',
            description: '7+ years providing technical support for 10+ clients, specializing in troubleshooting and system maintenance.',
            highlight: 'Problem Solving • Customer Service • System Administration',
            link: '#about'
        },
        {
            image: '/shared/images/web-development.jpg',
            alt: 'Modern Web Development',
            title: 'Web Development Skills',
            description: 'Building responsive websites with HTML, CSS, JavaScript. Currently mastering React.js through Full Stack Open course.',
            highlight: 'HTML • CSS • JavaScript • React.js • Responsive Design',
            link: '#projects'
        },
        {
            image: '/shared/images/learning-growth.jpg',
            alt: 'Continuous Learning',
            title: 'Always Learning',
            description: 'Recent Computer Programming graduate actively expanding skills through Helsinki University\'s Full Stack Open program.',
            highlight: 'Algonquin College Graduate • Self-Motivated • Growth Mindset',
            link: '#about'
        }
    ];

    let currentSlide = 0;
    let slideTimer;

    // Create slides with CSS classes only
    slides.forEach((slide, index) => {
        const slideElement = document.createElement('div');
        slideElement.className = 'hero-preview-slide';
        
        if (index === 0) {
            slideElement.classList.add('hero-active');
        }

        slideElement.innerHTML = `
            <div class="hero-preview-content">
                <div class="hero-preview-card">
                    ${slide.image ? 
                        `<img src="${slide.image}" alt="${slide.alt}" class="hero-slide-image" />` :
                        `<div class="hero-slide-placeholder">${slide.title}</div>`
                    }
                </div>
                <div class="hero-preview-info">
                    <h3 class="hero-preview-title">${slide.title}</h3>
                    <div class="hero-preview-highlight">${slide.highlight}</div>
                    <p class="hero-preview-description">${slide.description}</p>
                    <a href="${slide.link}" class="hero-preview-link">Learn More →</a>
                </div>
            </div>
        `;

        sliderElement.appendChild(slideElement);

        // Create indicator
        const indicator = document.createElement('div');
        indicator.className = 'hero-slider-indicator';
        if (index === 0) {
            indicator.classList.add('hero-active');
        }
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsElement.appendChild(indicator);
    });

    // DEBUGGING: Log the current styles
    function logElementStyles(element, elementName) {
        const computedStyles = window.getComputedStyle(element);
        console.log(`${elementName} styles:`, {
            backgroundColor: computedStyles.backgroundColor,
            background: computedStyles.background,
            color: computedStyles.color
        });
    }

    function goToSlide(index) {
        console.log(`--- Switching to slide ${index} ---`);
        
        // Log BEFORE making changes
        const previewContainer = document.querySelector('.hero-preview-container');
        if (previewContainer) {
            logElementStyles(previewContainer, 'Preview Container BEFORE');
        }

        // Remove active class from current slide and indicator
        const currentSlideElement = sliderElement.children[currentSlide];
        const currentIndicator = indicatorsElement.children[currentSlide];
        
        currentSlideElement.classList.remove('hero-active');
        currentSlideElement.classList.add('hero-prev');
        currentIndicator.classList.remove('hero-active');

        // Update current slide index
        currentSlide = index;

        // Add active class to new slide and indicator
        const newSlideElement = sliderElement.children[currentSlide];
        const newIndicator = indicatorsElement.children[currentSlide];
        
        // Clear any transition classes
        newSlideElement.classList.remove('hero-prev', 'hero-next');
        newSlideElement.classList.add('hero-active');
        newIndicator.classList.add('hero-active');

        // DEBUGGING: Check if any elements have inline styles after our changes
        setTimeout(() => {
            console.log('--- After slide change ---');
            
            // Check for inline styles on key elements
            const highlightElements = newSlideElement.querySelectorAll('.hero-preview-highlight');
            const titleElements = newSlideElement.querySelectorAll('.hero-preview-title');
            const descElements = newSlideElement.querySelectorAll('.hero-preview-description');
            
            highlightElements.forEach((el, i) => {
                console.log(`Highlight ${i} inline style:`, el.style.cssText);
                logElementStyles(el, `Highlight ${i}`);
            });
            
            titleElements.forEach((el, i) => {
                console.log(`Title ${i} inline style:`, el.style.cssText);
                logElementStyles(el, `Title ${i}`);
            });
            
            descElements.forEach((el, i) => {
                console.log(`Description ${i} inline style:`, el.style.cssText);
                logElementStyles(el, `Description ${i}`);
            });

            // Log container styles again
            if (previewContainer) {
                logElementStyles(previewContainer, 'Preview Container AFTER');
            }

            // Clean up previous slide classes
            sliderElement.querySelectorAll('.hero-preview-slide').forEach(slide => {
                if (!slide.classList.contains('hero-active')) {
                    slide.classList.remove('hero-prev', 'hero-next');
                }
            });
        }, 100);
    }

    // Rest of the functions remain the same...
    function showPrevSlide() {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
        resetTimer();
    }

    function showNextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
        resetTimer();
    }

    function startAutoSlide() {
        slideTimer = setInterval(showNextSlide, 6000);
    }

    function resetTimer() {
        clearInterval(slideTimer);
        startAutoSlide();
    }

    // Event listeners
    prevButton.addEventListener('click', showPrevSlide);
    nextButton.addEventListener('click', showNextSlide);

    sliderElement.addEventListener('mouseenter', () => {
        clearInterval(slideTimer);
    });

    sliderElement.addEventListener('mouseleave', () => {
        startAutoSlide();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            showPrevSlide();
        } else if (e.key === 'ArrowRight') {
            showNextSlide();
        }
    });

    // DEBUGGING: Initial log
    setTimeout(() => {
        console.log('=== INITIAL SLIDE STATE ===');
        const previewContainer = document.querySelector('.hero-preview-container');
        if (previewContainer) {
            logElementStyles(previewContainer, 'Preview Container INITIAL');
        }
    }, 500);

    startAutoSlide();
    console.log('Hero slider initialized successfully');
}