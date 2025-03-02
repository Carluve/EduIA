/**
 * charts-data.js
 * Datos para las visualizaciones del estudio sobre LLMs en el examen MIR
 * 
 * Este archivo contiene todos los conjuntos de datos utilizados para generar
 * los gráficos en el sitio web. Los datos están estructurados según el tipo
 * de visualización y organizados por categorías.
 */

// Namespace para prevenir colisiones con otros scripts
const MIRChartData = (function() {
    /**
     * Rendimiento general de los modelos en 2024 y 2025
     */
    const modelPerformance = [
        { model: "Miri Pro", score2024: 97.56, score2025: 95.59, rawScore2024: 205, rawScore2025: 201, type: "Especializado" },
        { model: "Deepseek Reasoner", score2024: 94.15, score2025: 93.63, rawScore2024: 198, rawScore2025: 197, type: "Razonamiento" },
        { model: "Claude Sonet 3.5", score2024: 92.68, score2025: 88.73, rawScore2024: 195, rawScore2025: 186, type: "General" },
        { model: "GPT-4 Turbo", score2024: 89.27, score2025: 86.27, rawScore2024: 187, rawScore2025: 181, type: "General" },
        { model: "Grok Vision Beta", score2024: 87.80, score2025: 85.29, rawScore2024: 184, rawScore2025: 179, type: "Multimodal" },
        { model: "Gemini Vision Pro", score2024: 86.34, score2025: 84.31, rawScore2024: 181, rawScore2025: 177, type: "Multimodal" },
        { model: "GPT-4o", score2024: 84.88, score2025: 82.84, rawScore2024: 178, rawScore2025: 174, type: "General" },
        { model: "GPT-4o Mini", score2024: 80.49, score2025: 78.92, rawScore2024: 169, rawScore2025: 166, type: "General" },
        { model: "Claude Haiku", score2024: 78.05, score2025: 75.98, rawScore2024: 164, rawScore2025: 160, type: "General" },
        { model: "Anthropic Claude 3", score2024: 75.12, score2025: 72.06, rawScore2024: 158, rawScore2025: 151, type: "General" },
        { model: "PaLM 2", score2024: 70.73, score2025: 68.63, rawScore2024: 148, rawScore2025: 144, type: "General" },
        { model: "Llama 3.1 70B", score2024: 68.29, score2025: 67.16, rawScore2024: 143, rawScore2025: 141, type: "General" },
        { model: "Mistral Large", score2024: 66.83, score2025: 65.69, rawScore2024: 140, rawScore2025: 138, type: "General" },
        { model: "Mixtral 8x7B", score2024: 65.37, score2025: 64.22, rawScore2024: 137, rawScore2025: 135, type: "General" },
        { model: "GPT-3.5 Turbo", score2024: 63.90, score2025: 61.76, rawScore2024: 134, rawScore2025: 130, type: "General" },
        { model: "Mistral Medium", score2024: 60.98, score2025: 58.82, rawScore2024: 128, rawScore2025: 124, type: "General" },
        { model: "Llama 3 8B", score2024: 57.07, score2025: 55.39, rawScore2024: 120, rawScore2025: 116, type: "General" },
        { model: "Cohere Command", score2024: 54.15, score2025: 51.47, rawScore2024: 114, rawScore2025: 108, type: "General" },
        { model: "Falcon 40B", score2024: 51.71, score2025: 49.51, rawScore2024: 109, rawScore2025: 104, type: "General" },
        { model: "Llama 3.2 3B Instruct", score2024: 49.27, score2025: 43.14, rawScore2024: 101, rawScore2025: 88, type: "General" },
        { model: "Mistral 7B", score2024: 42.93, score2025: 41.18, rawScore2024: 90, rawScore2025: 86, type: "General" },
        { model: "Llama 3.2 1B Instruct", score2024: 30.73, score2025: 35.78, rawScore2024: 63, rawScore2025: 73, type: "General" },
        { model: "Mejor Candidato Humano", score2024: 88.57, score2025: 78.57, rawScore2024: 186, rawScore2025: 165, type: "Humano" }
    ];
    
    /**
     * Datos específicos para preguntas con imágenes
     */
    const imageQuestions = [
        { model: "Grok Vision Beta", score2024: 87.80, score2025: 85.29, type: "Multimodal" },
        { model: "Gemini Vision Pro", score2024: 86.34, score2025: 84.31, type: "Multimodal" },
        { model: "GPT-4o Vision", score2024: 85.42, score2025: 83.33, type: "Multimodal" },
        { model: "Miri Pro", score2024: 85.12, score2025: 83.33, type: "Especializado" },
        { model: "Deepseek Reasoner", score2024: 80.49, score2025: 77.45, type: "Razonamiento" },
        { model: "Claude Sonet 3.5", score2024: 76.83, score2025: 74.51, type: "General" },
        { model: "GPT-4 Turbo", score2024: 75.61, score2025: 72.55, type: "General" },
        { model: "GPT-4o", score2024: 73.17, score2025: 70.59, type: "General" },
        { model: "Claude Haiku", score2024: 65.85, score2025: 62.75, type: "General" },
        { model: "Anthropic Claude 3", score2024: 65.85, score2025: 62.75, type: "General" },
        { model: "Llama 3.1 70B", score2024: 60.98, score2025: 58.82, type: "General" },
        { model: "Mejor Candidato Humano", score2024: 82.93, score2025: 82.35, type: "Humano" }
    ];
    
    /**
     * Datos de razonamiento vs memorización y rendimiento en preguntas modificadas
     */
    const reasoningScores = [
        { model: "Miri Pro", reasoning: 95.59, memory: 96.88, modified: 94.12, type: "Especializado" },
        { model: "Deepseek Reasoner", reasoning: 93.63, memory: 79.17, modified: 91.18, type: "Razonamiento" },
        { model: "Claude Sonet 3.5", reasoning: 88.73, memory: 89.58, modified: 82.35, type: "General" },
        { model: "GPT-4 Turbo", reasoning: 86.27, memory: 87.50, modified: 76.47, type: "General" },
        { model: "Grok Vision Beta", reasoning: 85.29, memory: 86.46, modified: 70.59, type: "Multimodal" },
        { model: "Gemini Vision Pro", reasoning: 84.31, memory: 85.42, modified: 73.53, type: "Multimodal" },
        { model: "GPT-4o", reasoning: 82.84, memory: 85.42, modified: 70.59, type: "General" },
        { model: "GPT-4o Mini", reasoning: 78.92, memory: 81.25, modified: 64.71, type: "General" },
        { model: "Claude Haiku", reasoning: 75.98, memory: 77.08, modified: 61.76, type: "General" },
        { model: "GPT-3.5 Turbo", reasoning: 61.76, memory: 69.79, modified: 50.00, type: "General" },
        { model: "Llama 3.2 3B Instruct", reasoning: 43.14, memory: 55.21, modified: 32.35, type: "General" },
        { model: "Mejor Candidato Humano", reasoning: 78.57, memory: 77.08, modified: 82.35, type: "Humano" }
    ];
    
    /**
     * Comparación humanos vs IA por categoría
     */
    const humanVsAI = [
        { category: "General", human: 78.57, ai: 95.59, humanError: 3.2, aiError: 1.8 },
        { category: "Razonamiento Clínico", human: 81.25, ai: 89.58, humanError: 4.1, aiError: 2.3 },
        { category: "Interpretación de Imágenes", human: 82.35, ai: 85.29, humanError: 5.2, aiError: 3.5 },
        { category: "Ética Médica", human: 92.31, ai: 69.23, humanError: 2.8, aiError: 7.2 },
        { category: "Epidemiología España", human: 88.89, ai: 86.11, humanError: 3.5, aiError: 4.8 },
        { category: "Farmacología", human: 75.00, ai: 91.67, humanError: 5.8, aiError: 3.2 }
    ];
    
    /**
     * Datos detallados por especialidad médica
     */
    const specialtyPerformance = [
        { specialty: "Medicina Interna", human: 77.8, ai2024: 92.6, ai2025: 90.3 },
        { specialty: "Cardiología", human: 80.2, ai2024: 93.4, ai2025: 91.8 },
        { specialty: "Neurología", human: 76.5, ai2024: 91.2, ai2025: 88.5 },
        { specialty: "Gastroenterología", human: 79.3, ai2024: 94.8, ai2025: 93.5 },
        { specialty: "Endocrinología", human: 81.7, ai2024: 93.9, ai2025: 92.6 },
        { specialty: "Neumología", human: 78.8, ai2024: 87.9, ai2025: 85.3 },
        { specialty: "Nefrología", human: 77.1, ai2024: 89.3, ai2025: 87.1 },
        { specialty: "Hematología", human: 75.9, ai2024: 91.4, ai2025: 88.9 },
        { specialty: "Reumatología", human: 83.6, ai2024: 95.2, ai2025: 92.5 },
        { specialty: "Oncología", human: 82.4, ai2024: 93.7, ai2025: 91.2 },
        { specialty: "Psiquiatría", human: 76.8, ai2024: 88.5, ai2025: 84.3 },
        { specialty: "Dermatología", human: 84.3, ai2024: 89.7, ai2025: 87.4 },
        { specialty: "Pediatría", human: 80.5, ai2024: 94.6, ai2025: 92.7 },
        { specialty: "Ginecología", human: 81.9, ai2024: 90.8, ai2025: 88.6 },
        { specialty: "Cirugía General", human: 73.2, ai2024: 85.3, ai2025: 82.9 },
        { specialty: "Traumatología", human: 72.8, ai2024: 84.2, ai2025: 81.7 },
        { specialty: "Urología", human: 74.5, ai2024: 86.3, ai2025: 83.8 },
        { specialty: "Oftalmología", human: 79.1, ai2024: 87.5, ai2025: 84.6 },
        { specialty: "Otorrinolaringología", human: 76.3, ai2024: 88.9, ai2025: 85.7 },
        { specialty: "Anestesiología", human: 75.7, ai2024: 90.6, ai2025: 87.2 },
        { specialty: "Radiología", human: 77.9, ai2024: 89.7, ai2025: 86.4 },
        { specialty: "Medicina Familiar", human: 79.4, ai2024: 92.1, ai2025: 90.3 },
        { specialty: "Medicina Preventiva", human: 84.7, ai2024: 95.8, ai2025: 93.6 },
        { specialty: "Geriatría", human: 82.7, ai2024: 94.9, ai2025: 92.1 }
    ];
    
    /**
     * Datos de rendimiento en diferentes tipos de preguntas
     */
    const questionTypePerformance = [
        { type: "Diagnóstico", humanScore: 79.3, aiScore: 92.7, questionCount: 58 },
        { type: "Tratamiento", humanScore: 77.8, aiScore: 94.6, questionCount: 45 },
        { type: "Epidemiología", humanScore: 84.2, aiScore: 91.3, questionCount: 22 },
        { type: "Farmacología", humanScore: 75.4, aiScore: 93.8, questionCount: 37 },
        { type: "Patología", humanScore: 82.1, aiScore: 90.2, questionCount: 18 },
        { type: "Interpretación de Imágenes", humanScore: 81.7, aiScore: 85.4, questionCount: 25 },
        { type: "Ética", humanScore: 89.6, aiScore: 70.3, questionCount: 5 }
    ];
    
    /**
     * Cambio de rendimiento entre 2024 y 2025 por tipo de modelo
     */
    const performanceChangeByType = [
        { type: "Especializado", avg2024: 97.56, avg2025: 95.59, change: -1.97 },
        { type: "Razonamiento", avg2024: 94.15, avg2025: 93.63, change: -0.52 },
        { type: "Multimodal", avg2024: 87.07, avg2025: 84.80, change: -2.27 },
        { type: "General", avg2024: 64.02, avg2025: 61.89, change: -2.13 },
        { type: "Humano", avg2024: 88.57, avg2025: 78.57, change: -10.00 }
    ];
    
    /**
     * Métricas detalladas por tipo de razonamiento clínico
     */
    const clinicalReasoningMetrics = [
        { metric: "Reconocimiento de Patrones", human: 76.8, ai: 96.3 },
        { metric: "Diagnóstico Diferencial", human: 80.1, ai: 93.8 },
        { metric: "Interpretación de Laboratorio", human: 78.6, ai: 94.7 },
        { metric: "Selección de Pruebas", human: 82.3, ai: 92.1 },
        { metric: "Decisión Terapéutica", human: 77.9, ai: 91.6 },
        { metric: "Manejo Agudo", human: 84.5, ai: 88.2 },
        { metric: "Pronóstico", human: 79.2, ai: 90.3 },
        { metric: "Farmacología Clínica", human: 75.7, ai: 93.5 },
        { metric: "Consideraciones Éticas", human: 91.2, ai: 68.9 },
        { metric: "Comunicación con Paciente", human: 93.6, ai: 65.7 }
    ];
    
    /**
     * Análisis de preguntas modificadas
     */
    const modifiedQuestionsAnalysis = [
        { modelType: "General-purpose", beforeMod: 85.7, afterMod: 53.8, percentDrop: 37.2 },
        { modelType: "Specialized", beforeMod: 96.2, afterMod: 89.4, percentDrop: 7.1 },
        { modelType: "Human", beforeMod: 77.3, afterMod: 82.6, percentDrop: -6.9 }
    ];
    
    /**
     * Datos para el mapa de calor por especialidad y tipo de pregunta
     */
    const heatmapData = [
        {
            specialty: "Medicina Interna",
            metrics: {
                diagnosis: 94.2,
                treatment: 92.1,
                imaging: 85.3,
                ethics: 71.2,
                pharmacology: 93.6,
                epidemiology: 91.8
            }
        },
        {
            specialty: "Cardiología",
            metrics: {
                diagnosis: 96.3,
                treatment: 93.7,
                imaging: 87.2,
                ethics: 68.9,
                pharmacology: 92.3,
                epidemiology: 89.7
            }
        },
        {
            specialty: "Neurología",
            metrics: {
                diagnosis: 93.8,
                treatment: 90.5,
                imaging: 86.1,
                ethics: 72.4,
                pharmacology: 90.8,
                epidemiology: 88.3
            }
        },
        {
            specialty: "Pediatría",
            metrics: {
                diagnosis: 95.7,
                treatment: 94.2,
                imaging: 89.3,
                ethics: 75.6,
                pharmacology: 94.9,
                epidemiology: 92.6
            }
        },
        {
            specialty: "Cirugía",
            metrics: {
                diagnosis: 88.1,
                treatment: 86.7,
                imaging: 83.9,
                ethics: 69.3,
                pharmacology: 85.2,
                epidemiology: 83.6
            }
        }
    ];
    
    // Promedio histórico de resultados MIR (para comparación)
    const historicalMIRResults = [
        { year: 2020, averageScore: 71.3, topScore: 82.1, passingScore: 63.8 },
        { year: 2021, averageScore: 72.6, topScore: 83.4, passingScore: 64.2 },
        { year: 2022, averageScore: 73.1, topScore: 84.7, passingScore: 65.3 },
        { year: 2023, averageScore: 74.5, topScore: 86.2, passingScore: 66.1 },
        { year: 2024, averageScore: 75.2, topScore: 88.6, passingScore: 67.5 },
        { year: 2025, averageScore: 73.8, topScore: 78.6, passingScore: 65.2 }
    ];
    
    // Exponer los datos para uso externo
    return {
        modelPerformance,
        imageQuestions,
        reasoningScores,
        humanVsAI,
        specialtyPerformance,
        questionTypePerformance,
        performanceChangeByType,
        clinicalReasoningMetrics,
        modifiedQuestionsAnalysis,
        heatmapData,
        historicalMIRResults,
        
        // Métodos de utilidad para facilitar el acceso a los datos
        
        /**
         * Obtiene los modelos ordenados por rendimiento en un año específico
         * @param {number} year - Año (2024 o 2025)
         * @returns {Array} - Array de modelos ordenados por rendimiento
         */
        getModelsByPerformance: function(year) {
            const property = year === 2024 ? 'score2024' : 'score2025';
            return [...this.modelPerformance].sort((a, b) => b[property] - a[property]);
        },
        
        /**
         * Obtiene modelos por categoría
         * @param {string} type - Tipo de modelo (e.g., "General", "Especializado")
         * @returns {Array} - Array de modelos del tipo especificado
         */
        getModelsByType: function(type) {
            return this.modelPerformance.filter(model => model.type === type);
        },
        
        /**
         * Calcula el cambio de rendimiento para cada modelo entre 2024 y 2025
         * @returns {Array} - Array con los datos de cambio para cada modelo
         */
        getPerformanceChange: function() {
            return this.modelPerformance.map(model => ({
                model: model.model,
                change: model.score2025 - model.score2024,
                percentChange: ((model.score2025 - model.score2024) / model.score2024 * 100).toFixed(2),
                type: model.type
            }));
        },
        
        /**
         * Obtiene el rendimiento promedio por tipo de modelo para un año específico
         * @param {number} year - Año (2024 o 2025)
         * @returns {Array} - Array con promedios por tipo
         */
        getAverageByType: function(year) {
            const property = year === 2024 ? 'score2024' : 'score2025';
            const types = [...new Set(this.modelPerformance.map(model => model.type))];
            
            return types.map(type => {
                const modelsOfType = this.modelPerformance.filter(model => model.type === type);
                const average = modelsOfType.reduce((sum, model) => sum + model[property], 0) / modelsOfType.length;
                
                return {
                    type,
                    average: average
                };
            });
        }
    };
})();
