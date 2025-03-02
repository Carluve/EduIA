/**
 * main.js
 * Funciones principales para el sitio web de investigación sobre LLMs en examen MIR
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes cuando el DOM esté listo
    initNavigation();
    initSmoothScrolling();
    initResponsiveNavigation();
    setPrintDate();
    initChartNavigation();
    handleLazyLoading();
    attachEventListeners();
});

/**
 * Inicializa la navegación principal
 */
function initNavigation() {
    // Marcar enlace activo basado en la sección visible
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Detector de scroll para actualizar enlaces activos
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + 100; // Offset para considerar la navegación fija
        
        // Encontrar la sección actualmente visible
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Actualizar enlaces activos en la navegación
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Inicializa el desplazamiento suave entre secciones
 */
function initSmoothScrolling() {
    // Maneja clics en enlaces internos para desplazamiento suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // No hacer nada si es solo un ancla "#"
            if (targetId === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calcular offset para la navegación fija
                const navHeight = document.querySelector('.main-nav').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil si está abierto
                const navList = document.querySelector('.nav-list');
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    document.querySelector('.mobile-nav-toggle').classList.remove('active');
                }
            }
        });
    });
}

/**
 * Inicializa la navegación responsiva para dispositivos móviles
 */
function initResponsiveNavigation() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (mobileNavToggle && navList) {
        mobileNavToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            this.classList.toggle('active');
            
            // Cambiar aria-expanded para accesibilidad
            const expanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !expanded);
            
            // Cambiar ícono de hamburguesa a X
            const hamburgerIcon = this.querySelector('.hamburger-icon');
            if (hamburgerIcon) {
                hamburgerIcon.classList.toggle('active');
            }
        });
        
        // Cerrar menú al cambiar tamaño de ventana
        window.addEventListener('resize', function() {
            if (window.innerWidth > 767 && navList.classList.contains('active')) {
                navList.classList.remove('active');
                mobileNavToggle.classList.remove('active');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
                
                const hamburgerIcon = mobileNavToggle.querySelector('.hamburger-icon');
                if (hamburgerIcon) {
                    hamburgerIcon.classList.remove('active');
                }
            }
        });
    }
}

/**
 * Configura la fecha de impresión en el atributo data-print-date del body
 */
function setPrintDate() {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('es-ES', {
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    document.body.setAttribute('data-print-date', formattedDate);
}

/**
 * Inicializa la navegación entre diferentes tipos de gráficos
 */
function initChartNavigation() {
    const chartBtns = document.querySelectorAll('.chart-btn');
    
    chartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Obtener datos del botón
            const chartType = this.getAttribute('data-chart');
            const chartContainer = this.closest('.chart-container');
            
            if (!chartContainer) return;
            
            // Activar botón actual y desactivar otros
            const siblingBtns = chartContainer.querySelectorAll('.chart-btn');
            siblingBtns.forEach(sibling => sibling.classList.remove('active'));
            this.classList.add('active');
            
            // Obtener ID del gráfico a actualizar
            const chartElement = chartContainer.querySelector('.chart');
            if (!chartElement) return;
            
            const chartId = chartElement.id;
            
            // Mostrar indicador de carga mientras se actualiza el gráfico
            showChartLoading(chartElement);
            
            // Actualizar el gráfico (función implementada en charts-renderer.js)
            if (typeof updateChart === 'function') {
                // Pequeño retraso para que la animación de carga sea visible
                setTimeout(() => {
                    updateChart(chartId, chartType);
                    hideChartLoading(chartElement);
                }, 300);
            } else {
                console.warn('La función updateChart no está disponible. Asegúrate de cargar charts-renderer.js');
                hideChartLoading(chartElement);
            }
        });
    });
}

/**
 * Muestra el indicador de carga para un gráfico
 * @param {HTMLElement} chartElement - Elemento del gráfico
 */
function showChartLoading(chartElement) {
    // Verificar si ya existe un loader
    let loader = chartElement.querySelector('.chart-loading');
    
    if (!loader) {
        // Crear nuevo loader
        loader = document.createElement('div');
        loader.className = 'chart-loading';
        
        const spinner = document.createElement('div');
        spinner.className = 'chart-loading-spinner';
        loader.appendChild(spinner);
        
        chartElement.appendChild(loader);
    }
    
    // Activar el loader con una pequeña demora para permitir animación
    setTimeout(() => {
        loader.classList.add('active');
    }, 10);
}

/**
 * Oculta el indicador de carga para un gráfico
 * @param {HTMLElement} chartElement - Elemento del gráfico
 */
function hideChartLoading(chartElement) {
    const loader = chartElement.querySelector('.chart-loading');
    if (loader) {
        loader.classList.remove('active');
        
        // Eliminar el loader después de que termine la animación
        setTimeout(() => {
            loader.remove();
        }, 300);
    }
}

/**
 * Configura la carga diferida de imágenes y otros recursos
 */
function handleLazyLoading() {
    // Implementar lazy loading para imágenes si IntersectionObserver está disponible
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        img.classList.add('fade-in');
                    }
                    
                    observer.unobserve(img);
                }
            });
        });
        
        // Observar todas las imágenes con data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imgObserver.observe(img);
        });
    } else {
        // Fallback para navegadores sin soporte para IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
}

/**
 * Añade event listeners a elementos interactivos
 */
function attachEventListeners() {
    // Event listener para tooltips en gráficos
    document.addEventListener('mousemove', handleChartTooltips);
    
    // Event listener para tarjetas interactivas
    const researcherCards = document.querySelectorAll('.researcher-card');
    researcherCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
    
    // Leer más / menos en textos extensos
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    if (readMoreButtons) {
        readMoreButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const expandable = this.previousElementSibling;
                
                expandable.classList.toggle('expanded');
                
                if (expandable.classList.contains('expanded')) {
                    this.textContent = 'Leer menos';
                } else {
                    this.textContent = 'Leer más';
                    
                    // Desplazarse hacia arriba para ver el principio del texto
                    const offset = expandable.offsetTop - 100;
                    window.scrollTo({
                        top: offset,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

/**
 * Maneja la visualización de tooltips en gráficos
 * @param {Event} e - Evento mousemove
 */
function handleChartTooltips(e) {
    const target = e.target;
    
    // Comprobar si el elemento tiene datos de tooltip
    if (target.hasAttribute('data-tooltip')) {
        const tooltipContent = target.getAttribute('data-tooltip');
        
        // Obtener o crear el elemento tooltip
        let tooltip = document.querySelector('.chart-tooltip');
        
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'chart-tooltip';
            document.body.appendChild(tooltip);
        }
        
        // Posicionar y mostrar el tooltip
        tooltip.innerHTML = tooltipContent;
        tooltip.style.left = (e.pageX + 10) + 'px';
        tooltip.style.top = (e.pageY + 10) + 'px';
        tooltip.classList.add('visible');
        
        // Ajustar posición si se sale de la ventana
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        if (tooltipRect.right > viewportWidth) {
            tooltip.style.left = (e.pageX - tooltipRect.width - 10) + 'px';
        }
        
        if (tooltipRect.bottom > viewportHeight) {
            tooltip.style.top = (e.pageY - tooltipRect.height - 10) + 'px';
        }
    } else {
        // Ocultar tooltip si el mouse está sobre un elemento sin data-tooltip
        const tooltip = document.querySelector('.chart-tooltip');
        if (tooltip) {
            tooltip.classList.remove('visible');
        }
    }
}

/**
 * Función para manejar errores en los scripts
 * @param {string} message - Mensaje de error
 * @param {string} source - Archivo fuente
 * @param {number} lineno - Número de línea
 */
window.onerror = function(message, source, lineno) {
    console.error(`Error en ${source} línea ${lineno}: ${message}`);
    
    // Si es un error en un gráfico, limpiar indicadores de carga
    document.querySelectorAll('.chart-loading').forEach(loader => {
        loader.classList.remove('active');
    });
    
    return false; // Dejar que el error se propague
};

/**
 * Detecta si el usuario está usando un dispositivo táctil
 * @returns {boolean} Verdadero si es dispositivo táctil
 */
function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}

// Añadir clase al body para dispositivos táctiles
if (isTouchDevice()) {
    document.body.classList.add('touch-device');
}

// Detectar si se está usando modo oscuro a nivel de sistema
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Podría usarse para activar un modo oscuro en el futuro
    console.log('El usuario prefiere modo oscuro');
}
