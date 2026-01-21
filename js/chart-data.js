/**
 * World Regional Geography - Chart Data Module
 * Provides data and configuration for Chart.js visualizations
 * Used across all chapters for regional comparisons and data-driven engagement
 */

const ChartDataManager = {
    /**
     * Chart.js default configuration for consistency
     */
    defaultOptions: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: { family: 'system-ui, -apple-system, sans-serif', size: 12 },
                    padding: 15,
                    color: '#333333'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: { family: 'system-ui, -apple-system, sans-serif', size: 13 },
                bodyFont: { family: 'system-ui, -apple-system, sans-serif', size: 12 },
                padding: 12,
                cornerRadius: 4
            }
        },
        scales: {
            y: {
                ticks: { color: '#333333', font: { family: 'system-ui, -apple-system, sans-serif' } },
                grid: { color: '#e0e0e0' }
            },
            x: {
                ticks: { color: '#333333', font: { family: 'system-ui, -apple-system, sans-serif' } },
                grid: { color: '#e0e0e0' }
            }
        }
    },

    /**
     * COLOR PALETTE by Region
     * Ensures visual consistency across all visualizations
     */
    regionColors: {
        'europe': '#4A90A4',         // Teal
        'russia': '#E67E22',         // Orange
        'north-america': '#C0392B',  // Red
        'latin-america': '#27AE60',  // Green
        'africa': '#F39C12',         // Gold
        'mena': '#E74C3C',           // Red-Orange
        'south-asia': '#3498DB',     // Blue
        'east-asia': '#9B59B6',      // Purple
        'southeast-asia': '#1ABC9C', // Turquoise
        'oceania': '#34495E'         // Dark Gray
    },

    /**
     * CHAPTER 3 - Russia and Central Asia
     * Natural Resource Distribution and Economic Sectors
     */
    russiaResourcesChart: {
        type: 'doughnut',
        data: {
            labels: ['Oil & Natural Gas', 'Minerals & Metals', 'Timber & Forests', 'Agriculture', 'Other'],
            datasets: [{
                data: [35, 28, 18, 12, 7],
                backgroundColor: [
                    '#E67E22',  // Orange (primary resource)
                    '#D35400',  // Dark Orange
                    '#27AE60',  // Green (forests)
                    '#F39C12',  // Gold (agriculture)
                    '#BDC3C7'   // Gray (other)
                ],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { font: { size: 13 }, padding: 20 }
                },
                title: {
                    display: true,
                    text: 'Russia: Natural Resource Economy',
                    font: { size: 14, weight: 'bold' }
                }
            }
        }
    },

    /**
     * CHAPTER 3 - Russia and Central Asia
     * Gross Regional Product by Economic Sector
     */
    russiaEconomyChart: {
        type: 'bar',
        data: {
            labels: ['Energy', 'Manufacturing', 'Services', 'Agriculture', 'Technology'],
            datasets: [{
                label: '% of Regional GDP',
                data: [32, 25, 28, 8, 7],
                backgroundColor: '#E67E22',
                borderColor: '#D35400',
                borderWidth: 1
            }]
        },
        options: {
            ...this.defaultOptions,
            indexAxis: 'y',
            plugins: {
                title: {
                    display: true,
                    text: 'Russia: Economic Sectors (% GDP)',
                    font: { size: 14, weight: 'bold' }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 40,
                    ticks: { callback: function(v) { return v + '%'; } }
                }
            }
        }
    },

    /**
     * CHAPTER 5 - Latin America and the Caribbean
     * Population Growth Trends
     */
    latinAmericaPopulationChart: {
        type: 'line',
        data: {
            labels: ['1980', '1990', '2000', '2010', '2020', '2030 (proj.)'],
            datasets: [{
                label: 'Total Population (millions)',
                data: [242, 295, 347, 391, 430, 465],
                borderColor: '#27AE60',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 3,
                pointRadius: 5,
                pointBackgroundColor: '#27AE60',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            ...this.defaultOptions,
            plugins: {
                title: {
                    display: true,
                    text: 'Latin America: Population Growth (1980-2030)',
                    font: { size: 14, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: function(v) { return v + 'M'; } }
                }
            }
        }
    },

    /**
     * CHAPTER 7 - North Africa & Southwest Asia
     * Oil Reserves by Country
     */
    menaOilReservesChart: {
        type: 'bar',
        data: {
            labels: ['Saudi Arabia', 'Iran', 'Iraq', 'UAE', 'Kuwait', 'Libya', 'Qatar'],
            datasets: [{
                label: 'Proven Reserves (billion barrels)',
                data: [268, 208, 145, 98, 101, 48, 26],
                backgroundColor: '#E74C3C',
                borderColor: '#C0392B',
                borderWidth: 1
            }]
        },
        options: {
            ...this.defaultOptions,
            plugins: {
                title: {
                    display: true,
                    text: 'MENA Region: Top Oil-Producing Nations',
                    font: { size: 14, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: function(v) { return v + 'B'; } }
                }
            }
        }
    },

    /**
     * CHAPTER 8 - South Asia
     * Population Density Comparison
     */
    southAsiaDensityChart: {
        type: 'bar',
        data: {
            labels: ['Bangladesh', 'India', 'Pakistan', 'Sri Lanka', 'Nepal', 'Bhutan', 'Maldives'],
            datasets: [{
                label: 'People per km²',
                data: [1265, 464, 287, 368, 203, 43, 1719],
                backgroundColor: [
                    '#3498DB', '#3498DB', '#3498DB', '#3498DB', 
                    '#3498DB', '#3498DB', '#E67E22'  // Highlight Maldives
                ],
                borderColor: '#2C3E50',
                borderWidth: 1
            }]
        },
        options: {
            ...this.defaultOptions,
            plugins: {
                title: {
                    display: true,
                    text: 'South Asia: Population Density',
                    font: { size: 14, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: function(v) { return v + ' /km²'; } }
                }
            }
        }
    },

    /**
     * CHAPTER 10 - Southeast Asia
     * ASEAN Economic Growth
     */
    aseanGrowthChart: {
        type: 'line',
        data: {
            labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'],
            datasets: [{
                label: 'Average GDP Growth (%)',
                data: [4.8, 5.2, 5.4, 5.2, 3.7, 1.1, 3.2, 3.5],
                borderColor: '#1ABC9C',
                backgroundColor: 'rgba(26, 188, 156, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 3,
                pointRadius: 5,
                pointBackgroundColor: '#1ABC9C',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            ...this.defaultOptions,
            plugins: {
                title: {
                    display: true,
                    text: 'Southeast Asia: ASEAN Average GDP Growth',
                    font: { size: 14, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: function(v) { return v + '%'; } }
                }
            }
        }
    },

    /**
     * Helper: Create a chart with error handling
     */
    createChart: function(containerId, chartConfig) {
        const ctx = document.getElementById(containerId);
        if (!ctx) {
            console.warn(`Chart container ${containerId} not found`);
            return null;
        }

        try {
            // Ensure Chart is available (must be loaded via CDN)
            if (typeof Chart === 'undefined') {
                console.error('Chart.js library not loaded. Add CDN script tag.');
                return null;
            }

            return new Chart(ctx, chartConfig);
        } catch (error) {
            console.error(`Error creating chart ${containerId}:`, error);
            return null;
        }
    }
};
