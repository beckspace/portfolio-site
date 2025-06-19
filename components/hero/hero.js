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

            container.classList.add('magic-circles-container');

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

// Initialize hero slider - UPDATED VERSION
function initHeroSlider() {
    const sliderElement = document.getElementById('previewSlider');
    const indicatorsElement = document.getElementById('sliderIndicators');
    const prevButton = document.getElementById('prevSlide');
    const nextButton = document.getElementById('nextSlide');

    if (!sliderElement || !indicatorsElement || !prevButton || !nextButton) {
        console.error('Slider elements not found');
        return;
    }

    // Updated slider data focused on entry-level tech positions
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

    // Create slides with professional structure
    slides.forEach((slide, index) => {
        // Create slide container
        const slideElement = document.createElement('div');
        slideElement.className = 'preview-slide';
        
        // Set initial state
        if (index === 0) {
            slideElement.classList.add('active');
        }

        // Create slide content structure with professional layout
        slideElement.innerHTML = `
            <div class="preview-content">
                <div class="preview-card">
                    ${slide.image ? 
                        `<img src="${slide.image}" alt="${slide.alt}" style="max-width: 320px; height: auto; border-radius: 12px; box-shadow: 0 15px 35px rgba(0,0,0,0.1); object-fit: cover;" />` :
                        `<div class="slide-placeholder" style="width: 320px; height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: 600;">${slide.title}</div>`
                    }
                </div>
                <div class="preview-info">
                    <h3 class="preview-title" style="color: #2c3e50; margin-bottom: 8px; font-size: 1.4rem; font-weight: 600;">${slide.title}</h3>
                    <div class="preview-highlight" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 500; margin-bottom: 12px; display: inline-block;">${slide.highlight}</div>
                    <p class="preview-description" style="color: #555; line-height: 1.5; margin-bottom: 15px;">${slide.description}</p>
                    <a href="${slide.link}" class="preview-link" style="color: #667eea; text-decoration: none; font-weight: 500; border-bottom: 2px solid transparent; transition: all 0.3s ease;">Learn More →</a>
                </div>
            </div>
        `;

        sliderElement.appendChild(slideElement);

        // Create indicator
        const indicator = document.createElement('div');
        indicator.className = 'slider-indicator';
        if (index === 0) {
            indicator.classList.add('active');
        }
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsElement.appendChild(indicator);
    });

    // Navigation functions
    function showPrevSlide() {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
        resetTimer();
    }

    function showNextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
        resetTimer();
    }

    function goToSlide(index) {
        // Remove active class from current slide and indicator
        const currentSlideElement = sliderElement.children[currentSlide];
        const currentIndicator = indicatorsElement.children[currentSlide];
        
        currentSlideElement.classList.remove('active');
        currentSlideElement.classList.add('prev');
        currentIndicator.classList.remove('active');

        // Update current slide index
        currentSlide = index;

        // Add active class to new slide and indicator
        const newSlideElement = sliderElement.children[currentSlide];
        const newIndicator = indicatorsElement.children[currentSlide];
        
        // Clear any transition classes
        newSlideElement.classList.remove('prev', 'next');
        newSlideElement.classList.add('active');
        newIndicator.classList.add('active');

        // Clean up previous slide classes after transition
        setTimeout(() => {
            sliderElement.querySelectorAll('.preview-slide').forEach(slide => {
                if (!slide.classList.contains('active')) {
                    slide.classList.remove('prev', 'next');
                }
            });
        }, 800);
    }

    function startAutoSlide() {
        slideTimer = setInterval(showNextSlide, 6000); // Slightly longer for reading
    }

    function resetTimer() {
        clearInterval(slideTimer);
        startAutoSlide();
    }

    // Event listeners
    prevButton.addEventListener('click', showPrevSlide);
    nextButton.addEventListener('click', showNextSlide);

    // Pause on hover for better user experience
    sliderElement.addEventListener('mouseenter', () => {
        clearInterval(slideTimer);
    });

    sliderElement.addEventListener('mouseleave', () => {
        startAutoSlide();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            showPrevSlide();
        } else if (e.key === 'ArrowRight') {
            showNextSlide();
        }
    });

    // Start auto-rotation
    startAutoSlide();

    console.log('Hero slider initialized successfully');
}