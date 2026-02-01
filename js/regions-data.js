/**
 * World Regional Geography - Regional GeoJSON Data
 * Contains simplified boundaries that follow approximate landmass outlines
 * for the world regions studied in the textbook.
 * 
 * Note: These are pedagogical approximations, not precise political boundaries.
 */

const RegionalData = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            id: "europe",
            properties: { 
                name: "Europe", 
                chapter: "../02-europe/index.html",
                color: "#4A90A4"
            },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-10, 36],   // Portugal/Spain SW
                    [-9, 38],    // Portugal coast
                    [-9, 43],    // NW Spain
                    [-5, 44],    // N Spain
                    [-2, 44],    // Pyrenees
                    [3, 43],     // S France
                    [5, 43],     // French Riviera
                    [8, 44],     // NW Italy
                    [12, 37],    // S Italy
                    [18, 40],    // Adriatic
                    [20, 35],    // Greece S
                    [26, 35],    // Crete
                    [29, 41],    // Turkey/Europe border
                    [28, 46],    // Black Sea coast
                    [40, 47],    // Ukraine/Russia border
                    [32, 55],    // Belarus
                    [28, 56],    // Baltic states
                    [24, 59],    // Estonia
                    [28, 70],    // N Finland
                    [25, 71],    // Norway N
                    [18, 70],    // N Norway
                    [10, 63],    // Norway coast
                    [5, 62],     // Norway
                    [5, 58],     // S Norway
                    [8, 55],     // Denmark
                    [4, 52],     // Netherlands
                    [-4, 50],    // Channel
                    [-6, 54],    // Ireland
                    [-10, 52],   // W Ireland
                    [-5, 58],    // Scotland
                    [-8, 58],    // W Scotland
                    [-6, 50],    // SW Britain
                    [-5, 48],    // Brittany
                    [-2, 47],    // W France
                    [-10, 36]    // Close polygon
                ]]
            }
        },
        {
            type: "Feature",
            id: "russia",
            properties: { 
                name: "Russia & Central Asia", 
                chapter: "../03-russia/index.html",
                color: "#7B68EE"
            },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [28, 70],    // Finland border
                    [40, 68],    // Kola
                    [55, 70],    // Arkhangelsk
                    [70, 73],    // Yamal
                    [80, 74],    // W Siberia
                    [100, 78],   // Taymyr
                    [120, 74],   // Laptev Sea coast
                    [140, 72],   // E Siberia
                    [170, 70],   // Chukotka
                    [170, 65],   // NE Russia
                    [165, 60],   // Sea of Okhotsk
                    [155, 50],   // Kamchatka
                    [143, 47],   // Sakhalin
                    [135, 43],   // Vladivostok
                    [127, 42],   // China border
                    [120, 50],   // Mongolia border
                    [87, 50],    // Kazakhstan border
                    [80, 45],    // Central Asia
                    [55, 37],    // Turkmenistan
                    [52, 37],    // Caspian S
                    [48, 42],    // Caspian
                    [47, 45],    // N Caspian
                    [40, 47],    // Ukraine border
                    [32, 55],    // Belarus border
                    [28, 56],    // Baltic
                    [28, 70]     // Close polygon
                ]]
            }
        },
        {
            type: "Feature",
            id: "north-america",
            properties: { 
                name: "North America", 
                chapter: "../04-north-america/index.html",
                color: "#2E8B57"
            },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-168, 66],  // Alaska
                    [-165, 70],  // N Alaska
                    [-145, 70],  // Yukon coast
                    [-130, 72],  // NWT
                    [-95, 74],   // Nunavut
                    [-85, 70],   // Hudson Bay N
                    [-70, 73],   // Baffin
                    [-62, 67],   // Labrador N
                    [-55, 52],   // Newfoundland
                    [-66, 44],   // Nova Scotia
                    [-70, 42],   // New England
                    [-75, 35],   // E Coast
                    [-80, 25],   // Florida
                    [-97, 26],   // Texas Gulf
                    [-105, 20], // Mexico border (approx)
                    [-117, 32],  // SW US
                    [-124, 40],  // W Coast
                    [-125, 48],  // Pacific NW
                    [-130, 55],  // BC
                    [-140, 60],  // Alaska border
                    [-150, 61],  // S Alaska
                    [-165, 55],  // Aleutians
                    [-168, 66]   // Close polygon
                ]]
            }
        },
        {
            type: "Feature",
            id: "latin-america",
            properties: { 
                name: "Latin America & Caribbean", 
                chapter: "../05-latin-america/index.html",
                color: "#DAA520"
            },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-117, 32],  // Baja California
                    [-105, 20],  // W Mexico
                    [-95, 16],   // S Mexico
                    [-87, 15],   // Central America
                    [-83, 8],    // Costa Rica
                    [-77, 8],    // Panama
                    [-75, 10],   // Colombia
                    [-62, 10],   // Venezuela
                    [-60, 14],   // Caribbean
                    [-60, 22],   // Caribbean N
                    [-65, 18],   // Puerto Rico
                    [-77, 20],   // Jamaica/Cuba
                    [-85, 22],   // Cuba
                    [-97, 26],   // Gulf of Mexico
                    [-105, 20],  // Loop back inland
                    [-77, 8],    // Colombia
                    [-81, 2],    // Ecuador
                    [-80, -4],   // Peru
                    [-70, -18],  // Bolivia
                    [-70, -27],  // N Chile
                    [-72, -40],  // S Chile
                    [-75, -53],  // Patagonia
                    [-68, -55],  // Tierra del Fuego
                    [-65, -50],  // Argentina S
                    [-58, -38],  // Buenos Aires
                    [-53, -34],  // Uruguay
                    [-48, -28],  // S Brazil
                    [-42, -23],  // Rio
                    [-35, -7],   // NE Brazil
                    [-50, 0],    // Amazon mouth
                    [-52, 5],    // Guiana
                    [-60, 8],    // Venezuela
                    [-73, 12],   // Colombia N
                    [-83, 16],   // Central America
                    [-105, 20],  // Mexico
                    [-117, 32]   // Close polygon
                ]]
            }
        },
        {
            type: "Feature",
            id: "africa-sub",
            properties: { 
                name: "Sub-Saharan Africa", 
                chapter: "../06-sub-saharan-africa/index.html",
                color: "#CD853F"
            },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-17, 15],   // Senegal
                    [-15, 11],   // Guinea-Bissau
                    [-8, 5],     // Ivory Coast
                    [2, 6],      // Ghana/Togo
                    [9, 4],      // Nigeria S
                    [9, 10],     // Nigeria N
                    [15, 13],    // Chad S
                    [24, 12],    // Sudan S
                    [35, 12],    // Ethiopia W
                    [42, 11],    // Ethiopia
                    [48, 9],     // Somalia N
                    [51, 2],     // Somalia E
                    [45, -2],    // Kenya coast
                    [40, -10],   // Tanzania
                    [35, -25],   // Mozambique
                    [32, -28],   // South Africa E
                    [28, -33],   // South Africa S
                    [18, -34],   // Cape Town
                    [14, -28],   // Namibia
                    [12, -18],   // Angola
                    [12, -5],    // Gabon
                    [9, 1],      // Cameroon coast
                    [6, 4],      // Nigeria W
                    [-5, 5],     // Liberia
                    [-17, 12],   // Senegal
                    [-17, 15]    // Close polygon
                ]]
            }
        },
        {
            type: "Feature",
            id: "mena",
            properties: { 
                name: "North Africa & SW Asia", 
                chapter: "../07-north-africa-sw-asia/index.html",
                color: "#DC143C"
            },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-17, 28],   // W Sahara
                    [-8, 32],    // Morocco
                    [0, 36],     // Algeria N
                    [10, 37],    // Tunisia
                    [25, 32],    // Libya
                    [32, 31],    // Egypt (Mediterranean)
                    [35, 32],    // Israel
                    [36, 35],    // Syria
                    [42, 37],    // Turkey SE
                    [44, 33],    // Iraq
                    [48, 30],    // Kuwait
                    [56, 25],    // UAE
                    [60, 25],    // Oman
                    [53, 15],    // Yemen
                    [43, 13],    // Yemen W
                    [38, 15],    // Eritrea
                    [32, 22],    // Egypt S
                    [24, 22],    // Libya S
                    [15, 24],    // Algeria S
                    [0, 22],     // Mali/Algeria
                    [-10, 22],   // Mauritania
                    [-17, 21],   // W Sahara S
                    [-17, 28]    // Close polygon
                ]]
            }
        },
        {
            type: "Feature",
            id: "south-asia",
            properties: { 
                name: "South Asia", 
                chapter: "../08-south-asia/index.html",
                color: "#FF8C00"
            },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [61, 25],    // Pakistan W (Balochistan)
                    [67, 24],    // Pakistan S coast
                    [72, 21],    // Gujarat
                    [73, 16],    // Goa
                    [77, 8],     // Kerala
                    [80, 6],     // Sri Lanka
                    [82, 8],     // Sri Lanka E
                    [85, 14],    // E India
                    [89, 21],    // Bangladesh
                    [92, 22],    // Bangladesh E
                    [97, 28],    // Myanmar border
                    [96, 28],    // NE India
                    [92, 27],    // Bhutan
                    [88, 27],    // Nepal E
                    [80, 30],    // Nepal W
                    [77, 35],    // Kashmir
                    [71, 37],    // Afghanistan
                    [66, 37],    // Afghanistan W
                    [62, 35],    // Pakistan NW
                    [61, 25]     // Close polygon
                ]]
            }
        },
        {
            type: "Feature",
            id: "east-asia",
            properties: { 
                name: "East Asia", 
                chapter: "../09-east-asia/index.html",
                color: "#FF4500"
            },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [73, 40],    // Xinjiang W
                    [80, 45],    // Kazakhstan border
                    [87, 50],    // Mongolia W
                    [120, 50],   // Mongolia E
                    [127, 42],   // NE China
                    [129, 40],   // Korea N
                    [130, 33],   // Korea S
                    [131, 34],   // Japan SW
                    [140, 36],   // Japan central
                    [145, 44],   // Japan N (Hokkaido)
                    [141, 45],   // Japan NE
                    [135, 35],   // Japan W coast
                    [128, 35],   // Korea Strait
                    [122, 25],   // Taiwan
                    [117, 24],   // S China coast
                    [108, 18],   // Hainan
                    [106, 22],   // Vietnam border
                    [98, 24],    // Myanmar border
                    [97, 28],    // Tibet E
                    [80, 32],    // Tibet W
                    [73, 40]     // Close polygon
                ]]
            }
        },
        {
            type: "Feature",
            id: "southeast-asia",
            properties: { 
                name: "Southeast Asia", 
                chapter: "../10-southeast-asia/index.html",
                color: "#32CD32"
            },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    // Mainland SE Asia
                    [[
                        [92, 22],    // Myanmar W
                        [94, 16],    // Myanmar S
                        [98, 10],    // Thailand S
                        [103, 2],    // Malaysia
                        [104, 1],    // Singapore
                        [103, -1],   // Sumatra
                        [106, 6],    // Vietnam S
                        [109, 12],   // Vietnam central
                        [108, 21],   // Vietnam N
                        [106, 22],   // China border
                        [98, 24],    // Myanmar N
                        [92, 22]     // Close polygon
                    ]],
                    // Indonesian Archipelago
                    [[
                        [95, 5],     // Sumatra N
                        [98, -1],    // Sumatra S
                        [105, -6],   // Java W
                        [115, -8],   // Java E / Bali
                        [120, -10],  // Nusa Tenggara
                        [127, -8],   // Timor
                        [135, -6],   // Papua W
                        [141, -5],   // Papua E
                        [141, -9],   // Papua S
                        [127, -10],  // Timor Sea
                        [118, -5],   // Kalimantan S
                        [117, 1],    // Kalimantan E
                        [120, 5],    // Sulawesi
                        [127, 2],    // Maluku
                        [125, -1],   // Sulawesi S
                        [119, -4],   // Sulawesi SW
                        [114, -3],   // Kalimantan S
                        [110, 1],    // Kalimantan W
                        [104, 1],    // Singapore/Malaysia
                        [100, -1],   // Sumatra E
                        [95, 5]      // Close polygon
                    ]]
                ]
            }
        },
        {
            type: "Feature",
            id: "oceania",
            properties: { 
                name: "Australia & Oceania", 
                chapter: "../11-australia-oceania/index.html",
                color: "#9370DB"
            },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    // Australia
                    [[
                        [114, -22],  // W Australia N
                        [113, -25],  // W Australia
                        [115, -34],  // Perth
                        [122, -34],  // Great Aust Bight
                        [136, -35],  // S Australia
                        [144, -38],  // Victoria
                        [150, -38],  // NSW S
                        [154, -28],  // Queensland
                        [146, -19],  // Great Barrier Reef
                        [142, -11],  // Cape York
                        [136, -12],  // NT N
                        [129, -15],  // Darwin
                        [123, -16],  // Kimberley
                        [114, -22]   // Close polygon
                    ]],
                    // New Zealand
                    [[
                        [166, -46],  // NZ South Island SW
                        [168, -47],  // Fiordland
                        [171, -44],  // Christchurch
                        [174, -42],  // Cook Strait
                        [178, -37],  // East Cape
                        [175, -35],  // Auckland
                        [172, -40],  // Wellington
                        [166, -46]   // Close polygon
                    ]],
                    // Papua New Guinea
                    [[
                        [141, -5],   // PNG W border
                        [145, -5],   // PNG N coast
                        [150, -5],   // New Britain
                        [152, -4],   // PNG NE
                        [148, -10],  // PNG S
                        [143, -9],   // Torres Strait
                        [141, -5]    // Close polygon
                    ]]
                ]
            }
        }
    ]
};

window.WorldRegionsData = RegionalData;
