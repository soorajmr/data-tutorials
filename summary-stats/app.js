// Statistics Calculator Functions

// Utility function to parse input and validate numbers
function parseInput(inputString) {
    if (!inputString.trim()) {
        throw new Error('Please enter some numbers');
    }
    
    const numbers = inputString.split(',')
        .map(str => str.trim())
        .filter(str => str !== '')
        .map(str => parseFloat(str));
    
    if (numbers.some(isNaN)) {
        throw new Error('Please enter valid numbers only');
    }
    
    if (numbers.length === 0) {
        throw new Error('Please enter at least one number');
    }
    
    return numbers;
}

// Mean Calculator
function calculateMean() {
    const input = document.getElementById('mean-input').value;
    const output = document.getElementById('mean-output');
    
    if (!output) {
        console.error('Mean output element not found');
        return;
    }
    
    try {
        const numbers = parseInput(input);
        const sum = numbers.reduce((acc, num) => acc + num, 0);
        const mean = sum / numbers.length;
        
        output.innerHTML = `
            <strong>Numbers:</strong> ${numbers.join(', ')}<br>
            <strong>Sum:</strong> ${sum.toFixed(2)}<br>
            <strong>Count:</strong> ${numbers.length}<br>
            <strong>Mean:</strong> ${mean.toFixed(2)}
        `;
        output.className = 'result-output success';
    } catch (error) {
        output.innerHTML = error.message;
        output.className = 'result-output error';
    }
}

// Median Calculator
function calculateMedian() {
    const input = document.getElementById('median-input').value;
    const output = document.getElementById('median-output');
    
    if (!output) {
        console.error('Median output element not found');
        return;
    }
    
    try {
        const numbers = parseInput(input);
        const sorted = [...numbers].sort((a, b) => a - b);
        const n = sorted.length;
        let median;
        
        if (n % 2 === 0) {
            // Even number of elements
            median = (sorted[n/2 - 1] + sorted[n/2]) / 2;
        } else {
            // Odd number of elements
            median = sorted[Math.floor(n/2)];
        }
        
        output.innerHTML = `
            <strong>Original:</strong> ${numbers.join(', ')}<br>
            <strong>Sorted:</strong> ${sorted.join(', ')}<br>
            <strong>Median:</strong> ${median.toFixed(2)}
            ${n % 2 === 0 ? `<br><em>(Average of ${sorted[n/2 - 1]} and ${sorted[n/2]})</em>` : `<br><em>(Middle value at position ${Math.floor(n/2) + 1})</em>`}
        `;
        output.className = 'result-output success';
    } catch (error) {
        output.innerHTML = error.message;
        output.className = 'result-output error';
    }
}

// Mode Calculator
function calculateMode() {
    const input = document.getElementById('mode-input').value;
    const output = document.getElementById('mode-output');
    
    if (!output) {
        console.error('Mode output element not found');
        return;
    }
    
    try {
        const numbers = parseInput(input);
        const frequency = {};
        
        // Count frequencies
        numbers.forEach(num => {
            frequency[num] = (frequency[num] || 0) + 1;
        });
        
        // Find maximum frequency
        const maxFreq = Math.max(...Object.values(frequency));
        
        // Find all numbers with maximum frequency
        const modes = Object.keys(frequency)
            .filter(num => frequency[num] === maxFreq)
            .map(num => parseFloat(num));
        
        let result = `<strong>Numbers:</strong> ${numbers.join(', ')}<br>`;
        result += `<strong>Frequencies:</strong><br>`;
        
        Object.keys(frequency).forEach(num => {
            result += `${num}: ${frequency[num]} time${frequency[num] > 1 ? 's' : ''}<br>`;
        });
        
        if (modes.length === numbers.length) {
            result += `<strong>Mode:</strong> No mode (all values appear equally)`;
        } else if (modes.length > 1) {
            result += `<strong>Modes:</strong> ${modes.join(', ')} (each appears ${maxFreq} times)`;
        } else {
            result += `<strong>Mode:</strong> ${modes[0]} (appears ${maxFreq} times)`;
        }
        
        output.innerHTML = result;
        output.className = 'result-output success';
    } catch (error) {
        output.innerHTML = error.message;
        output.className = 'result-output error';
    }
}

// Standard Deviation Calculator
function calculateStdDev() {
    const input = document.getElementById('stddev-input').value;
    const output = document.getElementById('stddev-output');
    
    if (!output) {
        console.error('Standard deviation output element not found');
        return;
    }
    
    try {
        const numbers = parseInput(input);
        const n = numbers.length;
        
        // Calculate mean
        const mean = numbers.reduce((acc, num) => acc + num, 0) / n;
        
        // Calculate variance
        const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
        const variance = squaredDiffs.reduce((acc, diff) => acc + diff, 0) / n;
        
        // Calculate standard deviation
        const stdDev = Math.sqrt(variance);
        
        output.innerHTML = `
            <strong>Numbers:</strong> ${numbers.join(', ')}<br>
            <strong>Mean:</strong> ${mean.toFixed(2)}<br>
            <strong>Variance:</strong> ${variance.toFixed(2)}<br>
            <strong>Standard Deviation:</strong> ${stdDev.toFixed(2)}<br>
            <em>${stdDev < mean * 0.1 ? 'Low variation (values are close together)' : 
                stdDev < mean * 0.3 ? 'Moderate variation' : 
                'High variation (values are spread out)'}</em>
        `;
        output.className = 'result-output success';
    } catch (error) {
        output.innerHTML = error.message;
        output.className = 'result-output error';
    }
}

// Quantiles Calculator
function calculateQuantiles() {
    const input = document.getElementById('quantiles-input').value;
    const output = document.getElementById('quantiles-output');
    
    if (!output) {
        console.error('Quantiles output element not found');
        return;
    }
    
    try {
        const numbers = parseInput(input);
        
        if (numbers.length < 4) {
            throw new Error('Please enter at least 4 numbers for quartile calculations');
        }
        
        const sorted = [...numbers].sort((a, b) => a - b);
        
        // Calculate quartiles using the method from the existing code
        function getQuantile(data, q) {
            const pos = (data.length - 1) * q;
            const base = Math.floor(pos);
            const rest = pos - base;
            
            if (base + 1 < data.length) {
                return data[base] + rest * (data[base + 1] - data[base]);
            } else {
                return data[base];
            }
        }
        
        const q1 = getQuantile(sorted, 0.25);
        const q2 = getQuantile(sorted, 0.5); // Median
        const q3 = getQuantile(sorted, 0.75);
        
        output.innerHTML = `
            <strong>Numbers:</strong> ${numbers.join(', ')}<br>
            <strong>Sorted:</strong> ${sorted.join(', ')}<br>
            <strong>Q1 (25th percentile):</strong> ${q1.toFixed(2)}<br>
            <strong>Q2 (50th percentile - Median):</strong> ${q2.toFixed(2)}<br>
            <strong>Q3 (75th percentile):</strong> ${q3.toFixed(2)}<br>
            <strong>Interquartile Range (IQR):</strong> ${(q3 - q1).toFixed(2)}<br>
            <em>25% of values are below ${q1.toFixed(2)}, 50% below ${q2.toFixed(2)}, 75% below ${q3.toFixed(2)}</em>
        `;
        output.className = 'result-output success';
    } catch (error) {
        output.innerHTML = error.message;
        output.className = 'result-output error';
    }
}

// Practice Exercise Answer Checker
function checkAnswer(inputId, correctAnswer) {
    const inputElement = document.getElementById(inputId);
    const feedbackElement = document.getElementById(inputId + '-feedback');
    
    if (!inputElement) {
        console.error(`Input element ${inputId} not found`);
        return;
    }
    
    if (!feedbackElement) {
        console.error(`Feedback element ${inputId}-feedback not found`);
        return;
    }
    
    const userAnswer = parseFloat(inputElement.value);
    
    if (isNaN(userAnswer)) {
        feedbackElement.textContent = 'Please enter a number';
        feedbackElement.className = 'feedback incorrect';
        return;
    }
    
    const tolerance = Math.max(Math.abs(correctAnswer * 0.05), 0.1); // 5% tolerance or 0.1 minimum
    const isCorrect = Math.abs(userAnswer - correctAnswer) <= tolerance;
    
    if (isCorrect) {
        feedbackElement.textContent = '✅ Correct!';
        feedbackElement.className = 'feedback correct';
    } else {
        feedbackElement.textContent = `❌ Try again. Correct answer: ${correctAnswer}`;
        feedbackElement.className = 'feedback incorrect';
    }
}

// Initialize predefined examples with calculations
function initializeExamples() {
    console.log('Initializing examples...');
    
    // Water consumption example (Mean)
    const waterConsumption = [180, 220, 195, 210, 185, 200, 175, 225, 190, 205];
    const waterMean = waterConsumption.reduce((acc, num) => acc + num, 0) / waterConsumption.length;
    const meanResult = document.getElementById('mean-result');
    if (meanResult) {
        meanResult.textContent = waterMean.toFixed(1);
    }
    
    // Income example (Median) - 20 values
    const incomes = [15, 18, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45, 48, 52, 55, 65, 75, 85, 120, 180];
    // For 20 values, median is average of 10th and 11th values (0-indexed: 9 and 10)
    const incomeMedian = (incomes[9] + incomes[10]) / 2; // 40 and 42
    const incomeMedianResult = document.getElementById('income-median-result');
    if (incomeMedianResult) {
        incomeMedianResult.textContent = '₹' + incomeMedian + 'k';
    }
    
    // PDS waiting times example (Median) - 20 values
    const waitingTimes = [5, 8, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 42, 45, 48, 55, 65, 90, 120];
    // For 20 values, median is average of 10th and 11th values (0-indexed: 9 and 10)
    const pdsMedian = (waitingTimes[9] + waitingTimes[10]) / 2; // 30 and 32
    const pdsMedianResult = document.getElementById('pds-median-result');
    if (pdsMedianResult) {
        pdsMedianResult.textContent = pdsMedian + ' minutes';
    }
    
    // Transport mode example (Mode)
    const modeResult = document.getElementById('mode-result');
    if (modeResult) {
        modeResult.textContent = 'Bus';
    }
    
    // Air quality example (Standard Deviation)
    const airQuality = [45, 65, 85, 95, 120, 150, 180, 200, 250, 300];
    const aqMean = airQuality.reduce((acc, num) => acc + num, 0) / airQuality.length;
    const aqVariance = airQuality.reduce((acc, num) => acc + Math.pow(num - aqMean, 2), 0) / airQuality.length;
    const aqStdDev = Math.sqrt(aqVariance);
    const stddevMean = document.getElementById('stddev-mean');
    const stddevResult = document.getElementById('stddev-result');
    if (stddevMean) {
        stddevMean.textContent = aqMean.toFixed(0);
    }
    if (stddevResult) {
        stddevResult.textContent = aqStdDev.toFixed(1);
    }
    
    // Exam scores example (Quantiles)
    const examScores = [45, 52, 58, 63, 67, 72, 75, 78, 82, 85, 87, 90, 92, 94, 96];
    
    function getQuantile(data, q) {
        const pos = (data.length - 1) * q;
        const base = Math.floor(pos);
        const rest = pos - base;
        
        if (base + 1 < data.length) {
            return data[base] + rest * (data[base + 1] - data[base]);
        } else {
            return data[base];
        }
    }
    
    const q1 = getQuantile(examScores, 0.25);
    const q2 = getQuantile(examScores, 0.5);
    const q3 = getQuantile(examScores, 0.75);
    
    const q1Result = document.getElementById('q1-result');
    const q2Result = document.getElementById('q2-result');
    const q3Result = document.getElementById('q3-result');
    
    if (q1Result) q1Result.textContent = q1.toFixed(0) + ' marks';
    if (q2Result) q2Result.textContent = q2.toFixed(0) + ' marks';
    if (q3Result) q3Result.textContent = q3.toFixed(0) + ' marks';
    
    console.log('Examples initialized successfully');
}

// Smooth scrolling navigation
function setupNavigation() {
    console.log('Setting up navigation...');
    
    const navLinks = document.querySelectorAll('.nav-link');
    console.log(`Found ${navLinks.length} navigation links`);
    
    navLinks.forEach((link, index) => {
        console.log(`Setting up navigation for link ${index}: ${link.href}`);
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            console.log(`Navigation clicked: ${targetId}`);
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                console.log(`Scrolling to section: ${targetId}`);
                const headerHeight = 100; // Account for header
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            } else {
                console.error(`Target section not found: ${targetId}`);
            }
        });
    });
    
    console.log('Navigation setup completed');
}

// Setup Enter key support for calculators
function setupKeyboardSupport() {
    console.log('Setting up keyboard support...');
    
    const calculatorInputs = [
        { input: 'mean-input', calculator: calculateMean },
        { input: 'median-input', calculator: calculateMedian },
        { input: 'mode-input', calculator: calculateMode },
        { input: 'stddev-input', calculator: calculateStdDev },
        { input: 'quantiles-input', calculator: calculateQuantiles }
    ];
    
    calculatorInputs.forEach(({ input, calculator }) => {
        const inputElement = document.getElementById(input);
        if (inputElement) {
            inputElement.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    calculator();
                }
            });
            console.log(`Keyboard support added for ${input}`);
        } else {
            console.error(`Input element not found: ${input}`);
        }
    });
    
    // Also add enter key support for exercise inputs
    const exerciseInputs = [
        { id: 'test-scores-mean', answer: 87.14 },
        { id: 'property-median', answer: 46.5 }, 
        { id: 'class-size-mode', answer: 30 },
        { id: 'temp-stddev', answer: 1.7 },
        { id: 'salary-q2', answer: 42500 }
    ];
    
    exerciseInputs.forEach(({ id, answer }) => {
        const inputElement = document.getElementById(id);
        if (inputElement) {
            inputElement.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    checkAnswer(id, answer);
                }
            });
            console.log(`Keyboard support added for exercise ${id}`);
        } else {
            console.error(`Exercise input element not found: ${id}`);
        }
    });
    
    console.log('Keyboard support setup completed');
}

// Setup input clearing for calculators
function setupInputClearing() {
    console.log('Setting up input clearing...');
    
    const inputs = document.querySelectorAll('input[type="text"]');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Clear previous results when user starts typing
            const outputId = this.id.replace('-input', '-output');
            const outputElement = document.getElementById(outputId);
            if (outputElement) {
                outputElement.innerHTML = '';
                outputElement.className = 'result-output';
            }
        });
    });
    
    console.log(`Input clearing setup for ${inputs.length} text inputs`);
}

// Setup feedback clearing for exercises
function setupFeedbackClearing() {
    console.log('Setting up feedback clearing...');
    
    const exerciseInputs = document.querySelectorAll('.exercise-card input[type="number"]');
    
    exerciseInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Clear previous feedback when user starts typing
            const feedbackId = this.id + '-feedback';
            const feedbackElement = document.getElementById(feedbackId);
            if (feedbackElement) {
                feedbackElement.textContent = '';
                feedbackElement.className = 'feedback';
            }
        });
    });
    
    console.log(`Feedback clearing setup for ${exerciseInputs.length} exercise inputs`);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing application...');
    
    // Add a small delay to ensure all elements are rendered
    setTimeout(() => {
        // Initialize all components
        initializeExamples();
        setupNavigation();
        setupKeyboardSupport();
        setupInputClearing();
        setupFeedbackClearing();
        
        console.log('Statistics tutorial initialized successfully');
    }, 100);
});

// Make functions globally accessible for onclick handlers
window.calculateMean = calculateMean;
window.calculateMedian = calculateMedian;
window.calculateMode = calculateMode;
window.calculateStdDev = calculateStdDev;
window.calculateQuantiles = calculateQuantiles;
window.checkAnswer = checkAnswer;