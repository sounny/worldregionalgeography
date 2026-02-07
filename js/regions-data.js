/**
 * World Regional Geography - Regional GeoJSON Data
 * Contains simplified boundaries that follow approximate landmass outlines
 * for the world regions studied in the textbook.
 * 
 * Note: These are pedagogical approximations, not precise political boundaries.
 */

const RegionalData = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "id": "europe",
            "properties": {
                "name": "Europe",
                "chapter": "../02-europe/index.html",
                "color": "var(--color-primary)",
                "theme": "Migration & Identity",
                "desc": "Exploring European integration, the legacy of industrialization, and the contemporary challenges of migration and cultural identity.",
                "link": "chapters/02-europe/index.html",
                "center": [
                    50,
                    10
                ]
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -10,
                            36
                        ],
                        [
                            -9,
                            38
                        ],
                        [
                            -9,
                            43
                        ],
                        [
                            -5,
                            44
                        ],
                        [
                            -2,
                            44
                        ],
                        [
                            3,
                            43
                        ],
                        [
                            5,
                            43
                        ],
                        [
                            8,
                            44
                        ],
                        [
                            12,
                            37
                        ],
                        [
                            18,
                            40
                        ],
                        [
                            20,
                            35
                        ],
                        [
                            26,
                            35
                        ],
                        [
                            29,
                            41
                        ],
                        [
                            28,
                            46
                        ],
                        [
                            40,
                            47
                        ],
                        [
                            32,
                            55
                        ],
                        [
                            28,
                            56
                        ],
                        [
                            24,
                            59
                        ],
                        [
                            28,
                            70
                        ],
                        [
                            25,
                            71
                        ],
                        [
                            18,
                            70
                        ],
                        [
                            10,
                            63
                        ],
                        [
                            5,
                            62
                        ],
                        [
                            5,
                            58
                        ],
                        [
                            8,
                            55
                        ],
                        [
                            4,
                            52
                        ],
                        [
                            -4,
                            50
                        ],
                        [
                            -6,
                            54
                        ],
                        [
                            -10,
                            52
                        ],
                        [
                            -5,
                            58
                        ],
                        [
                            -8,
                            58
                        ],
                        [
                            -6,
                            50
                        ],
                        [
                            -5,
                            48
                        ],
                        [
                            -2,
                            47
                        ],
                        [
                            -10,
                            36
                        ]
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "id": "russia",
            "properties": {
                "name": "Russia & Central Asia",
                "chapter": "../03-russia/index.html",
                "color": "#1e5f74",
                "theme": "Geopolitics & Energy",
                "desc": "Understanding the geopolitical transitions after the Soviet Union and the critical role of resource geography in global affairs.",
                "link": "chapters/03-russia/index.html",
                "center": [
                    60,
                    100
                ]
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            28,
                            70
                        ],
                        [
                            40,
                            68
                        ],
                        [
                            55,
                            70
                        ],
                        [
                            70,
                            73
                        ],
                        [
                            80,
                            74
                        ],
                        [
                            100,
                            78
                        ],
                        [
                            120,
                            74
                        ],
                        [
                            140,
                            72
                        ],
                        [
                            170,
                            70
                        ],
                        [
                            170,
                            65
                        ],
                        [
                            165,
                            60
                        ],
                        [
                            155,
                            50
                        ],
                        [
                            143,
                            47
                        ],
                        [
                            135,
                            43
                        ],
                        [
                            127,
                            42
                        ],
                        [
                            120,
                            50
                        ],
                        [
                            87,
                            50
                        ],
                        [
                            80,
                            45
                        ],
                        [
                            55,
                            37
                        ],
                        [
                            52,
                            37
                        ],
                        [
                            48,
                            42
                        ],
                        [
                            47,
                            45
                        ],
                        [
                            40,
                            47
                        ],
                        [
                            32,
                            55
                        ],
                        [
                            28,
                            56
                        ],
                        [
                            28,
                            70
                        ]
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "id": "north-america",
            "properties": {
                "name": "North America",
                "chapter": "../04-north-america/index.html",
                "color": "#f4a261",
                "theme": "Urbanization & Diversity",
                "desc": "Analyzing urban expansion, economic integration under USMCA, and the environmental challenges facing the US and Canada.",
                "link": "chapters/04-north-america/index.html",
                "center": [
                    45,
                    -100
                ]
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -168,
                            66
                        ],
                        [
                            -165,
                            70
                        ],
                        [
                            -145,
                            70
                        ],
                        [
                            -130,
                            72
                        ],
                        [
                            -95,
                            74
                        ],
                        [
                            -85,
                            70
                        ],
                        [
                            -70,
                            73
                        ],
                        [
                            -62,
                            67
                        ],
                        [
                            -55,
                            52
                        ],
                        [
                            -66,
                            44
                        ],
                        [
                            -70,
                            42
                        ],
                        [
                            -75,
                            35
                        ],
                        [
                            -80,
                            25
                        ],
                        [
                            -97,
                            26
                        ],
                        [
                            -105,
                            20
                        ],
                        [
                            -117,
                            32
                        ],
                        [
                            -124,
                            40
                        ],
                        [
                            -125,
                            48
                        ],
                        [
                            -130,
                            55
                        ],
                        [
                            -140,
                            60
                        ],
                        [
                            -150,
                            61
                        ],
                        [
                            -165,
                            55
                        ],
                        [
                            -168,
                            66
                        ]
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "id": "latin-america",
            "properties": {
                "name": "Latin America & Caribbean",
                "chapter": "../05-latin-america/index.html",
                "color": "#e07b3c",
                "theme": "Biodiversity & Inequality",
                "desc": "Studying the Amazonian ecosystems, the impact of colonialism on development, and the dynamics of urbanization in mega-cities.",
                "link": "chapters/05-latin-america/index.html",
                "center": [
                    -15,
                    -60
                ]
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -117,
                            32
                        ],
                        [
                            -105,
                            20
                        ],
                        [
                            -95,
                            16
                        ],
                        [
                            -87,
                            15
                        ],
                        [
                            -83,
                            8
                        ],
                        [
                            -77,
                            8
                        ],
                        [
                            -75,
                            10
                        ],
                        [
                            -62,
                            10
                        ],
                        [
                            -60,
                            14
                        ],
                        [
                            -60,
                            22
                        ],
                        [
                            -65,
                            18
                        ],
                        [
                            -77,
                            20
                        ],
                        [
                            -85,
                            22
                        ],
                        [
                            -97,
                            26
                        ],
                        [
                            -105,
                            20
                        ],
                        [
                            -77,
                            8
                        ],
                        [
                            -81,
                            2
                        ],
                        [
                            -80,
                            -4
                        ],
                        [
                            -70,
                            -18
                        ],
                        [
                            -70,
                            -27
                        ],
                        [
                            -72,
                            -40
                        ],
                        [
                            -75,
                            -53
                        ],
                        [
                            -68,
                            -55
                        ],
                        [
                            -65,
                            -50
                        ],
                        [
                            -58,
                            -38
                        ],
                        [
                            -53,
                            -34
                        ],
                        [
                            -48,
                            -28
                        ],
                        [
                            -42,
                            -23
                        ],
                        [
                            -35,
                            -7
                        ],
                        [
                            -50,
                            0
                        ],
                        [
                            -52,
                            5
                        ],
                        [
                            -60,
                            8
                        ],
                        [
                            -73,
                            12
                        ],
                        [
                            -83,
                            16
                        ],
                        [
                            -105,
                            20
                        ],
                        [
                            -117,
                            32
                        ]
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "id": "africa-sub",
            "properties": {
                "name": "Sub-Saharan Africa",
                "chapter": "../06-sub-saharan-africa/index.html",
                "color": "#2a9d8f",
                "theme": "Development & Global Health",
                "desc": "Examining rapid demographic shifts, resource management, and the cultural diversity that defines the African continent.",
                "link": "chapters/06-sub-saharan-africa/index.html",
                "center": [
                    0,
                    20
                ]
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -17,
                            15
                        ],
                        [
                            -15,
                            11
                        ],
                        [
                            -8,
                            5
                        ],
                        [
                            2,
                            6
                        ],
                        [
                            9,
                            4
                        ],
                        [
                            9,
                            10
                        ],
                        [
                            15,
                            13
                        ],
                        [
                            24,
                            12
                        ],
                        [
                            35,
                            12
                        ],
                        [
                            42,
                            11
                        ],
                        [
                            48,
                            9
                        ],
                        [
                            51,
                            2
                        ],
                        [
                            45,
                            -2
                        ],
                        [
                            40,
                            -10
                        ],
                        [
                            35,
                            -25
                        ],
                        [
                            32,
                            -28
                        ],
                        [
                            28,
                            -33
                        ],
                        [
                            18,
                            -34
                        ],
                        [
                            14,
                            -28
                        ],
                        [
                            12,
                            -18
                        ],
                        [
                            12,
                            -5
                        ],
                        [
                            9,
                            1
                        ],
                        [
                            6,
                            4
                        ],
                        [
                            -5,
                            5
                        ],
                        [
                            -17,
                            12
                        ],
                        [
                            -17,
                            15
                        ]
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "id": "mena",
            "properties": {
                "name": "North Africa & SW Asia",
                "chapter": "../07-north-africa-sw-asia/index.html",
                "color": "#40c9b8",
                "theme": "Water & Conflict",
                "desc": "The geography of arid landscapes, the geopolitics of petroleum, and the cultural significance of the region as a hearth of civilization.",
                "link": "chapters/07-north-africa-sw-asia/index.html",
                "center": [
                    28,
                    30
                ]
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -17,
                            28
                        ],
                        [
                            -8,
                            32
                        ],
                        [
                            0,
                            36
                        ],
                        [
                            10,
                            37
                        ],
                        [
                            25,
                            32
                        ],
                        [
                            32,
                            31
                        ],
                        [
                            35,
                            32
                        ],
                        [
                            36,
                            35
                        ],
                        [
                            42,
                            37
                        ],
                        [
                            44,
                            33
                        ],
                        [
                            48,
                            30
                        ],
                        [
                            56,
                            25
                        ],
                        [
                            60,
                            25
                        ],
                        [
                            53,
                            15
                        ],
                        [
                            43,
                            13
                        ],
                        [
                            38,
                            15
                        ],
                        [
                            32,
                            22
                        ],
                        [
                            24,
                            22
                        ],
                        [
                            15,
                            24
                        ],
                        [
                            0,
                            22
                        ],
                        [
                            -10,
                            22
                        ],
                        [
                            -17,
                            21
                        ],
                        [
                            -17,
                            28
                        ]
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "id": "south-asia",
            "properties": {
                "name": "South Asia",
                "chapter": "../08-south-asia/index.html",
                "color": "#e76f51",
                "theme": "Population & Monsoons",
                "desc": "Analyzing the challenges of high population density, climate vulnerability in low-lying regions, and India's economic rise.",
                "link": "chapters/08-south-asia/index.html",
                "center": [
                    22,
                    78
                ]
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            61,
                            25
                        ],
                        [
                            67,
                            24
                        ],
                        [
                            72,
                            21
                        ],
                        [
                            73,
                            16
                        ],
                        [
                            77,
                            8
                        ],
                        [
                            80,
                            6
                        ],
                        [
                            82,
                            8
                        ],
                        [
                            85,
                            14
                        ],
                        [
                            89,
                            21
                        ],
                        [
                            92,
                            22
                        ],
                        [
                            97,
                            28
                        ],
                        [
                            96,
                            28
                        ],
                        [
                            92,
                            27
                        ],
                        [
                            88,
                            27
                        ],
                        [
                            80,
                            30
                        ],
                        [
                            77,
                            35
                        ],
                        [
                            71,
                            37
                        ],
                        [
                            66,
                            37
                        ],
                        [
                            62,
                            35
                        ],
                        [
                            61,
                            25
                        ]
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "id": "east-asia",
            "properties": {
                "name": "East Asia",
                "chapter": "../09-east-asia/index.html",
                "color": "#264653",
                "theme": "Industrialization & Growth",
                "desc": "Tracking the dramatic economic shift of China, the technologic power of Japan, and the environmental costs of rapid growth.",
                "link": "chapters/09-east-asia/index.html",
                "center": [
                    35,
                    115
                ]
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            73,
                            40
                        ],
                        [
                            80,
                            45
                        ],
                        [
                            87,
                            50
                        ],
                        [
                            120,
                            50
                        ],
                        [
                            127,
                            42
                        ],
                        [
                            129,
                            40
                        ],
                        [
                            130,
                            33
                        ],
                        [
                            131,
                            34
                        ],
                        [
                            140,
                            36
                        ],
                        [
                            145,
                            44
                        ],
                        [
                            141,
                            45
                        ],
                        [
                            135,
                            35
                        ],
                        [
                            128,
                            35
                        ],
                        [
                            122,
                            25
                        ],
                        [
                            117,
                            24
                        ],
                        [
                            108,
                            18
                        ],
                        [
                            106,
                            22
                        ],
                        [
                            98,
                            24
                        ],
                        [
                            97,
                            28
                        ],
                        [
                            80,
                            32
                        ],
                        [
                            73,
                            40
                        ]
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "id": "southeast-asia",
            "properties": {
                "name": "Southeast Asia",
                "chapter": "../10-southeast-asia/index.html",
                "color": "#287271",
                "theme": "Globalization & Maritime Trade",
                "desc": "The strategic importance of the Malacca Strait, biodiversity in tropical rainforests, and the economic integration of ASEAN.",
                "link": "chapters/10-southeast-asia/index.html",
                "center": [
                    5,
                    115
                ]
            },
            "geometry": {
                "type": "MultiPolygon",
                "coordinates": [
                    [
                        [
                            [
                                92,
                                22
                            ],
                            [
                                94,
                                16
                            ],
                            [
                                98,
                                10
                            ],
                            [
                                103,
                                2
                            ],
                            [
                                104,
                                1
                            ],
                            [
                                103,
                                -1
                            ],
                            [
                                106,
                                6
                            ],
                            [
                                109,
                                12
                            ],
                            [
                                108,
                                21
                            ],
                            [
                                106,
                                22
                            ],
                            [
                                98,
                                24
                            ],
                            [
                                92,
                                22
                            ]
                        ]
                    ],
                    [
                        [
                            [
                                95,
                                5
                            ],
                            [
                                98,
                                -1
                            ],
                            [
                                105,
                                -6
                            ],
                            [
                                115,
                                -8
                            ],
                            [
                                120,
                                -10
                            ],
                            [
                                127,
                                -8
                            ],
                            [
                                135,
                                -6
                            ],
                            [
                                141,
                                -5
                            ],
                            [
                                141,
                                -9
                            ],
                            [
                                127,
                                -10
                            ],
                            [
                                118,
                                -5
                            ],
                            [
                                117,
                                1
                            ],
                            [
                                120,
                                5
                            ],
                            [
                                127,
                                2
                            ],
                            [
                                125,
                                -1
                            ],
                            [
                                119,
                                -4
                            ],
                            [
                                114,
                                -3
                            ],
                            [
                                110,
                                1
                            ],
                            [
                                104,
                                1
                            ],
                            [
                                100,
                                -1
                            ],
                            [
                                95,
                                5
                            ]
                        ]
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "id": "oceania",
            "properties": {
                "name": "Australia & Oceania",
                "chapter": "../11-australia-oceania/index.html",
                "color": "#8ab17d",
                "theme": "Island Risk & Resilience",
                "desc": "Studying sea-level rise in the Pacific, the unique physical geography of the Outback, and indigenous land rights.",
                "link": "chapters/11-australia-oceania/index.html",
                "center": [
                    -25,
                    140
                ]
            },
            "geometry": {
                "type": "MultiPolygon",
                "coordinates": [
                    [
                        [
                            [
                                114,
                                -22
                            ],
                            [
                                113,
                                -25
                            ],
                            [
                                115,
                                -34
                            ],
                            [
                                122,
                                -34
                            ],
                            [
                                136,
                                -35
                            ],
                            [
                                144,
                                -38
                            ],
                            [
                                150,
                                -38
                            ],
                            [
                                154,
                                -28
                            ],
                            [
                                146,
                                -19
                            ],
                            [
                                142,
                                -11
                            ],
                            [
                                136,
                                -12
                            ],
                            [
                                129,
                                -15
                            ],
                            [
                                123,
                                -16
                            ],
                            [
                                114,
                                -22
                            ]
                        ]
                    ],
                    [
                        [
                            [
                                166,
                                -46
                            ],
                            [
                                168,
                                -47
                            ],
                            [
                                171,
                                -44
                            ],
                            [
                                174,
                                -42
                            ],
                            [
                                178,
                                -37
                            ],
                            [
                                175,
                                -35
                            ],
                            [
                                172,
                                -40
                            ],
                            [
                                166,
                                -46
                            ]
                        ]
                    ],
                    [
                        [
                            [
                                141,
                                -5
                            ],
                            [
                                145,
                                -5
                            ],
                            [
                                150,
                                -5
                            ],
                            [
                                152,
                                -4
                            ],
                            [
                                148,
                                -10
                            ],
                            [
                                143,
                                -9
                            ],
                            [
                                141,
                                -5
                            ]
                        ]
                    ]
                ]
            }
        }
    ]
};

window.WorldRegionsData = RegionalData;
