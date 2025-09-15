// Height Data Visualizer JavaScript

// Sample data for testing
const sampleHeights = [170.2, 165.8, 178.5, 172.1, 169.7, 175.3, 167.9, 181.2, 173.6, 168.4, 176.8, 171.5, 179.1, 166.3, 174.7, 170.9, 177.4, 169.2, 175.8, 168.7, 172.8, 176.1, 174.3, 171.8, 178.9, 167.5, 173.2, 175.6, 170.7, 177.9, 169.5, 174.1, 172.4, 176.7, 168.8, 175.2, 171.3, 178.6, 173.9, 170.4];

// Chart instance
let heightChart = null;

// DOM elements
let heightDataTextarea, generateBtn, clearBtn, sampleBtn, errorMessage, successMessage, visualizationSection, statisticsSection;
let statCount, statMean, statMedian, statStdDev, statMin, statMax;

// Chart.js loading check
function waitForChart() {
    return new Promise((resolve) => {
        if (typeof Chart !== 'undefined') {
            resolve();
        } else {
            setTimeout(() => waitForChart().then(resolve), 100);
        }
    });
}

// Initialize DOM elements after page loads
async function initializeElements() {
    heightDataTextarea = document.getElementById('heightData');
    generateBtn = document.getElementById('generateBtn');
    clearBtn = document.getElementById('clearBtn');
    sampleBtn = document.getElementById('sampleBtn');
    errorMessage = document.getElementById('errorMessage');
    successMessage = document.getElementById('successMessage');
    visualizationSection = document.getElementById('visualizationSection');
    statisticsSection = document.getElementById('statisticsSection');

    // Statistics display elements
    statCount = document.getElementById('statCount');
    statMean = document.getElementById('statMean');
    statMedian = document.getElementById('statMedian');
    statStdDev = document.getElementById('statStdDev');
    statMin = document.getElementById('statMin');
    statMax = document.getElementById('statMax');

    // Add event listeners
    generateBtn.addEventListener('click', generateVisualization);
    clearBtn.addEventListener('click', clearData);
    sampleBtn.addEventListener('click', loadSampleData);

    // Add Enter key support for generating visualization (Ctrl+Enter)
    heightDataTextarea.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            generateVisualization();
        }
    });

    // Focus on the textarea when page loads
    heightDataTextarea.focus();

    console.log('Application initialized successfully');
}

// Utility functions
function parseHeightData(inputText) {
    if (!inputText.trim()) {
        throw new Error('Please enter some height data');
    }

    // Split by commas first, then by newlines
    let values = inputText.split(',').map(v => v.trim());
    if (values.length === 1) {
        // If no commas found, try splitting by newlines
        values = inputText.split('\n').map(v => v.trim()).filter(v => v);
    }

    // Convert to numbers and validate
    const heights = [];
    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        if (!value) continue; // Skip empty values
        
        const num = parseFloat(value);
        if (isNaN(num)) {
            throw new Error(`Invalid number at position ${i + 1}: "${value}"`);
        }
        if (num <= 0) {
            throw new Error(`Height must be positive at position ${i + 1}: ${num}`);
        }
        heights.push(num);
    }

    if (heights.length === 0) {
        throw new Error('No valid height data found');
    }

    if (heights.length < 2) {
        throw new Error('Please provide at least 2 height values for meaningful statistics');
    }

    return heights;
}

function calculateStatistics(heights) {
    const sortedHeights = [...heights].sort((a, b) => a - b);
    const n = sortedHeights.length;

    // Mean
    const mean = sortedHeights.reduce((sum, height) => sum + height, 0) / n;

    // Median
    const median = n % 2 === 0 
        ? (sortedHeights[n / 2 - 1] + sortedHeights[n / 2]) / 2
        : sortedHeights[Math.floor(n / 2)];

    // Standard deviation
    const variance = sortedHeights.reduce((sum, height) => sum + Math.pow(height - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);

    // Min and max
    const min = sortedHeights[0];
    const max = sortedHeights[n - 1];

    return {
        count: n,
        mean: mean,
        median: median,
        standardDeviation: stdDev,
        min: min,
        max: max,
        sortedHeights: sortedHeights
    };
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    successMessage.classList.add('hidden');
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.classList.remove('hidden');
    errorMessage.classList.add('hidden');
}

function hideMessages() {
    errorMessage.classList.add('hidden');
    successMessage.classList.add('hidden');
}

function updateStatisticsDisplay(stats) {
    statCount.textContent = stats.count;
    statMean.textContent = stats.mean.toFixed(2) + ' cm';
    statMedian.textContent = stats.median.toFixed(2) + ' cm';
    statStdDev.textContent = stats.standardDeviation.toFixed(2) + ' cm';
    statMin.textContent = stats.min.toFixed(2) + ' cm';
    statMax.textContent = stats.max.toFixed(2) + ' cm';
}

// Custom plugin to draw statistical overlays
const statisticalOverlayPlugin = {
    id: 'statisticalOverlay',
    afterDraw: function(chart, args, options) {
        if (!options.stats) return;
        
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        const yScale = chart.scales.y;
        const stats = options.stats;
        
        // Standard deviation band (draw first so lines appear on top)
        const stdDevUpper = yScale.getPixelForValue(stats.mean + stats.standardDeviation);
        const stdDevLower = yScale.getPixelForValue(stats.mean - stats.standardDeviation);
        
        ctx.save();
        ctx.fillStyle = 'rgba(68, 136, 255, 0.2)';
        ctx.fillRect(chartArea.left, stdDevUpper, chartArea.right - chartArea.left, stdDevLower - stdDevUpper);
        
        // Add std dev label
        ctx.font = '11px Arial';
        ctx.fillStyle = 'rgba(68, 136, 255, 0.8)';
        ctx.textAlign = 'center';
        ctx.fillText('±1 Std Dev', chartArea.left + (chartArea.right - chartArea.left) / 2, stdDevUpper + (stdDevLower - stdDevUpper) / 2);
        ctx.restore();
        
        // Mean line (red dashed)
        const meanY = yScale.getPixelForValue(stats.mean);
        ctx.save();
        ctx.strokeStyle = '#FF4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(chartArea.left, meanY);
        ctx.lineTo(chartArea.right, meanY);
        ctx.stroke();
        
        // Mean label
        ctx.setLineDash([]);
        ctx.font = '11px Arial';
        ctx.fillStyle = '#FF4444';
        ctx.textAlign = 'right';
        ctx.fillText(`Mean: ${stats.mean.toFixed(1)}cm`, chartArea.right - 5, meanY - 5);
        ctx.restore();
        
        // Median line (green dashed)
        const medianY = yScale.getPixelForValue(stats.median);
        ctx.save();
        ctx.strokeStyle = '#44AA44';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(chartArea.left, medianY);
        ctx.lineTo(chartArea.right, medianY);
        ctx.stroke();
        
        // Median label
        ctx.setLineDash([]);
        ctx.font = '11px Arial';
        ctx.fillStyle = '#44AA44';
        ctx.textAlign = 'left';
        ctx.fillText(`Median: ${stats.median.toFixed(1)}cm`, chartArea.left + 5, medianY - 5);
        ctx.restore();
    }
};

function createChart(stats) {
    const canvas = document.getElementById('heightChart');
    if (!canvas) {
        throw new Error('Chart canvas not found');
    }
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (heightChart) {
        heightChart.destroy();
        heightChart = null;
    }

    // Create labels (Person 1, Person 2, etc.)
    const labels = stats.sortedHeights.map((_, index) => `P${index + 1}`);

    // Chart configuration
    const config = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Height (cm)',
                data: stats.sortedHeights,
                backgroundColor: '#1FB8CD',
                borderColor: '#5D878F',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Height (cm)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Individuals (sorted by height)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 0
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return 'Person ' + (tooltipItems[0].dataIndex + 1);
                        },
                        label: function(context) {
                            return `Height: ${context.parsed.y.toFixed(2)} cm`;
                        }
                    }
                },
                statisticalOverlay: {
                    stats: stats
                }
            }
        },
        plugins: [statisticalOverlayPlugin]
    };

    try {
        heightChart = new Chart(ctx, config);
        console.log('Chart created successfully with statistical overlays');
    } catch (error) {
        console.error('Error creating chart:', error);
        throw new Error('Failed to create chart: ' + error.message);
    }
}

async function generateVisualization() {
    try {
        hideMessages();
        
        // Disable button and show loading
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="loading-spinner"></span> Generating...';
        
        const inputText = heightDataTextarea.value;
        console.log('Input text:', inputText);
        
        const heights = parseHeightData(inputText);
        console.log('Parsed heights:', heights);
        
        const stats = calculateStatistics(heights);
        console.log('Calculated stats:', stats);
        
        // Update statistics display
        updateStatisticsDisplay(stats);
        
        // Wait for Chart.js to be loaded
        await waitForChart();
        
        // Create the chart
        createChart(stats);
        
        // Show visualization sections
        visualizationSection.classList.remove('hidden');
        statisticsSection.classList.remove('hidden');
        
        // Show success message
        showSuccess(`Successfully generated visualization for ${stats.count} height measurements`);
        
        // Scroll to chart
        setTimeout(() => {
            visualizationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
    } catch (error) {
        console.error('Error in generateVisualization:', error);
        showError(error.message);
        
        // Hide visualization sections on error
        visualizationSection.classList.add('hidden');
        statisticsSection.classList.add('hidden');
    } finally {
        // Re-enable button
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Visualization';
    }
}

function clearData() {
    if (heightDataTextarea) {
        heightDataTextarea.value = '';
        hideMessages();
        
        // Hide visualization sections
        visualizationSection.classList.add('hidden');
        statisticsSection.classList.add('hidden');
        
        // Destroy chart if it exists
        if (heightChart) {
            heightChart.destroy();
            heightChart = null;
        }
        
        // Focus on textarea
        heightDataTextarea.focus();
    }
}

function loadSampleData() {
    if (heightDataTextarea) {
        heightDataTextarea.value = sampleHeights.join('\n');
        hideMessages();
        showSuccess('Sample data loaded! Click "Generate Visualization" to create the chart.');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Initialize after a short delay to ensure everything is loaded
    setTimeout(async () => {
        try {
            await waitForChart();
            console.log('Chart.js loaded');
            
            await initializeElements();
            console.log('Application ready');
        } catch (error) {
            console.error('Error initializing application:', error);
        }
    }, 200);
});