/**
 * ComponentLoader - A utility for loading HTML components dynamically
 * This can be used to load components via AJAX or from template elements
 */
class ComponentLoader {
    constructor(options = {}) {
        // Default options
        this.options = {
            basePath: 'components/', // Updated base path
            fileExtension: '.html',
            useCache: true,
            templatesSelector: '#component-templates',
            ...options
        };

        // Component cache
        this.cache = {};

        // Track loaded components
        this.loadedComponents = new Set();

        // Initialize if templates are present
        this.templateContainer = document.querySelector(this.options.templatesSelector);
        if (this.templateContainer) {
            this.initFromTemplates();
        }
    }

    /**
     * Initialize components from template elements if present in the DOM
     */
    initFromTemplates() {
        const templates = this.templateContainer.querySelectorAll('template[data-component]');
        templates.forEach(template => {
            const name = template.getAttribute('data-component');
            this.cache[name] = template.innerHTML;
        });
    }

    /**
     * Load a component and inject it into the target element
     * @param {string} name - Component name
     * @param {string|Element} target - Target selector or element
     * @param {Object} data - Optional data to pass to the component
     * @returns {Promise} - Resolves when component is loaded
     */
    async load(name, target, data = {}) {
        // Resolve target element
        const targetElement = typeof target === 'string'
            ? document.querySelector(target)
            : target;

        if (!targetElement) {
            console.error(`Target element not found for component ${name}`);
            return;
        }

        try {
            // Get component HTML
            const html = await this.getComponent(name);

            // Process template with data
            const processedHtml = this.processTemplate(html, data);

            // Insert into target
            targetElement.innerHTML = processedHtml;

            // Add to loaded components
            this.loadedComponents.add(name);

            // Dispatch component loaded event
            this.dispatchComponentEvent(name, 'loaded', { target: targetElement });

            return targetElement;
        } catch (error) {
            console.error(`Error loading component ${name}:`, error);
            this.dispatchComponentEvent(name, 'error', { error });
            throw error;
        }
    }

    /**
     * Get component HTML either from cache or by loading from server
     * @param {string} name - Component name
     * @returns {Promise<string>} - Component HTML
     */
    async getComponent(name) {
        // Check cache first
        if (this.options.useCache && this.cache[name]) {
            return this.cache[name];
        }

        // Load from server - updated path to include component name directory
        const url = `${this.options.basePath}${name}/${name}${this.options.fileExtension}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to load component ${name}: ${response.status} ${response.statusText}`);
            }

            const html = await response.text();

            // Cache the result
            if (this.options.useCache) {
                this.cache[name] = html;
            }

            return html;
        } catch (error) {
            console.error(`Error fetching component ${name}:`, error);
            throw error;
        }
    }

    /**
     * Process template with data using simple placeholder replacement
     * @param {string} template - Template HTML
     * @param {Object} data - Data to inject
     * @returns {string} - Processed HTML
     */
    processTemplate(template, data) {
        if (!data || Object.keys(data).length === 0) {
            return template;
        }

        let result = template;

        // Replace {{key}} placeholders with data values
        Object.entries(data).forEach(([key, value]) => {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            result = result.replace(regex, value);
        });

        return result;
    }

    /**
     * Dispatch custom event for component lifecycle
     * @param {string} name - Component name
     * @param {string} eventType - Event type (loaded, error, etc.)
     * @param {Object} detail - Event details
     */
    dispatchComponentEvent(name, eventType, detail = {}) {
        const eventName = `component:${name}:${eventType}`;
        const event = new CustomEvent(eventName, {
            bubbles: true,
            detail: {
                component: name,
                ...detail
            }
        });
        document.dispatchEvent(event);

        // Also dispatch general component event
        const generalEvent = new CustomEvent(`component:${eventType}`, {
            bubbles: true,
            detail: {
                component: name,
                ...detail
            }
        });
        document.dispatchEvent(generalEvent);
    }

    /**
     * Load multiple components at once
     * @param {Array} components - Array of {name, target, data} objects
     * @returns {Promise} - Resolves when all components are loaded
     */
    loadAll(components) {
        const promises = components.map(component =>
            this.load(component.name, component.target, component.data)
        );
        return Promise.all(promises);
    }

    /**
     * Unload a component by removing it from the DOM
     * @param {string} name - Component name
     * @param {string|Element} target - Target selector or element
     * @returns {boolean} - Success status
     */
    unload(name, target) {
        // Resolve target element
        const targetElement = typeof target === 'string'
            ? document.querySelector(target)
            : target;

        if (!targetElement) {
            console.error(`Target element not found for unloading component ${name}`);
            return false;
        }

        // Remove content
        targetElement.innerHTML = '';

        // Remove from loaded components
        this.loadedComponents.delete(name);

        // Dispatch unloaded event
        this.dispatchComponentEvent(name, 'unloaded', { target: targetElement });

        return true;
    }

    /**
     * Refresh/reload a component
     * @param {string} name - Component name
     * @param {string|Element} target - Target selector or element
     * @param {Object} data - Optional data to pass to the component
     * @returns {Promise} - Resolves when component is reloaded
     */
    async refresh(name, target, data = {}) {
        this.unload(name, target);
        return this.load(name, target, data);
    }

    /**
     * Get a list of all loaded components
     * @returns {Array} - Array of component names
     */
    getLoadedComponents() {
        return Array.from(this.loadedComponents);
    }

    /**
     * Clear the component cache
     * @param {string} name - Optional component name to clear specific cache
     */
    clearCache(name = null) {
        if (name) {
            delete this.cache[name];
        } else {
            this.cache = {};
        }
    }
}

// Create global instance
window.componentLoader = new ComponentLoader();

// Example usage:
// document.addEventListener('DOMContentLoaded', function() {
//     // Load all components
//     window.componentLoader.loadAll([
//         { name: 'header', target: '#header-container' },
//         { name: 'hero', target: '#hero-container' },
//         { name: 'services', target: '#services-container' },
//         { name: 'projects', target: '#projects-container' },
//         { name: 'about', target: '#about-container' },
//         { name: 'contact', target: '#contact-container' },
//         { name: 'footer', target: '#footer-container' }
//     ]);
// });
