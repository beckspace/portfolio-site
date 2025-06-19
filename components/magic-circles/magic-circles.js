// Updated Magic Circles JS file with random positioning
// Magic Circles Component - Final Version
// No automatic initialization on DOMContentLoaded - hero.js will handle this

/**
 * Geometric Magic Circles Component
 * Creates arcane geometric patterns
 */
const MagicCircles = (function () {
    // Private variables
    let initialized = false;
    let container = null;
    let circles = [];



    // Configuration
    const config = {
        circleCount: 3,
        sizes: [300, 600, 900],  // Size in pixels
        minDistance: 50,         // Minimum distance from edges (%)
        fadeInDelay: 500,        // Base delay before first circle appears (ms)
        delayBetween: 700,       // Delay between each circle appearing (ms)
        glowParticles: 6,        // Number of glow particles per circle
        colors: {
            primary: '#3e6fff',   // Blue primary color
            secondary: '#5082ff'  // Lighter blue secondary color
        },
        randomPositioning: true, // Enable fully random positioning by default
        debug: false
    };

    /**
     * Initialize the magic circles
     * @param {string} containerId - ID of the container element
     * @param {Object} options - Optional configuration
     * @returns {boolean} - Success status
     */
    function init(containerId = 'magic-circles-container', options = {}) {
        // Prevent double initialization
        if (initialized) {
            if (config.debug) {
                console.log('Magic circles already initialized');
            }
            return false;
        }

        // Update config with any provided options
        Object.assign(config, options);

        // Get container element
        container = document.getElementById(containerId);

        if (!container) {
            console.error(`Magic circles container #${containerId} not found`);
            return false;
        }

        // Clear any existing content
        container.innerHTML = '';
        circles = [];

        // Enable debug mode if needed
        if (config.debug) {
            // container.style.backgroundColor = 'rgba(255, 0, 0, 0.05)';
            console.log('Magic circles in debug mode');
        }

        // Create the circles
        createCircles();

        // Set up resize handler
        setupResizeHandler();

        // Mark as initialized
        initialized = true;

        if (config.debug) {
            console.log('Magic circles initialized with config:', config);
        }

        return true;
    }

    /**
     * Check if the component is initialized
     * @returns {boolean} - Initialization status
     */
    function isInitialized() {
        return initialized;
    }

    /**
     * Set up the resize event handler with debounce
     * @private
     */
    function setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                reposition();
            }, 250);
        });
    }

    /**
     * Generate a random position for a circle
     * @private
     * @param {number} containerWidth - Width of the container
     * @param {number} containerHeight - Height of the container
     * @param {number} size - Size of the circle
     * @returns {Object} - Random position {x, y}
     */
    function generateRandomPosition(containerWidth, containerHeight, size) {
        // Calculate the safe area bounds (allowing circles to stay fully visible)
        const minX = 0;
        const maxX = containerWidth - size;
        const minY = 0;
        const maxY = containerHeight - size;

        // Generate random position within safe area
        return {
            x: minX + Math.random() * (maxX - minX),
            y: minY + Math.random() * (maxY - minY)
        };
    }

    /**
     * Create geometric magic circles with SVG patterns
     * @private
     */
    function createCircles() {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        // Add this check
        if (containerWidth === 0 || containerHeight === 0) {
            console.error('Container has zero dimensions, delaying initialization');
            setTimeout(() => createCircles(), 200);  // Retry after 200ms
            return;
        }

        // Fixed positions as fallback
        // Rule of thirds positions
        const fixedPositions = [
            { x: containerWidth * 0.38, y: containerHeight * 0.38 }, // Inner spiral point
            { x: containerWidth * 0.62, y: containerHeight * 0.62 }, // Middle spiral point
            { x: containerWidth * 0.76, y: containerHeight * 0.24 }  // Outer spiral point
        ];

        for (let i = 0; i < config.circleCount; i++) {
            // Create circle element
            const circle = document.createElement('div');
            circle.className = 'magic-circle';

            // Set size
            const size = config.sizes[i] || 500;
            circle.style.width = `${size}px`;
            circle.style.height = `${size}px`;

            // Apply position based on configuration
            let position;
            if (config.randomPositioning) {
                // Generate completely random position
                position = generateRandomPosition(containerWidth, containerHeight, size);
            } else {
                // Use fixed position with slight randomization (+/- 5%)
                const basePosition = fixedPositions[i % fixedPositions.length];
                position = {
                    x: basePosition.x + (Math.random() * 0.1 - 0.05) * containerWidth,
                    y: basePosition.y + (Math.random() * 0.1 - 0.05) * containerHeight
                };
            }



            // Add 3D transform to the SECOND circle (index 1)
            if (i === 1 || 2) {  // You can change this to target any circle (0, 1, or 2)
                // Apply 3D transformation
                circle.style.transform = `
            scale(0.95)
            perspective(1000px) 
            rotateX(25deg) 
            rotateY(-15deg)
        `;

                // When it fades in, we need to override the transform
                const originalTransform = circle.style.transform;
                setTimeout(() => {
                    circle.classList.add('skewed-circle'); // Add a special class
                    // The fade-in class applies transform: scale(1)
                    // We need to extend this with our rotation
                    circle.style.transform = `
                scale(1)
                perspective(1000px) 
                rotateX(65deg) 
                rotateY(-35deg)
            `;
                }, config.fadeInDelay + (i * config.delayBetween));
            } else {
                // Apply delayed fade-in for staggered appearance as before
                setTimeout(() => {
                    circle.classList.add('fade-in');
                    // Add other animations as before
                }, config.fadeInDelay + (i * config.delayBetween));
            }





            // Ensure the circle stays within bounds
            const maxX = containerWidth - size;
            const maxY = containerHeight - size;
            const posX = Math.max(0, Math.min(maxX, position.x));
            const posY = Math.max(0, Math.min(maxY, position.y));

            // Apply position
            circle.style.left = `${posX}px`;
            circle.style.top = `${posY}px`;

            // Create gradient overlay
            const gradientOverlay = document.createElement('div');
            gradientOverlay.className = 'outer-ring-gradient';
            circle.appendChild(gradientOverlay);

            // Create SVG container
            const svgContainer = document.createElement('div');
            svgContainer.className = 'circle-svg-container';

            // Add the SVG pattern
            svgContainer.innerHTML = createCircleSvg(size, i);
            circle.appendChild(svgContainer);

            // Create inner rotating container for some elements
            const innerContainer = document.createElement('div');
            innerContainer.className = 'inner-svg-container';

            // Add glow particles
            addGlowParticles(innerContainer, size);

            circle.appendChild(innerContainer);

            // Add to container
            container.appendChild(circle);

            // Store reference
            circles.push(circle);

            // Apply delayed fade-in for staggered appearance
            setTimeout(() => {
                // Add class to trigger CSS transition
                circle.classList.add('fade-in');

                // Longer delay before adding the animation class
                // This ensures the initial fade-in is completed before pulsing starts
                setTimeout(() => {
                    // Create a custom animation-duration for each circle
                    const duration = 8 + i * 0.7;

                    // Apply animation properties using CSS variables
                    circle.style.setProperty('--pulse-duration', `${duration}s`);
                    circle.style.setProperty('--pulse-delay', `${1.5 + i * 0.5}s`); // Longer delay

                    // Add a class to trigger the animation
                    circle.classList.add('animate-pulse');
                }, 2000); // Increased delay for a more complete fade-in

            }, config.fadeInDelay + (i * config.delayBetween));

            if (config.debug) {
                console.log(`Circle ${i + 1} created at position:`, { x: posX, y: posY, size });
            }
        }
    }

    /**
     * Create SVG for a geometric magic circle
     * @private
     * @param {number} size - Size of the circle
     * @param {number} index - Circle index
     * @returns {string} - SVG markup
     */
    function createCircleSvg(size, index) {
        // SVG viewport size
        const viewSize = 1000;
        const center = viewSize / 2;

        // Different pattern based on index
        const isEven = index % 2 === 0;

        // Create SVG string
        let svg = `<svg class="circle-svg" viewBox="0 0 ${viewSize} ${viewSize}" width="100%" height="100%">`;

        // Add outer rings
        svg += `<circle class="outer-ring" cx="${center}" cy="${center}" r="${center - 5}" />`;
        svg += `<circle class="outer-ring" cx="${center}" cy="${center}" r="${center - 25}" />`;

        // Add square
        const squareSize = center * 1.4;
        const squareOffset = (viewSize - squareSize) / 2;
        svg += `<rect class="square" x="${squareOffset}" y="${squareOffset}" width="${squareSize}" height="${squareSize}" />`;

        // Add inner circles
        svg += `<circle class="inner-circle" cx="${center}" cy="${center}" r="${center * 0.7}" />`;
        svg += `<circle class="inner-circle" cx="${center}" cy="${center}" r="${center * 0.5}" />`;
        svg += `<circle class="inner-circle" cx="${center}" cy="${center}" r="${center * 0.3}" />`;
        svg += `<circle class="inner-circle" cx="${center}" cy="${center}" r="${center * 0.1}" />`;

        // Add dividing lines - vertical, horizontal, and diagonal
        svg += `<line class="divider-line" x1="${center}" y1="0" x2="${center}" y2="${viewSize}" />`;
        svg += `<line class="divider-line" x1="0" y1="${center}" x2="${viewSize}" y2="${center}" />`;
        svg += `<line class="divider-line" x1="0" y1="0" x2="${viewSize}" y2="${viewSize}" />`;
        svg += `<line class="divider-line" x1="${viewSize}" y1="0" x2="0" y2="${viewSize}" />`;

        // Add small circles at intersection points
        const smallCirclePositions = [
            // Top, right, bottom, left
            [center, center * 0.3],
            [center * 1.7, center],
            [center, center * 1.7],
            [center * 0.3, center]
        ];

        smallCirclePositions.forEach(pos => {
            svg += `<circle class="small-circle" cx="${pos[0]}" cy="${pos[1]}" r="${center * 0.1}" />`;
        });

        // Add more complex structure based on index
        if (isEven) {
            // Add arcs connecting the small circles
            for (let i = 0; i < smallCirclePositions.length; i++) {
                const start = smallCirclePositions[i];
                const end = smallCirclePositions[(i + 1) % smallCirclePositions.length];

                svg += `<path class="inner-structure" d="M ${start[0]} ${start[1]} A ${center} ${center} 0 0 1 ${end[0]} ${end[1]}" />`;
            }
        } else {
            // Add cross-connecting lines
            for (let i = 0; i < smallCirclePositions.length; i++) {
                for (let j = i + 1; j < smallCirclePositions.length; j++) {
                    svg += `<line class="inner-structure" x1="${smallCirclePositions[i][0]}" y1="${smallCirclePositions[i][1]}" 
                                  x2="${smallCirclePositions[j][0]}" y2="${smallCirclePositions[j][1]}" />`;
                }
            }
        }

        // Close SVG
        svg += '</svg>';

        return svg;
    }

    /**
     * Add glowing particles to the circle
     * @private
     * @param {Element} container - The container element
     * @param {number} size - Circle size
     */
    function addGlowParticles(container, size) {
        const particleCount = config.glowParticles;
        const radius = size * 0.35;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'circle-glow-particle';

            // Position in a circle
            const angle = (i * (360 / particleCount)) * (Math.PI / 180);
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            particle.style.left = `calc(50% + ${x}px)`;
            particle.style.top = `calc(50% + ${y}px)`;

            // Animation delay
            particle.style.animationDelay = `${i * 0.5}s`;

            container.appendChild(particle);
        }
    }

    /**
     * Debug the magic circles (highlights elements and logs info)
     * @public
     */
    function debug() {
        if (!initialized) {
            console.error('Magic circles not initialized');
            return;
        }

        // Add debug styling
        container.style.backgroundColor = 'rgba(255, 0, 0, 0)';

        // Debug each circle
        circles.forEach((circle, i) => {
            // Add temporary highlight
            const originalBorder = circle.style.border;
            circle.style.border = '2px solid red';

            // Log dimensions and position
            console.log(`Circle ${i + 1}:`, {
                width: circle.offsetWidth,
                height: circle.offsetHeight,
                top: circle.offsetTop,
                left: circle.offsetLeft,
                visible: isVisible(circle)
            });

            // Restore original border after 3 seconds
            setTimeout(() => {
                circle.style.border = originalBorder;
            }, 3000);
        });
    }

    /**
     * Check if an element is visible
     * @private
     * @param {Element} element - Element to check
     * @returns {boolean} - Whether element is visible
     */
    function isVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.width > 0 &&
            rect.height > 0 &&
            rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
            rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
            rect.bottom > 0 &&
            rect.right > 0
        );
    }

    /**
     * Reposition all circles based on container size
     * @public
     */
    function reposition() {
        if (!initialized || !container) {
            return;
        }

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        // Fixed positions for fallback
        const fixedPositions = [
            { x: containerWidth * 0.2, y: containerHeight * 0.3 }, // Top left
            { x: containerWidth * 0.7, y: containerHeight * 0.4 }, // Top right
            { x: containerWidth * 0.4, y: containerHeight * 0.7 }  // Bottom
        ];

        circles.forEach((circle, i) => {
            const size = circle.offsetWidth;

            // Get new position based on configuration
            let position;
            if (config.randomPositioning) {
                // Generate completely random position
                position = generateRandomPosition(containerWidth, containerHeight, size);
            } else {
                // Use fixed position with a little randomness
                const basePosition = fixedPositions[i % fixedPositions.length];
                position = {
                    x: basePosition.x + (Math.random() * 0.05 - 0.025) * containerWidth,
                    y: basePosition.y + (Math.random() * 0.05 - 0.025) * containerHeight
                };
            }

            // Ensure the circle stays within bounds
            const maxX = containerWidth - size;
            const maxY = containerHeight - size;
            const posX = Math.max(0, Math.min(maxX, position.x));
            const posY = Math.max(0, Math.min(maxY, position.y));

            // Apply new position with transition
            circle.style.left = `${posX}px`;
            circle.style.top = `${posY}px`;
        });
    }

    /**
     * Update magic circles configuration and redraw
     * @param {Object} options - New configuration options
     * @public
     */
    function updateConfig(options = {}) {
        // Update config with new options
        Object.assign(config, options);

        // Redraw if initialized
        if (initialized && container) {
            // Clear existing circles
            container.innerHTML = '';
            circles = [];

            // Create new circles with updated config
            createCircles();
        }

        return config;
    }

    /**
     * Destroy the magic circles
     * @public
     */
    function destroy() {
        if (!initialized || !container) {
            return;
        }

        container.innerHTML = '';
        circles = [];
        initialized = false;

        if (config.debug) {
            console.log('Magic circles destroyed');
        }
    }

    // Public API
    return {
        init,
        isInitialized,
        debug,
        reposition,
        updateConfig,
        destroy
    };
})();

// For external use
window.MagicCircles = MagicCircles;