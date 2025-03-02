/**
 * charts-renderer.js
 * Sistema de renderizado de gráficos para el estudio sobre LLMs en el examen MIR
 * 
 * Este archivo contiene las funciones necesarias para crear y actualizar
 * visualizaciones de datos utilizando los datasets definidos en charts-data.js
 */

// Namespace para el renderizador de gráficos
const MIRChartRenderer = (function() {
    // Paleta de colores consistente para todos los gráficos
    const colors = {
        primary: '#1D3A83',
        secondary: '#E63946', 
        accent: '#F4A261',
        neutral: '#457B9D',
        light: '#F1FAEE',
        
        // Colores por tipo de modelo
        modelTypes: {
            'General': '#f28e2c',
            'Especializado': '#59a14f',
            'Multimodal': '#4e79a7',
            'Razonamiento': '#76b7b2',
            'Humano': '#e15759'
        },
        
        // Paleta extendida para gráficos
        chartColors: [
            '#4e79a7', '#f28e2c', '#e15759', '#76b7b2', 
            '#59a14f', '#af7aa1', '#ff9da7', '#9c755f', 
            '#bab0ac', '#6b9ac4', '#d7b5a6', '#e8ccd7'
        ],
        
        // Paleta para años
        years: {
            '2024': '#4e79a7',
            '2025': '#f28e2c'
        },
        
        // Para rendimiento positivo/negativo
        performance: {
            positive: '#59a14f',
            negative: '#e15759',
            neutral: '#bab0ac'
        }
    };
    
    // Opciones de formato
    const formatOptions = {
        percentage: { 
            minimumFractionDigits: 1, 
            maximumFractionDigits: 1,
            style: 'percent',
            multiplier: 0.01 
        },
        decimal: { 
            minimumFractionDigits: 1, 
            maximumFractionDigits: 1 
        },
        integer: { 
            maximumFractionDigits: 0 
        }
    };
    
    /**
     * Inicializa todos los gráficos cuando el DOM está cargado
     */
    function initializeCharts() {
        // Inicializar cada gráfico con su visualización predeterminada
        renderPerformanceComparisonChart('overall-comparison');
        renderReasoningChart('reasoning-2024');
        renderImageQuestionsChart('images-overall');
        renderModelPerformanceChart('models-2024');
        renderHumanVsAIChart('human-vs-ai-overall');
        
        console.log('Todos los gráficos inicializados correctamente');
    }
    
    /**
     * Actualiza un gráfico específico con el tipo de visualización seleccionado
     * @param {string} chartId - ID del elemento que contiene el gráfico
     * @param {string} chartType - Tipo de visualización a mostrar
     */
    function updateChart(chartId, chartType) {
        switch(chartId) {
            case 'performance-comparison-chart':
                renderPerformanceComparisonChart(chartType);
                break;
            case 'reasoning-chart':
                renderReasoningChart(chartType);
                break;
            case 'image-questions-chart':
                renderImageQuestionsChart(chartType);
                break;
            case 'model-performance-chart':
                renderModelPerformanceChart(chartType);
                break;
            case 'human-vs-ai-chart':
                renderHumanVsAIChart(chartType);
                break;
            default:
                console.warn(`Gráfico con ID '${chartId}' no encontrado o no implementado.`);
        }
    }
    
    /**
     * Renderiza el gráfico de comparación de rendimiento
     * @param {string} chartType - Tipo de visualización ('overall-comparison' o 'year-change')
     */
    function renderPerformanceComparisonChart(chartType) {
        const container = document.getElementById('performance-comparison-chart');
        if (!container) return;
        
        // Limpiar el contenedor antes de dibujar
        container.innerHTML = '';
        
        // Crear el elemento SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 800 400');
        svg.classList.add('chart-animated');
        container.appendChild(svg);
        
        // Configuración del gráfico
        const margin = { top: 60, right: 30, bottom: 100, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        
        // Crear grupo principal con margen
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
        svg.appendChild(g);
        
        // Añadir título
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        title.setAttribute('x', width / 2);
        title.setAttribute('y', -30);
        title.setAttribute('text-anchor', 'middle');
        title.classList.add('chart-title');
        title.textContent = chartType === 'overall-comparison' 
            ? 'Comparación de Rendimiento de Modelos (2024-2025)' 
            : 'Cambio de Rendimiento entre 2024-2025';
        g.appendChild(title);
        
        // Añadir subtítulo
        const subtitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        subtitle.setAttribute('x', width / 2);
        subtitle.setAttribute('y', -10);
        subtitle.setAttribute('text-anchor', 'middle');
        subtitle.classList.add('chart-subtitle');
        subtitle.textContent = chartType === 'overall-comparison'
            ? 'Porcentaje de preguntas contestadas correctamente'
            : 'Diferencia porcentual entre ambos años';
        g.appendChild(subtitle);
        
        if (chartType === 'overall-comparison') {
            renderOverallComparison(g, width, height);
        } else if (chartType === 'year-change') {
            renderYearChange(g, width, height);
        }
        
        // Función auxiliar para renderizar la comparación general
        function renderOverallComparison(g, width, height) {
            // Obtener datos ordenados por rendimiento 2024
            const data = MIRChartData.getModelsByPerformance(2024).slice(0, 12); // Limitamos a 12 para legibilidad
            
            // Escalas
            const xScale = d3.scaleBand()
                .domain(data.map(d => d.model))
                .range([0, width])
                .padding(0.4);
            
            const yScale = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0]);
            
            // Ejes
            // Eje X
            const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            xAxis.setAttribute('transform', `translate(0,${height})`);
            xAxis.classList.add('chart-axis');
            
            data.forEach(d => {
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', xScale(d.model) + xScale.bandwidth() / 2);
                text.setAttribute('y', 20);
                text.setAttribute('text-anchor', 'end');
                text.setAttribute('transform', `rotate(-45, ${xScale(d.model) + xScale.bandwidth() / 2}, 20)`);
                text.textContent = d.model;
                xAxis.appendChild(text);
            });
            
            // Líneas de cuadrícula horizontales
            for (let i = 0; i <= 10; i++) {
                const y = yScale(i * 10);
                
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', 0);
                line.setAttribute('y1', y);
                line.setAttribute('x2', width);
                line.setAttribute('y2', y);
                line.setAttribute('stroke', '#e5e5e5');
                line.setAttribute('stroke-width', '1');
                if (i > 0) line.setAttribute('stroke-dasharray', '2,2');
                g.appendChild(line);
                
                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('x', -10);
                label.setAttribute('y', y + 5);
                label.setAttribute('text-anchor', 'end');
                label.textContent = `${i * 10}%`;
                g.appendChild(label);
            }
            
            g.appendChild(xAxis);
            
            // Título del eje Y
            const yTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            yTitle.setAttribute('transform', 'rotate(-90)');
            yTitle.setAttribute('x', -height/2);
            yTitle.setAttribute('y', -40);
            yTitle.setAttribute('text-anchor', 'middle');
            yTitle.classList.add('chart-axis-title');
            yTitle.textContent = 'Porcentaje de Aciertos';
            g.appendChild(yTitle);
            
            // Barras para cada año
            data.forEach(d => {
                // Grupo para cada modelo
                const modelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                modelGroup.classList.add('model-group');
                g.appendChild(modelGroup);
                
                // Barra 2024
                const bar2024 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                bar2024.setAttribute('x', xScale(d.model));
                bar2024.setAttribute('y', yScale(d.score2024));
                bar2024.setAttribute('width', xScale.bandwidth() / 2 - 2);
                bar2024.setAttribute('height', height - yScale(d.score2024));
                bar2024.setAttribute('fill', colors.years['2024']);
                bar2024.classList.add('chart-bar', 'bar-2024');
                
                // Datos para tooltip
                bar2024.setAttribute('data-tooltip', 
                    `<div class="chart-tooltip-title">${d.model}</div>` +
                    `<div>2024: ${d.score2024.toFixed(1)}%</div>` +
                    `<div>Tipo: ${d.type}</div>`
                );
                
                modelGroup.appendChild(bar2024);
                
                // Etiqueta de valor 2024
                if (d.score2024 >= 10) {
                    const label2024 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    label2024.setAttribute('x', xScale(d.model) + (xScale.bandwidth() / 4));
                    label2024.setAttribute('y', yScale(d.score2024) - 5);
                    label2024.setAttribute('text-anchor', 'middle');
                    label2024.classList.add('chart-label');
                    label2024.textContent = d.score2024.toFixed(0);
                    modelGroup.appendChild(label2024);
                }
                
                // Barra 2025
                const bar2025 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                bar2025.setAttribute('x', xScale(d.model) + xScale.bandwidth() / 2 + 2);
                bar2025.setAttribute('y', yScale(d.score2025));
                bar2025.setAttribute('width', xScale.bandwidth() / 2 - 2);
                bar2025.setAttribute('height', height - yScale(d.score2025));
                bar2025.setAttribute('fill', colors.years['2025']);
                bar2025.classList.add('chart-bar', 'bar-2025');
                
                // Datos para tooltip
                bar2025.setAttribute('data-tooltip', 
                    `<div class="chart-tooltip-title">${d.model}</div>` +
                    `<div>2025: ${d.score2025.toFixed(1)}%</div>` +
                    `<div>Tipo: ${d.type}</div>`
                );
                
                modelGroup.appendChild(bar2025);
                
                // Etiqueta de valor 2025
                if (d.score2025 >= 10) {
                    const label2025 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    label2025.setAttribute('x', xScale(d.model) + (xScale.bandwidth() * 3/4));
                    label2025.setAttribute('y', yScale(d.score2025) - 5);
                    label2025.setAttribute('text-anchor', 'middle');
                    label2025.classList.add('chart-label');
                    label2025.textContent = d.score2025.toFixed(0);
                    modelGroup.appendChild(label2025);
                }
            });
            
            // Leyenda
            const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            legend.setAttribute('transform', `translate(${width - 110}, 10)`);
            
            // Leyenda 2024
            const legend2024Rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            legend2024Rect.setAttribute('x', 0);
            legend2024Rect.setAttribute('y', 0);
            legend2024Rect.setAttribute('width', 15);
            legend2024Rect.setAttribute('height', 15);
            legend2024Rect.setAttribute('fill', colors.years['2024']);
            legend.appendChild(legend2024Rect);
            
            const legend2024Text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            legend2024Text.setAttribute('x', 20);
            legend2024Text.setAttribute('y', 12);
            legend2024Text.textContent = '2024';
            legend.appendChild(legend2024Text);
            
            // Leyenda 2025
            const legend2025Rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            legend2025Rect.setAttribute('x', 0);
            legend2025Rect.setAttribute('y', 25);
            legend2025Rect.setAttribute('width', 15);
            legend2025Rect.setAttribute('height', 15);
            legend2025Rect.setAttribute('fill', colors.years['2025']);
            legend.appendChild(legend2025Rect);
            
            const legend2025Text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            legend2025Text.setAttribute('x', 20);
            legend2025Text.setAttribute('y', 37);
            legend2025Text.textContent = '2025';
            legend.appendChild(legend2025Text);
            
            g.appendChild(legend);
        }
        
        // Función auxiliar para renderizar el cambio entre años
        function renderYearChange(g, width, height) {
            // Obtener datos de cambio
            const changeData = MIRChartData.getPerformanceChange()
                .sort((a, b) => b.change - a.change)
                .slice(0, 12); // Limitamos a 12 para legibilidad
            
            // Escalas
            const xScale = d3.scaleBand()
                .domain(changeData.map(d => d.model))
                .range([0, width])
                .padding(0.4);
            
            // Encontrar el valor máximo absoluto para centrar la escala en 0
            const maxChange = Math.max(
                Math.abs(d3.min(changeData, d => d.change)), 
                Math.abs(d3.max(changeData, d => d.change))
            );
            
            const yScale = d3.scaleLinear()
                .domain([-maxChange - 1, maxChange + 1])
                .range([height, 0]);
            
            // Ejes
            // Eje X
            const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            xAxis.setAttribute('transform', `translate(0,${yScale(0)})`);
            xAxis.classList.add('chart-axis');
            
            // Línea central (cero)
            const zeroLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            zeroLine.setAttribute('x1', 0);
            zeroLine.setAttribute('y1', yScale(0));
            zeroLine.setAttribute('x2', width);
            zeroLine.setAttribute('y2', yScale(0));
            zeroLine.setAttribute('stroke', '#666');
            zeroLine.setAttribute('stroke-width', '1.5');
            g.appendChild(zeroLine);
            
            changeData.forEach(d => {
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', xScale(d.model) + xScale.bandwidth() / 2);
                text.setAttribute('y', yScale(0) + 20);
                text.setAttribute('text-anchor', 'end');
                text.setAttribute('transform', `rotate(-45, ${xScale(d.model) + xScale.bandwidth() / 2}, ${yScale(0) + 20})`);
                text.textContent = d.model;
                xAxis.appendChild(text);
            });
            
            g.appendChild(xAxis);
            
            // Título del eje Y
            const yTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            yTitle.setAttribute('transform', 'rotate(-90)');
            yTitle.setAttribute('x', -height/2);
            yTitle.setAttribute('y', -40);
            yTitle.setAttribute('text-anchor', 'middle');
            yTitle.classList.add('chart-axis-title');
            yTitle.textContent = 'Cambio en puntos porcentuales';
            g.appendChild(yTitle);
            
            // Líneas de cuadrícula horizontales y etiquetas para eje Y
            // Determinar incremento para las líneas de cuadrícula
            const increment = maxChange <= 5 ? 1 : maxChange <= 10 ? 2 : 5;
            
            for (let i = -Math.ceil(maxChange/increment); i <= Math.ceil(maxChange/increment); i++) {
                if (i === 0) continue; // Ya tenemos la línea de cero
                
                const value = i * increment;
                const y = yScale(value);
                
                // Línea
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', 0);
                line.setAttribute('y1', y);
                line.setAttribute('x2', width);
                line.setAttribute('y2', y);
                line.setAttribute('stroke', '#e5e5e5');
                line.setAttribute('stroke-width', '1');
                line.setAttribute('stroke-dasharray', '2,2');
                g.appendChild(line);
                
                // Etiqueta
                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('x', -10);
                label.setAttribute('y', y + 5);
                label.setAttribute('text-anchor', 'end');
                label.textContent = `${value > 0 ? '+' : ''}${value}%`;
                g.appendChild(label);
            }
            
            // Barras para cada modelo
            changeData.forEach(d => {
                const barHeight = Math.abs(yScale(d.change) - yScale(0));
                const y = d.change >= 0 ? yScale(d.change) : yScale(0);
                
                // Determinar color basado en si es mejora o deterioro
                const barColor = d.change >= 0 
                    ? colors.performance.positive 
                    : colors.performance.negative;
                
                // Barra
                const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                bar.setAttribute('x', xScale(d.model));
                bar.setAttribute('y', y);
                bar.setAttribute('width', xScale.bandwidth());
                bar.setAttribute('height', barHeight > 0 ? barHeight : 1); // Mínimo 1px para visibilidad
                bar.setAttribute('fill', barColor);
                bar.classList.add('chart-bar', d.change >= 0 ? 'bar-positive' : 'bar-negative');
                
                // Datos para tooltip
                bar.setAttribute('data-tooltip', 
                    `<div class="chart-tooltip-title">${d.model}</div>` +
                    `<div>Cambio: ${d.change > 0 ? '+' : ''}${d.change.toFixed(2)}%</div>` +
                    `<div>Tipo: ${d.type}</div>`
                );
                
                g.appendChild(bar);
                
                // Etiqueta de valor
                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('x', xScale(d.model) + xScale.bandwidth() / 2);
                label.setAttribute('y', d.change >= 0 ? y - 5 : y + barHeight + 15);
                label.setAttribute('text-anchor', 'middle');
                label.classList.add('chart-label');
                label.textContent = `${d.change > 0 ? '+' : ''}${d.change.toFixed(1)}`;
                g.appendChild(label);
            });
            
            // Leyenda
            const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            legend.setAttribute('transform', `translate(${width - 110}, 10)`);
            
            // Leyenda mejora
            const legendPosRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            legendPosRect.setAttribute('x', 0);
            legendPosRect.setAttribute('y', 0);
            legendPosRect.setAttribute('width', 15);
            legendPosRect.setAttribute('height', 15);
            legendPosRect.setAttribute('fill', colors.performance.positive);
            legend.appendChild(legendPosRect);
            
            const legendPosText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            legendPosText.setAttribute('x', 20);
            legendPosText.setAttribute('y', 12);
            legendPosText.textContent = 'Mejora';
            legend.appendChild(legendPosText);
            
            // Leyenda deterioro
            const legendNegRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            legendNegRect.setAttribute('x', 0);
            legendNegRect.setAttribute('y', 25);
            legendNegRect.setAttribute('width', 15);
            legendNegRect.setAttribute('height', 15);
            legendNegRect.setAttribute('fill', colors.performance.negative);
            legend.appendChild(legendNegRect);
            
            const legendNegText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            legendNegText.setAttribute('x', 20);
            legendNegText.setAttribute('y', 37);
            legendNegText.textContent = 'Deterioro';
            legend.appendChild(legendNegText);
            
            g.appendChild(legend);
        }
    }
    
    /**
     * Renderiza el gráfico de razonamiento vs memorización
     * @param {string} chartType - Tipo de visualización ('reasoning-2024', 'reasoning-2025' o 'reasoning-compare')
     */
    function renderReasoningChart(chartType) {
        const container = document.getElementById('reasoning-chart');
        if (!container) return;
        
        // Limpiar el contenedor antes de dibujar
        container.innerHTML = '';
        
        // Crear el elemento SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 800 400');
        svg.classList.add('chart-animated');
        container.appendChild(svg);
        
        // Configuración del gráfico
        const margin = { top: 60, right: 30, bottom: 100, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        
        // Crear grupo principal con margen
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
        svg.appendChild(g);
        
        // Añadir título
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        title.setAttribute('x', width / 2);
        title.setAttribute('y', -30);
        title.setAttribute('text-anchor', 'middle');
        title.classList.add('chart-title');
        
        if (chartType === 'reasoning-2024') {
            title.textContent = 'Razonamiento vs Memorización (2024)';
        } else if (chartType === 'reasoning-2025') {
            title.textContent = 'Razonamiento vs Memorización (2025)';
        } else {
            title.textContent = 'Rendimiento en Preguntas Modificadas vs Estándar';
        }
        
        g.appendChild(title);
        
        // Añadir subtítulo
        const subtitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        subtitle.setAttribute('x', width / 2);
        subtitle.setAttribute('y', -10);
        subtitle.setAttribute('text-anchor', 'middle');
        subtitle.classList.add('chart-subtitle');
        
        if (chartType === 'reasoning-2024' || chartType === 'reasoning-2025') {
            subtitle.textContent = 'Porcentaje de aciertos por tipo de pregunta';
        } else {
            subtitle.textContent = 'Evaluación de capacidad de generalización';
        }
        
        g.appendChild(subtitle);
        
        // Obtener datos para la visualización
        const data = MIRChartData.reasoningScores
            .sort((a, b) => b.reasoning - a.reasoning)
            .slice(0, 10); // Mostrar solo los primeros 10 para legibilidad
        
        // Escalas
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.model))
            .range([0, width])
            .padding(0.4);
        
        const yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);
        
        // Ejes
        // Eje X
        const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        xAxis.setAttribute('transform', `translate(0,${height})`);
        xAxis.classList.add('chart-axis');
        
        data.forEach(d => {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', xScale(d.model) + xScale.bandwidth() / 2);
            text.setAttribute('y', 20);
            text.setAttribute('text-anchor', 'end');
            text.setAttribute('transform', `rotate(-45, ${xScale(d.model) + xScale.bandwidth() / 2}, 20)`);
            text.textContent = d.model;
            xAxis.appendChild(text);
        });
        
        g.appendChild(xAxis);
        
        // Líneas de cuadrícula horizontales y etiquetas para eje Y
        for (let i = 0; i <= 10; i++) {
            const y = yScale(i * 10);
            
            // Línea
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', 0);
            line.setAttribute('y1', y);
            line.setAttribute('x2', width);
            line.setAttribute('y2', y);
            line.setAttribute('stroke', '#e5e5e5');
            line.setAttribute('stroke-width', '1');
            if (i > 0) line.setAttribute('stroke-dasharray', '2,2');
            g.appendChild(line);
            
            // Etiqueta
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', -10);
            label.setAttribute('y', y + 5);
            label.setAttribute('text-anchor', 'end');
            label.textContent = `${i * 10}%`;
            g.appendChild(label);
        }
        
        // Título del eje Y
        const yTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        yTitle.setAttribute('transform', 'rotate(-90)');
        yTitle.setAttribute('x', -height/2);
        yTitle.setAttribute('y', -40);
        yTitle.setAttribute('text-anchor', 'middle');
        yTitle.classList.add('chart-axis-title');
        yTitle.textContent = 'Porcentaje de Aciertos';
        g.appendChild(yTitle);
        
// Renderizar según el tipo de gráfico seleccionado
        if (chartType === 'reasoning-2024' || chartType === 'reasoning-2025') {
            // Determinar qué columnas usar según el año
            const reasoningCol = 'reasoning';
            const memoryCol = 'memory';
            
            data.forEach(d => {
                // Grupo para cada modelo
                const modelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                modelGroup.classList.add('model-group');
                g.appendChild(modelGroup);
                
                // Barra razonamiento
                const barReasoning = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                barReasoning.setAttribute('x', xScale(d.model));
                barReasoning.setAttribute('y', yScale(d[reasoningCol]));
                barReasoning.setAttribute('width', xScale.bandwidth() / 2 - 2);
                barReasoning.setAttribute('height', height - yScale(d[reasoningCol]));
                barReasoning.setAttribute('fill', colors.chartColors[0]);
                barReasoning.classList.add('chart-bar');
                
                // Datos para tooltip
                barReasoning.setAttribute('data-tooltip', 
                    `<div class="chart-tooltip-title">${d.model}</div>` +
                    `<div>Razonamiento: ${d[reasoningCol].toFixed(1)}%</div>` +
                    `<div>Tipo: ${d.type}</div>`
                );
                
                modelGroup.appendChild(barReasoning);
                
                // Barra memorización
                const barMemory = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                barMemory.setAttribute('x', xScale(d.model) + xScale.bandwidth() / 2 + 2);
                barMemory.setAttribute('y', yScale(d[memoryCol]));
                barMemory.setAttribute('width', xScale.bandwidth() / 2 - 2);
                barMemory.setAttribute('height', height - yScale(d[memoryCol]));
                barMemory.setAttribute('fill', colors.chartColors[5]);
                barMemory.classList.add('chart-bar');
                
                // Datos para tooltip
                barMemory.setAttribute('data-tooltip', 
                    `<div class="chart-tooltip-title">${d.model}</div>` +
                    `<div>Memorización: ${d[memoryCol].toFixed(1)}%</div>` +
                    `<div>Tipo: ${d.type}</div>`
                );
                
                modelGroup.appendChild(barMemory);
                
                // Etiquetas de valor si hay espacio
                if (d[reasoningCol] >= 30) {
                    const labelReasoning = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    labelReasoning.setAttribute('x', xScale(d.model) + (xScale.bandwidth() / 4));
                    labelReasoning.setAttribute('y', yScale(d[reasoningCol]) - 5);
                    labelReasoning.setAttribute('text-anchor', 'middle');
                    labelReasoning.classList.add('chart-label');
                    labelReasoning.textContent = d[reasoningCol].toFixed(0);
                    modelGroup.appendChild(labelReasoning);
                }
                
                if (d[memoryCol] >= 30) {
                    const labelMemory = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    labelMemory.setAttribute('x', xScale(d.model) + (xScale.bandwidth() * 3/4));
                    labelMemory.setAttribute('y', yScale(d[memoryCol]) - 5);
                    labelMemory.setAttribute('text-anchor', 'middle');
                    labelMemory.classList.add('chart-label');
                    labelMemory.textContent = d[memoryCol].toFixed(0);
                    modelGroup.appendChild(labelMemory);
                }
            });
            
            // Leyenda
            const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            legend.setAttribute('transform', `translate(${width - 180}, 10)`);
            
            // Leyenda razonamiento
            const legendReasoningRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            legendReasoningRect.setAttribute('x', 0);
            legendReasoningRect.setAttribute('y', 0);
            legendReasoningRect.setAttribute('width', 15);
            legendReasoningRect.setAttribute('height', 15);
            legendReasoningRect.setAttribute('fill', colors.chartColors[0]);
            legend.appendChild(legendReasoningRect);
            
            const legendReasoningText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            legendReasoningText.setAttribute('x', 20);
            legendReasoningText.setAttribute('y', 12);
            legendReasoningText.textContent = 'Preguntas de Razonamiento';
            legend.appendChild(legendReasoningText);
            
            // Leyenda memorización
            const legendMemoryRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            legendMemoryRect.setAttribute('x', 0);
            legendMemoryRect.setAttribute('y', 25);
            legendMemoryRect.setAttribute('width', 15);
            legendMemoryRect.setAttribute('height', 15);
            legendMemoryRect.setAttribute('fill', colors.chartColors[5]);
            legend.appendChild(legendMemoryRect);
            
            const legendMemoryText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            legendMemoryText.setAttribute('x', 20);
            legendMemoryText.setAttribute('y', 37);
            legendMemoryText.textContent = 'Preguntas de Memorización';
            legend.appendChild(legendMemoryText);
            
            g.appendChild(legend);
        } else if (chartType === 'reasoning-compare') {
            // Comparativa entre preguntas estándar y modificadas
            data.forEach(d => {
                // Grupo para cada modelo
                const modelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                modelGroup.classList.add('model-group');
                g.appendChild(modelGroup);
                
                // Barra estándar
                const barStandard = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                barStandard.setAttribute('x', xScale(d.model));
                barStandard.setAttribute('y', yScale(d.reasoning));
                barStandard.setAttribute('width', xScale.bandwidth() / 2 - 2);
                barStandard.setAttribute('height', height - yScale(d.reasoning));
                barStandard.setAttribute('fill', colors.chartColors[0]);
                barStandard.classList.add('chart-bar');
                
                // Datos para tooltip
                barStandard.setAttribute('data-tooltip', 
                    `<div class="chart-tooltip-title">${d.model}</div>` +
                    `<div>Preguntas estándar: ${d.reasoning.toFixed(1)}%</div>` +
                    `<div>Tipo: ${d.type}</div>`
                );
                
                modelGroup.appendChild(barStandard);
                
                // Barra modificadas
                const barModified = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                barModified.setAttribute('x', xScale(d.model) + xScale.bandwidth() / 2 + 2);
                barModified.setAttribute('y', yScale(d.modified));
                barModified.setAttribute('width', xScale.bandwidth() / 2 - 2);
                barModified.setAttribute('height', height - yScale(d.modified));
                barModified.setAttribute('fill', colors.chartColors[6]);
                barModified.classList.add('chart-bar');
                
                // Datos para tooltip
                barModified.setAttribute('data-tooltip', 
                    `<div class="chart-tooltip-title">${d.model}</div>` +
                    `<div>Preguntas modificadas: ${d.modified.toFixed(1)}%</div>` +
                    `<div>Tipo: ${d.type}</div>`
                );
                
                modelGroup.appendChild(barModified);
                
                // Etiquetas de valor si hay espacio
                if (d.reasoning >= 30) {
                    const labelStandard = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    labelStandard.setAttribute('x', xScale(d.model) + (xScale.bandwidth() / 4));
                    labelStandard.setAttribute('y', yScale(d.reasoning) - 5);
                    labelStandard.setAttribute('text-anchor', 'middle');
                    labelStandard.classList.add('chart-label');
                    labelStandard.textContent = d.reasoning.toFixed(0);
                    modelGroup.appendChild(labelStandard);
                }
                
                if (d.modified >= 30) {
                    const labelModified = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    labelModified.setAttribute('x', xScale(d.model) + (xScale.bandwidth() * 3/4));
                    labelModified.setAttribute('y', yScale(d.modified) - 5);
                    labelModified.setAttribute('text-anchor', 'middle');
                    labelModified.classList.add('chart-label');
                    labelModified.textContent = d.modified.toFixed(0);
                    modelGroup.appendChild(labelModified);
                }
            });
            
            // Leyenda
            const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            legend.setAttribute('transform', `translate(${width - 180}, 10)`);
            
            // Leyenda estándar
            const legendStandardRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            legendStandardRect.setAttribute('x', 0);
            legendStandardRect.setAttribute('y', 0);
            legendStandardRect.setAttribute('width', 15);
            legendStandardRect.setAttribute('height', 15);
            legendStandardRect.setAttribute('fill', colors.chartColors[0]);
            legend.appendChild(legendStandardRect);
            
            const legendStandardText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            legendStandardText.setAttribute('x', 20);
            legendStandardText.setAttribute('y', 12);
            legendStandardText.textContent = 'Preguntas Estándar';
            legend.appendChild(legendStandardText);
            
            // Leyenda modificadas
            const legendModifiedRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            legendModifiedRect.setAttribute('x', 0);
            legendModifiedRect.setAttribute('y', 25);
            legendModifiedRect.setAttribute('width', 15);
            legendModifiedRect.setAttribute('height', 15);
            legendModifiedRect.setAttribute('fill', colors.chartColors[6]);
            legend.appendChild(legendModifiedRect);
            
            const legendModifiedText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            legendModifiedText.setAttribute('x', 20);
            legendModifiedText.setAttribute('y', 37);
            legendModifiedText.textContent = 'Preguntas Modificadas';
            legend.appendChild(legendModifiedText);
            
            g.appendChild(legend);
        }
    }
    
    /**
     * Renderiza el gráfico de rendimiento en preguntas con imágenes
     * @param {string} chartType - Tipo de visualización ('images-overall', 'images-compare', 'images-vs-text')
     */
    function renderImageQuestionsChart(chartType) {
        const container = document.getElementById('image-questions-chart');
        if (!container) return;
        
        // Limpiar el contenedor antes de dibujar
        container.innerHTML = '';
        
        // Crear el elemento SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 800 400');
        svg.classList.add('chart-animated');
        container.appendChild(svg);
        
        // Configuración del gráfico
        const margin = { top: 60, right: 30, bottom: 100, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        
        // Crear grupo principal con margen
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
        svg.appendChild(g);
        
        // Añadir título
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        title.setAttribute('x', width / 2);
        title.setAttribute('y', -30);
        title.setAttribute('text-anchor', 'middle');
        title.classList.add('chart-title');
        
        if (chartType === 'images-overall') {
            title.textContent = 'Rendimiento en Preguntas con Imágenes (2025)';
        } else if (chartType === 'images-compare') {
            title.textContent = 'Comparativa de Rendimiento en Preguntas con Imágenes (2024-2025)';
        } else {
            title.textContent = 'Rendimiento en Preguntas con Imágenes vs. Texto (2025)';
        }
        
        g.appendChild(title);
        
        // Añadir subtítulo
        const subtitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        subtitle.setAttribute('x', width / 2);
        subtitle.setAttribute('y', -10);
        subtitle.setAttribute('text-anchor', 'middle');
        subtitle.classList.add('chart-subtitle');
        subtitle.textContent = chartType === 'images-vs-text' 
            ? 'Comparación del rendimiento según el tipo de pregunta' 
            : 'Porcentaje de preguntas contestadas correctamente';
        g.appendChild(subtitle);
        
        // Obtener y preparar datos
        let data;
        
        if (chartType === 'images-overall') {
            // Ordenar por rendimiento 2025
            data = MIRChartData.imageQuestions
                .sort((a, b) => b.score2025 - a.score2025)
                .slice(0, 10); // Limitar a 10 para legibilidad
        } else if (chartType === 'images-compare') {
            // Igual que el anterior pero necesitamos ambos años
            data = MIRChartData.imageQuestions
                .sort((a, b) => b.score2025 - a.score2025)
                .slice(0, 8); // Limitar a 8 para el gráfico de comparación
        } else if (chartType === 'images-vs-text') {
            // Necesitamos simular datos de texto vs imágenes
            // En un caso real, estos datos estarían disponibles en el dataset
            data = MIRChartData.imageQuestions
                .slice(0, 8)
                .map(d => ({
                    model: d.model,
                    type: d.type,
                    imageScore: d.score2025,
                    // Simular puntuación de texto (normalmente esto vendría del dataset real)
                    textScore: d.type === 'Multimodal' 
                        ? d.score2025 - (5 + Math.random() * 5) // Modelos multimodales peor en texto que imágenes
                        : d.score2025 + (3 + Math.random() * 5)  // Otros modelos mejor en texto
                }))
                .sort((a, b) => b.imageScore - a.imageScore);
        }
        
        // Crear escalas
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.model))
            .range([0, width])
            .padding(0.4);
        
        const yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);
        
        // Ejes
        // Eje X
        const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        xAxis.setAttribute('transform', `translate(0,${height})`);
        xAxis.classList.add('chart-axis');
        
        data.forEach(d => {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', xScale(d.model) + xScale.bandwidth() / 2);
            text.setAttribute('y', 20);
            text.setAttribute('text-anchor', 'end');
            text.setAttribute('transform', `rotate(-45, ${xScale(d.model) + xScale.bandwidth() / 2}, 20)`);
            text.textContent = d.model;
            xAxis.appendChild(text);
        });
        
        g.appendChild(xAxis);
        
        // Líneas de cuadrícula horizontales y etiquetas para eje Y
        for (let i = 0; i <= 10; i++) {
            const y = yScale(i * 10);
            
            // Línea
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', 0);
            line.setAttribute('y1', y);
            line.setAttribute('x2', width);
            line.setAttribute('y2', y);
            line.setAttribute('stroke', '#e5e5e5');
            line.setAttribute('stroke-width', '1');
            if (i > 0) line.setAttribute('stroke-dasharray', '2,2');
            g.appendChild(line);
            
            // Etiqueta
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', -10);
            label.setAttribute('y', y + 5);
            label.setAttribute('text-anchor', 'end');
            label.textContent = `${i * 10}%`;
            g.appendChild(label);
        }
        
        // Título del eje Y
        const yTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        yTitle.setAttribute('transform', 'rotate(-90)');
        yTitle.setAttribute('x', -height/2);
        yTitle.setAttribute('y', -40);
        yTitle.setAttribute('text-anchor', 'middle');
        yTitle.classList.add('chart-axis-title');
        yTitle.textContent = 'Porcentaje de Aciertos';
        g.appendChild(yTitle);
        
        // Renderizar según el tipo de gráfico seleccionado
        if (chartType === 'images-overall') {
            // Barras para cada modelo
            data.forEach(d => {
                // Determinar color según tipo de modelo
                let barColor;
                switch(d.type) {
                    case 'Multimodal':
                        barColor = colors.modelTypes['Multimodal'];
                        break;
                    case 'Especializado':
                        barColor = colors.modelTypes['Especializado'];
                        break;
                    case 'General':
                        barColor = colors.modelTypes['General'];
                        break;
                    case 'Humano':
                        barColor = colors.modelTypes['Humano'];
                        break;
                    default:
                        barColor = colors.chartColors[0];
                }
                
                // Barra 2025
                const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                bar.setAttribute('x', xScale(d.model));
                bar.setAttribute('y', yScale(d.score2025));
                bar.setAttribute('width', xScale.bandwidth());
                bar.setAttribute('height', height - yScale(d.score2025));
                bar.setAttribute('fill', barColor);
                bar.classList.add('chart-bar');
                
                // Datos para tooltip
                bar.setAttribute('data-tooltip', 
                    `<div class="chart-tooltip-title">${d.model}</div>` +
                    `<div>2025: ${d.score2025.toFixed(1)}%</div>` +
                    `<div>Tipo: ${d.type}</div>`
                );
                
                g.appendChild(bar);
                
                // Etiqueta de valor
                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('x', xScale(d.model) + xScale.bandwidth() / 2);
                label.setAttribute('y', yScale(d.score2025) - 5);
                label.setAttribute('text-anchor', 'middle');
                label.classList.add('chart-label');
                label.textContent = d.score2025.toFixed(0);
                g.appendChild(label);
            });
            
            // Leyenda
            const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            legend.setAttribute('transform', `translate(${width - 120}, 10)`);
            
            const types = ['Multimodal', 'Especializado', 'General', 'Humano'];
            
            types.forEach((type, i) => {
                const legendRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                legendRect.setAttribute('x', 0);
                legendRect.setAttribute('y', i * 25);
                legendRect.setAttribute('width', 15);
                legendRect.setAttribute('height', 15);
                legendRect.setAttribute('fill', colors.modelTypes[type]);
                legend.appendChild(legendRect);
                
                const legendText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                legendText.setAttribute('x', 20);
                legendText.setAttribute('y', i * 25 + 12);
                legendText.textContent = type;
                legend.appendChild(legendText);
            });
            
            g.appendChild(legend);
        } else if (chartType === 'images-compare') {
            // Barras para cada año
            data.forEach(d => {
                // Grupo para cada modelo
                const modelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                modelGroup.classList.add('model-group');
                g.appendChild(modelGroup);
                
                // Barra 2024
                const bar2024 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                bar2024.setAttribute('x', xScale(d.model));
                bar2024.setAttribute('y', yScale(d.score2024));
                bar2024.setAttribute('width', xScale.bandwidth() / 2 - 2);
                bar2024.setAttribute('height', height - yScale(d.score2024));
                bar2024.setAttribute('fill', colors.years['2024']);
                bar2024.classList.add('chart-bar');
                
                // Datos para tooltip
                bar2024.setAttribute('data-tooltip', 
                    `<div class="chart-tooltip-title">${d.model}</div>` +
                    `<div>2024: ${d.score2024.toFixed(1)}%</div>` +
                    `<div>Tipo: ${d.type}</div>`
                );
                
                modelGroup.appendChild(bar2024);
                
                // Barra 2025
                const bar2025 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                bar2025.setAttribute('x', xScale(d.model) + xScale.bandwidth() / 2 + 2);
                bar2025.setAttribute('y', yScale(d.score2025));
                bar2025.setAttribute('width', xScale.bandwidth() / 2 - 2);
                bar2025.setAttribute('height', height - yScale(d.score2025));
                bar2025.setAttribute('fill', colors.years['2025']);
                bar2025.classList.add('chart-bar');
                
                // Datos para tooltip
                bar2025.setAttribute('data-tooltip', 
                    `<div class="chart-tooltip-title">${d.model}</div>` +
                    `<div>2025: ${d.score2025.toFixed(1)}%</div>` +
                    `<div>Tipo: ${d.type}</div>`
                );
                
                modelGroup.appendChild(bar2025);
                
                // Etiquetas de valor si hay espacio
                if (d.score2024 >= 30) {
                    const label2024 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    label2024.setAttribute('x', xScale(d.model) + (xScale.bandwidth() / 4));
                    label2024.setAttribute('y', yScale(d.score2024) - 5);
                    label2024.setAttribute('text-anchor', 'middle');
                    label2024.classList.add('chart-label');
                    label2024.textContent = d.score2024.toFixed(0);
                    modelGroup.appendChild(label2024);
                }
                
                if (d.score2025 >= 30) {
                    const label2025 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    label2025.setAttribute('x', xScale(d.model) + (xScale.bandwidth() * 3/4));
                    label2025.setAttribute('y', yScale(d.score2025) - 5);
                    label2025.setAttribute('text-anchor', 'middle');
                    label2025.classList.add('chart-label');
                    label2025.textContent = d.score2025.toFixed(0);
                    modelGroup.appendChild(label2025);
                }
            });
            
            // Leyenda
            const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            legend.setAttribute('transform', `translate(${width - 110}, 10)`);
            
            // Leyenda 2024
            const legend2024Rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            legend2024Rect.setAttribute('x', 0);
            legend2024Rect.setAttribute('y', 0);
            legend2024Rect.setAttribute('width', 15);
            legend2024Rect.setAttribute('height', 15);
            legend2024Rect.setAttribute('fill', colors.years['2024']);
            legend.appendChild(legend2024Rect);
            
            const legend2024Text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            legend2024Text.setAttribute('x', 20);
            legend2024Text.setAttribute('y', 12);
            legend2024Text.textContent = '2024';
            legend.appendChild(legend2024Text);
            
            // Leyenda 2025
            const legend2025Rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            legend2025Rect.setAttribute('x', 0);
            legend2025Rect.setAttribute('y', 25);
            legend2025Rect.setAttribute('width', 15);
            legend2025Rect.setAttribute('height', 15);
            legend2025Rect.setAttribute('fill', colors.years['2025']);
            legend.appendChild(legend2025Rect);
            
            const legend2025Text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            legend2025Text.setAttribute('x', 20);
            legend2025Text.setAttribute('y', 37);
            legend2025Text.textContent = '2025';
            legend.appendChild(legend2025Text);
            
            g.appendChild(legend);
        } else if (chartType === 'images-vs-text') {
            // Barras para cada tipo
            data.forEach(d => {
                // Grupo para cada modelo
                const modelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                modelGroup.classList.add('model-group');
                g.appendChild(modelGroup);
                
                // Barra preguntas de texto
                const barText = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                barText.setAttribute('x', xScale(d.model));
                barText.setAttribute('y', yScale(d.textScore));
                barText.setAttribute('width', xScale.bandwidth() / 2 - 2);
                barText.setAttribute('height', height - yScale(d.textScore));
                barText.setAttribute('fill', colors.chartColors[0]); // Azul para texto
                barText.classList.add('chart-bar');
                
                // Datos para tooltip
                barText.setAttribute('data-tooltip', 
                    `<div class="chart-tooltip-title">${d.model}</div>` +
                    `<div>Preguntas de texto: ${d.textScore.toFixed(1)}%</div>` +
                    `<div>Tipo: ${d.type}</div>`
                );
                
                modelGroup.appendChild(barText);
                
                // Barra preguntas de imagen
                const barImage = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                barImage.setAttribute('x', xScale(d.model) + xScale.bandwidth() / 2 + 2);
                barImage.setAttribute('y', yScale(d.imageScore));
                barImage.setAttribute('width', xScale.bandwidth() / 2 - 2);
                barImage.setAttribute('height', height - yScale(d.imageScore));
                barImage.setAttribute('fill', colors.chartColors[1]); // Naranja para imágenes
                barImage.classList.add('chart-bar');
                
                // Datos para tooltip
                barImage.setAttribute('data-tooltip', 
                    `<div class="chart-tooltip-title">${d.model}</div>` +
                    `<div>Preguntas con imágenes: ${d.imageScore.toFixed(1)}%</div>` +
                    `<div>Tipo: ${d.type}</div>`
                );
                
                modelGroup.appendChild(barImage);
                
                // Etiquetas de valor si hay espacio
                if (d.textScore >= 30) {
                    const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    labelText.setAttribute('x', xScale(d.model) + (xScale.bandwidth() / 4));
                    labelText.setAttribute('y', yScale(d.textScore) - 5);
                    labelText.setAttribute('text-anchor', 'middle');
                    labelText.classList.add('chart-label');
                    labelText.textContent = d.textScore.toFixed(0);
                    modelGroup.appendChild(labelText);
                }
                
                if (d.imageScore >= 30) {
                    const labelImage = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    labelImage.setAttribute('x', xScale(d.model) + (xScale.bandwidth() * 3/4));
                    labelImage.setAttribute('y', yScale(d.imageScore) - 5);
                    labelImage.setAttribute('text-anchor', 'middle');
                    labelImage.classList.add('chart-label');
                    labelImage.textContent = d.imageScore.toFixed(0);
                    modelGroup.appendChild(labelImage);
                }
            });
            
            // Leyenda
            const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            legend.setAttribute('transform', `translate(${width - 180}, 10)`);
            
            // Leyenda texto
            const legendTextRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            legendTextRect.setAttribute('x', 0);
            legendTextRect.setAttribute('y', 0);
            legendTextRect.setAttribute('width', 15);
            legendTextRect.setAttribute('height', 15);
            legendTextRect.setAttribute('fill', colors.chartColors[0]);
            legend.appendChild(legendTextRect);
            
            const legendTextLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            legendTextLabel.setAttribute('x', 20);
            legendTextLabel.setAttribute('y', 12);
            legendTextLabel.textContent = 'Preguntas de texto';
            legend.appendChild(legendTextLabel);
            
            // Leyenda imágenes
            const legendImgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            legendImgRect.setAttribute('x', 0);
            legendImgRect.setAttribute('y', 25);
            legendImgRect.setAttribute('width', 15);
            legendImgRect.setAttribute('height', 15);
            legendImgRect.setAttribute('fill', colors.chartColors[1]);
            legend.appendChild(legendImgRect);
            
            const legendImgLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            legendImgLabel.setAttribute('x', 20);
            legendImgLabel.setAttribute('y', 37);
            legendImgLabel.textContent = 'Preguntas con imágenes';
            legend.appendChild(legendImgLabel);
            
            g.appendChild(legend);
        }
    }
    
    /**
     * Renderiza el gráfico de rendimiento por modelo
     * @param {string} chartType - Tipo de visualización ('models-2024', 'models-2025', 'models-compare')
     */
    function renderModelPerformanceChart(chartType) {
        const container = document.getElementById('model-performance-chart');
        if (!container) return;
        
        // Limpiar el contenedor antes de dibujar
        container.innerHTML = '';
        
        // Crear el elemento SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 800 400');
        svg.classList.add('chart-animated');
        container.appendChild(svg);
        
        // Configuración del gráfico
        const margin = { top: 60, right: 30, bottom: 100, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        
        // Crear grupo principal con margen
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
        svg.appendChild(g);
        
        // Añadir título
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        title.setAttribute('x', width / 2);
        title.setAttribute('y', -30);
        title.setAttribute('text-anchor', 'middle');
        title.classList.add('chart-title');
        
        if (chartType === 'models-2024') {
            title.textContent = 'Rendimiento por Modelo (2024)';
        } else if (chartType === 'models-2025') {
            title.textContent = 'Rendimiento por Modelo (2025)';
        } else {
            title.textContent = 'Rendimiento por Categoría de Modelo';
        }
        
        g.appendChild(title);
        
        // Añadir subtítulo
        const subtitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        subtitle.setAttribute('x', width / 2);
        subtitle.setAttribute('y', -10);
        subtitle.setAttribute('text-anchor', 'middle');
        subtitle.classList.add('chart-subtitle');
        
        if (chartType === 'models-compare') {
            subtitle.textContent = 'Comparación de rendimiento promedio por tipo de modelo';
        } else {
            subtitle.textContent = chartType === 'models-2024' ? 
                'Porcentaje de aciertos por modelo en 2024' : 
                'Porcentaje de aciertos por modelo en 2025';
        }
        
        g.appendChild(subtitle);
        
        if (chartType === 'models-2024' || chartType === 'models-2025') {
            // Determinar qué propiedad de datos usar
            const yearProp = chartType === 'models-2024' ? 'score2024' : 'score2025';
            
            // Obtener modelos ordenados por rendimiento para el año seleccionado
            const data = MIRChartData.getModelsByPerformance(chartType === 'models-2024' ? 2024 : 2025)
                .slice(0, 10); // Limitar a 10 para legibilidad
            
            // Escalas
            const xScale = d3.scaleBand()
                .domain(data.map(d => d.model))
                .range([0, width])
                .padding(0.4);
            
            const yScale = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0]);
            
            // Ejes
            // Eje X
            const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            xAxis.setAttribute('transform', `translate(0,${height})`);
            xAxis.classList.add('chart-axis');
            
            data.forEach(d => {
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', xScale(d.model) + xScale.bandwidth() / 2);
                text.setAttribute('y', 20);
                text.setAttribute('text-anchor', 'end');
                text.setAttribute('transform', `rotate(-45, ${xScale(d.model) + xScale.bandwidth() / 2}, 20)`);
                text.textContent = d.model;
                xAxis.appendChild(text);
            });
            
            g.appendChild(xAxis);
            
            // Líneas de cuadrícula horizontales y etiquetas para eje Y
            for (let i = 0; i <= 10; i++) {
                const y = yScale(i * 10);
                
                // Línea
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', 0);
                line.setAttribute('y1', y);
                line.setAttribute('x2', width);
                line.setAttribute('y2', y);
                line.setAttribute('stroke', '#e5e5e5');
                line.setAttribute('stroke-width', '1');
                if (i > 0) line.setAttribute('stroke-dasharray', '2,2');
                g.appendChild(line);
                
                // Etiqueta
                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('x', -10);
                label.setAttribute('y', y + 5);
                label.setAttribute('text-anchor', 'end');
                label.textContent = `${i * 10}%`;
                g.appendChild(label);
            }
            
            // Título del eje Y
            const yTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            yTitle.setAttribute('transform', 'rotate(-90)');
            yTitle.setAttribute('x', -height/2);
            yTitle.setAttribute('y', -40);
            yTitle.setAttribute('text-anchor', 'middle');
            yTitle.classList.add('chart-axis-title');
            yTitle.textContent = 'Porcentaje de Aciertos';
            g.appendChild(yTitle);
            
            // Barras coloreadas por tipo
            data.forEach(d => {
                // Determinar color según tipo de modelo
                let barColor = colors.modelTypes[d.type] || colors.chartColors[0];
                
                // Crear barra
                const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                bar.setAttribute('x', xScale(d.model));
                bar.setAttribute('y', yScale(d[yearProp]));
                bar.setAttribute('width', xScale.bandwidth());
                bar.setAttribute('height', height - yScale(d[yearProp]));
                bar.setAttribute('fill', barColor);
                bar.classList.add('chart-bar');
                
                // Datos para tooltip
                bar.setAttribute('data-tooltip', 
                    `<div class="chart-tooltip-title">${d.model}</div>` +
                    `<div>Precisión: ${d[yearProp].toFixed(1)}%</div>` +
                    `<div>Tipo: ${d.type}</div>`
                );
                
                g.appendChild(bar);
                
                // Etiqueta de valor
                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('x', xScale(d.model) + xScale.bandwidth() / 2);
                label.setAttribute('y', yScale(d[yearProp]) - 5);
                label.setAttribute('text-anchor', 'middle');
                label.classList.add('chart-label');
                label.textContent = d[yearProp].toFixed(0);
                g.appendChild(label);
            });
            
            // Leyenda
            const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            legend.setAttribute('transform', `translate(${width - 120}, 10)`);
            
            const types = ['Especializado', 'Razonamiento', 'Multimodal', 'General', 'Humano'];
            const uniqueTypes = [...new Set(data.map(d => d.type))]; // Solo mostrar tipos presentes
            
            uniqueTypes.forEach((type, i) => {
                if (!colors.modelTypes[type]) return; // Saltar si no hay color definido
                
                const legendRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                legendRect.setAttribute('x', 0);
                legendRect.setAttribute('y', i * 25);
                legendRect.setAttribute('width', 15);
                legendRect.setAttribute('height', 15);
                legendRect.setAttribute('fill', colors.modelTypes[type]);
                legend.appendChild(legendRect);
                
                const legendText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                legendText.setAttribute('x', 20);
                legendText.setAttribute('y', i * 25 + 12);
                legendText.textContent = type;
                legend.appendChild(legendText);
            });
            
            g.appendChild(legend);
        } else if (chartType === 'models-compare') {
            // Datos por tipo de modelo
            const data = MIRChartData.performanceChangeByType;
            
            // Escalas
            const xScale = d3.scaleBand()
                .domain(data.map(d => d.type))
                .range([0, width])
                .padding(0.4);
            
            const yScale = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0]);
            
            // Ejes
            // Eje X
            const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            xAxis.setAttribute('transform', `translate(0,${height})`);
            xAxis.classList.add('chart-axis');
            
            data.forEach(d => {
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', xScale(d.type) + xScale.bandwidth() / 2);
                text.setAttribute('y', 20);
                text.setAttribute('text-anchor', 'middle');
                text.textContent = d.type;
                xAxis.appendChild(text);
            });
            
            g.appendChild(xAxis);
            
            // Líneas de cuadrícula horizontales y etiquetas para eje Y
            for (let i = 0; i <= 10; i++) {
                const y = yScale(i * 10);
                
                // Línea
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', 0);
                line.setAttribute('y1', y);
                line.setAttribute('x2', width);
                line.setAttribute('y2', y);
                line.setAttribute('stroke', '#e5e5e5');
                line.setAttribute('stroke-width', '1');
                if (i > 0) line.setAttribute('stroke-dasharray', '2,2');
                g.appendChild(line);
                
                // Etiqueta
                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('x', -10);
                label.setAttribute('y', y + 5);
                label.setAttribute('text-anchor', 'end');
                label.textContent = `${i * 10}%`;
                g.appendChild(label);
            }
            
            // Título del eje Y
            const yTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            yTitle.setAttribute('transform', 'rotate(-90)');
            yTitle.setAttribute('x', -height/2);
            yTitle.setAttribute('y', -40);
            yTitle.setAttribute('text-anchor', 'middle');
            yTitle.classList.add('chart-axis-title');
            yTitle.textContent = 'Porcentaje de Aciertos';
            g.appendChild(yTitle);
            
            // Barras para cada tipo y año
            data.forEach(d => {
                // Determinar color según tipo de modelo
                let barColor = colors.modelTypes[d.type] || colors.chartColors[0];
                
                // Grupo para cada tipo
                const typeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                typeGroup.classList.add('type-group');
                g.appendChild(typeGroup);
                
                // Barra 2024
                const bar2024 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                bar2024.setAttribute('x', xScale(d.type));
                bar2024.setAttribute('y', yScale(d.avg2024));
                bar2024.setAttribute('width', xScale.bandwidth() / 2 - 2);
                bar2024.setAttribute('height', height - yScale(d.avg2024));
                bar2024.setAttribute('fill', barColor);
                bar2024.setAttribute('opacity', '0.7'); // Más transparente para 2024
                bar2024.classList.add('chart-bar');
                
                // Datos para tooltip
                bar2024.setAttribute('data-tooltip', 
                    `<div class="chart-tooltip-title">${d.type}</div>` +
                    `<div>2024: ${d.avg2024.toFixed(1)}%</div>`
                );
                
                typeGroup.appendChild(bar2024);
                
                // Barra 2025
                const bar2025 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                bar2025.setAttribute('x', xScale(d.type) + xScale.bandwidth() / 2 + 2);
                bar2025.setAttribute('y', yScale(d.avg2025));
                bar2025.setAttribute('width', xScale.bandwidth() / 2 - 2);
                bar2025.setAttribute('height', height - yScale(d.avg2025));
                bar2025.setAttribute('fill', barColor);
                bar2025.classList.add('chart-bar');
                
                // Datos para tooltip
                bar2025.setAttribute('data-tooltip', 
                    `<div class="chart-tooltip-title">${d.type}</div>` +
                    `<div>2025: ${d.avg2025.toFixed(1)}%</div>` +
                    `<div>Cambio: ${d.change > 0 ? '+' : ''}${d.change.toFixed(2)}%</div>`
                );
                
                typeGroup.appendChild(bar2025);
                
                // Etiquetas de valor para 2024
                const label2024 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label2024.setAttribute('x', xScale(d.type) + (xScale.bandwidth() / 4));
                label2024.setAttribute('y', yScale(d.avg2024) - 5);
                label2024.setAttribute('text-anchor', 'middle');
                label2024.classList.add('chart-label');
                label2024.textContent = d.avg2024.toFixed(1);
                typeGroup.appendChild(label2024);
                
                // Etiquetas de valor para 2025
                const label2025 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label2025.setAttribute('x', xScale(d.type) + (xScale.bandwidth() * 3/4));
                label2025.setAttribute('y', yScale(d.avg2025) - 5);
                label2025.setAttribute('text-anchor', 'middle');
                label2025.classList.add('chart-label');
                label2025.textContent = d.avg2025.toFixed(1);
                typeGroup.appendChild(label2025);
            });
            
            // Leyenda para los años
            const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            legend.setAttribute('transform', `translate(${width - 110}, 10)`);
            
            const legend2024 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            legend2024.setAttribute('x', 0);
            legend2024.setAttribute('y', 0);
            legend2024.setAttribute('width', 15);
            legend2024.setAttribute('height', 15);
            legend2024.setAttribute('opacity', '0.7');
            legend2024.setAttribute('fill', colors.chartColors[0]);
            legend.appendChild(legend2024);
            
            const legendText2024 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            legendText2024.setAttribute('x', 20);
            legendText2024.setAttribute('y', 12);
            legendText2024.textContent = '2024';
            legend.appendChild(legendText2024);
            
            const legend2025 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            legend2025.setAttribute('x', 0);
            legend2025.setAttribute('y', 25);
            legend2025.setAttribute('width', 15);
            legend2025.setAttribute('height', 15);
            legend2025.setAttribute('fill', colors.chartColors[0]);
            legend.appendChild(legend2025);
            
            const legendText2025 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            legendText2025.setAttribute('x', 20);
            legendText2025.setAttribute('y', 37);
            legendText2025.textContent = '2025';
            legend.appendChild(legendText2025);
            
            g.appendChild(legend);
        }
    }
    
    /**
     * Renderiza el gráfico de comparación humanos vs IA
     * @param {string} chartType - Tipo de visualización ('human-vs-ai-overall', 'human-vs-ai-by-category')
     */
    function renderHumanVsAIChart(chartType) {
        const container = document.getElementById('human-vs-ai-chart');
        if (!container) return;
        
        // Limpiar el contenedor antes de dibujar
        container.innerHTML = '';
        
        // Crear el elemento SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 800 400');
        svg.classList.add('chart-animated');
        container.appendChild(svg);
        
        // Configuración del gráfico
        const margin = { top: 60, right: 30, bottom: 60, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        
        // Crear grupo principal con margen
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
        svg.appendChild(g);
        
        // Añadir título
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        title.setAttribute('x', width / 2);
        title.setAttribute('y', -30);
        title.setAttribute('text-anchor', 'middle');
        title.classList.add('chart-title');
        
        if (chartType === 'human-vs-ai-overall') {
            title.textContent = 'Comparación General: Humanos vs IA';
        } else {
            title.textContent = 'Comparación por Categoría: Humanos vs IA';
        }
        
        g.appendChild(title);
        
        // Añadir subtítulo
        const subtitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        subtitle.setAttribute('x', width / 2);
        subtitle.setAttribute('y', -10);
        subtitle.setAttribute('text-anchor', 'middle');
        subtitle.classList.add('chart-subtitle');
        subtitle.textContent = 'Porcentaje de aciertos en el examen MIR 2025';
        g.appendChild(subtitle);
        
        if (chartType === 'human-vs-ai-overall') {
            // Datos para comparación general
            const data = [
                { label: 'Humanos', value: 78.57 },
                { label: 'IA (Mejor modelo)', value: 95.59 }
            ];
            
            // Escala X 
            const xScale = d3.scaleBand()
                .domain(data.map(d => d.label))
                .range([0, width])
                .padding(0.4);
            
            // Escala Y (puntuación)
            const yScale = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0]);
            
            // Ejes
            // Eje X
            const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            xAxis.setAttribute('transform', `translate(0,${height})`);
            xAxis.classList.add('chart-axis');
            
            data.forEach(d => {
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', xScale(d.label) + xScale.bandwidth() / 2);
                text.setAttribute('y', 20);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('font-weight', 'bold');
                text.textContent = d.label;
                xAxis.appendChild(text);
            });
            
            g.appendChild(xAxis);
            
            // Líneas de cuadrícula horizontales y etiquetas para eje Y
            for (let i = 0; i <= 10; i++) {
                const y = yScale(i * 10);
                
                // Línea
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', 0);
                line.setAttribute('y1', y);
                line.setAttribute('x2', width);
                line.setAttribute('y2', y);
                line.setAttribute('stroke', '#e5e5e5');
                line.setAttribute('stroke-width', '1');
                if (i > 0) line.setAttribute('stroke-dasharray', '2,2');
                g.appendChild(line);
                
                // Etiqueta
                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('x', -10);
                label.setAttribute('y', y + 5);
                label.setAttribute('text-anchor', 'end');
                label.textContent = `${i * 10}%`;
                g.appendChild(label);
            }
            
            // Título del eje Y
            const yTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            yTitle.setAttribute('transform', 'rotate(-90)');
            yTitle.setAttribute('x', -height/2);
            yTitle.setAttribute('y', -40);
            yTitle.setAttribute('text-anchor', 'middle');
            yTitle.classList.add('chart-axis-title');
            yTitle.textContent = 'Porcentaje de Aciertos (2025)';
            g.appendChild(yTitle);
            
            // Crear barras para comparación general
            data.forEach((d, i) => {
                // Determinar color
                const barColor = d.label === 'Humanos' ? colors.modelTypes['Humano'] : colors.modelTypes['Especializado'];
                
                // Crear barra
                const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                bar.setAttribute('x', xScale(d.label));
                bar.setAttribute('y', yScale(d.value));
                bar.setAttribute('width', xScale.bandwidth());
                bar.setAttribute('height', height - yScale(d.value));
                bar.setAttribute('fill', barColor);
                bar.classList.add('chart-bar');
                
                // Datos para tooltip
                bar.setAttribute('data-tooltip', 
                    `<div class="chart-tooltip-title">${d.label}</div>` +
                    `<div>Precisión: ${d.value.toFixed(1)}%</div>`
                );
                
                g.appendChild(bar);
                
                // Etiqueta de valor
                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('x', xScale(d.label) + xScale.bandwidth() / 2);
                label.setAttribute('y', yScale(d.value) - 10);
                label.setAttribute('text-anchor', 'middle');
                label.setAttribute('font-weight', 'bold');
                label.setAttribute('font-size', '18');
                label.textContent = `${d.value.toFixed(1)}%`;
                g.appendChild(label);
            });
        } else if (chartType === 'human-vs-ai-by-category') {
            // Datos por categoría
            const data = MIRChartData.humanVsAI;
            
            // Escalas
            const xScale = d3.scaleBand()
                .domain(data.map(d => d.category))
                .range([0, width])
                .padding(0.4);
            
            const yScale = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0]);
            
            // Ejes
            // Eje X
            const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            xAxis.setAttribute('transform', `translate(0,${height})`);
            xAxis.classList.add('chart-axis');
            
            data.forEach(d => {
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', xScale(d.category) + xScale.bandwidth() / 2);
                text.setAttribute('y', 20);
                text.setAttribute('text-anchor', 'end');
                text.setAttribute('transform', `rotate(-45, ${xScale(d.category) + xScale.bandwidth() / 2}, 20)`);
                text.textContent = d.category;
                xAxis.appendChild(text);
            });
            
            g.appendChild(xAxis);
            
            // Líneas de cuadrícula horizontales y etiquetas para eje Y
            for (let i = 0; i <= 10; i++) {
                const y = yScale(i * 10);
                
                // Línea
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', 0);
                line.setAttribute('y1', y);
                line.setAttribute('x2', width);
                line.setAttribute('y2', y);
                line.setAttribute('stroke', '#e5e5e5');
                line.setAttribute('stroke-width', '1');
                if (i > 0) line.setAttribute('stroke-dasharray', '2,2');
                g.appendChild(line);
                
                // Etiqueta
                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('x', -10);
                label.setAttribute('y', y + 5);
                label.setAttribute('text-anchor', 'end');
                label.textContent = `${i * 10}%`;
                g.appendChild(label);
            }
            
            // Título del eje Y
            const yTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            yTitle.setAttribute('transform', 'rotate(-90)');
            yTitle.setAttribute('x', -height/2);
            yTitle.setAttribute('y', -40);
            yTitle.setAttribute('text-anchor', 'middle');
            yTitle.classList.add('chart-axis-title');
            yTitle.textContent = 'Porcentaje de Aciertos';
            g.appendChild(yTitle);
            
            // Barras para cada categoría
            data.forEach(d => {
                // Grupo para cada categoría
                const categoryGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                categoryGroup.classList.add('category-group');
                g.appendChild(categoryGroup);
                
                // Barra humanos
                const barHuman = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                barHuman.setAttribute('x', xScale(d.category));
                barHuman.setAttribute('y', yScale(d.human));
                barHuman.setAttribute('width', xScale.bandwidth() / 2 - 2);
                barHuman.setAttribute('height', height - yScale(d.human));
                barHuman.setAttribute('fill', colors.modelTypes['Humano']);
                barHuman.classList.add('chart-bar', 'human-bar');
                
                // Datos para tooltip
                barHuman.setAttribute('data-tooltip', 
                    `<div class="chart-tooltip-title">${d.category}</div>` +
                    `<div>Humanos: ${d.human.toFixed(1)}%</div>`
                );
                
                categoryGroup.appendChild(barHuman);
                
                // Barra IA
                const barAI = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                barAI.setAttribute('x', xScale(d.category) + xScale.bandwidth() / 2 + 2);
                barAI.setAttribute('y', yScale(d.ai));
                barAI.setAttribute('width', xScale.bandwidth() / 2 - 2);
                barAI.setAttribute('height', height - yScale(d.ai));
                barAI.setAttribute('fill', colors.modelTypes['Especializado']);
                barAI.classList.add('chart-bar', 'ai-bar');
                
                // Datos para tooltip
                barAI.setAttribute('data-tooltip', 
                    `<div class="chart-tooltip-title">${d.category}</div>` +
                    `<div>IA: ${d.ai.toFixed(1)}%</div>`
                );
                
                categoryGroup.appendChild(barAI);
                
                // Etiquetas de valor
                const labelHuman = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                labelHuman.setAttribute('x', xScale(d.category) + (xScale.bandwidth() / 4));
                labelHuman.setAttribute('y', yScale(d.human) - 5);
                labelHuman.setAttribute('text-anchor', 'middle');
                labelHuman.classList.add('chart-label');
                labelHuman.textContent = d.human.toFixed(0);
                categoryGroup.appendChild(labelHuman);
                
                const labelAI = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                labelAI.setAttribute('x', xScale(d.category) + (xScale.bandwidth() * 3/4));
                labelAI.setAttribute('y', yScale(d.ai) - 5);
                labelAI.setAttribute('text-anchor', 'middle');
                labelAI.classList.add('chart-label');
                labelAI.textContent = d.ai.toFixed(0);
                categoryGroup.appendChild(labelAI);
            });
            
            // Leyenda
            const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            legend.setAttribute('transform', `translate(${width - 100}, 10)`);
            
            // Leyenda humanos
            const legendHumanRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            legendHumanRect.setAttribute('x', 0);
            legendHumanRect.setAttribute('y', 0);
            legendHumanRect.setAttribute('width', 15);
            legendHumanRect.setAttribute('height', 15);
            legendHumanRect.setAttribute('fill', colors.modelTypes['Humano']);
            legend.appendChild(legendHumanRect);
            
            const legendHumanText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            legendHumanText.setAttribute('x', 20);
            legendHumanText.setAttribute('y', 12);
            legendHumanText.textContent = 'Humanos';
            legend.appendChild(legendHumanText);
            
            // Leyenda IA
            const legendAIRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            legendAIRect.setAttribute('x', 0);
            legendAIRect.setAttribute('y', 25);
            legendAIRect.setAttribute('width', 15);
            legendAIRect.setAttribute('height', 15);
            legendAIRect.setAttribute('fill', colors.modelTypes['Especializado']);
            legend.appendChild(legendAIRect);
            
            const legendAIText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            legendAIText.setAttribute('x', 20);
            legendAIText.setAttribute('y', 37);
            legendAIText.textContent = 'IA';
            legend.appendChild(legendAIText);
            
            g.appendChild(legend);
        }
    }
    
    /**
     * Crea un contenedor para el tooltip en el DOM si no existe
     */
    function createTooltipContainer() {
        if (!document.querySelector('.chart-tooltip')) {
            const tooltip = document.createElement('div');
            tooltip.className = 'chart-tooltip';
            document.body.appendChild(tooltip);
        }
    }
    
    // Crear el namespace para acceso público
    return {
        colors,
        initializeCharts,
        updateChart,
        renderPerformanceComparisonChart,
        renderReasoningChart,
        renderImageQuestionsChart,
        renderModelPerformanceChart,
        renderHumanVsAIChart
    };
})();

// Inicializar automáticamente los gráficos cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Comprobar si existe el namespace MIRChartData
    if (typeof MIRChartData === 'undefined') {
        console.error('Error: MIRChartData no está definido. Asegúrate de cargar charts-data.js antes que charts-renderer.js');
        return;
    }
    
    // Crear función global para actualizar gráficos
    window.updateChart = function(chartId, chartType) {
        MIRChartRenderer.updateChart(chartId, chartType);
    };
    
    // Inicializar todos los gráficos
    MIRChartRenderer.initializeCharts();
    
    console.log('Renderizador de gráficos inicializado correctamente');
});