import json

# Define the regions mapping (country code to region ID)
# Using ISO 3166-1 alpha-3 codes which are standard in most GeoJSONs
REGION_MAPPING = {
    # EUROPE (Chapter 2)
    'AUT': 'europe', 'BEL': 'europe', 'BGR': 'europe', 'HRV': 'europe', 'CYP': 'europe',
    'CZE': 'europe', 'DNK': 'europe', 'EST': 'europe', 'FIN': 'europe', 'FRA': 'europe',
    'DEU': 'europe', 'GRC': 'europe', 'HUN': 'europe', 'IRL': 'europe', 'ITA': 'europe',
    'LVA': 'europe', 'LTU': 'europe', 'LUX': 'europe', 'MLT': 'europe', 'NLD': 'europe',
    'POL': 'europe', 'PRT': 'europe', 'ROU': 'europe', 'SVK': 'europe', 'SVN': 'europe',
    'ESP': 'europe', 'SWE': 'europe', 'GBR': 'europe', 'ISL': 'europe', 'NOR': 'europe',
    'CHE': 'europe', 'ALB': 'europe', 'BIH': 'europe', 'MKD': 'europe', 'MNE': 'europe',
    'SRB': 'europe', 'XKX': 'europe', 'AND': 'europe', 'LIE': 'europe', 'MCO': 'europe',
    'SMR': 'europe', 'VAT': 'europe', 'BLR': 'europe', 'UKR': 'europe', 'MDA': 'europe',

    # RUSSIA & CENTRAL ASIA (Chapter 3)
    'RUS': 'russia', 'KAZ': 'russia', 'KGZ': 'russia', 'TJK': 'russia', 'TKM': 'russia',
    'UZB': 'russia', 'GEO': 'russia', 'ARM': 'russia', 'AZE': 'russia',

    # NORTH AMERICA (Chapter 4)
    'USA': 'north-america', 'CAN': 'north-america', 'GRL': 'north-america',

    # LATIN AMERICA (Chapter 5)
    'MEX': 'latin-america', 'GTM': 'latin-america', 'BLZ': 'latin-america', 'SLV': 'latin-america',
    'HND': 'latin-america', 'NIC': 'latin-america', 'CRI': 'latin-america', 'PAN': 'latin-america',
    'COL': 'latin-america', 'VEN': 'latin-america', 'GUY': 'latin-america', 'SUR': 'latin-america',
    'ECU': 'latin-america', 'PER': 'latin-america', 'BRA': 'latin-america', 'BOL': 'latin-america',
    'PRY': 'latin-america', 'URY': 'latin-america', 'ARG': 'latin-america', 'CHL': 'latin-america',
    'CUB': 'latin-america', 'HTI': 'latin-america', 'DOM': 'latin-america', 'JAM': 'latin-america',
    'BHS': 'latin-america', 'TTO': 'latin-america', 'BRB': 'latin-america', 'LCA': 'latin-america',
    'VCT': 'latin-america', 'GRD': 'latin-america', 'ATG': 'latin-america', 'DMA': 'latin-america',
    'KNA': 'latin-america',

    # SUB-SAHARAN AFRICA (Chapter 6)
    'MRT': 'africa-sub', 'SEN': 'africa-sub', 'GMB': 'africa-sub', 'CPV': 'africa-sub',
    'MLI': 'africa-sub', 'BFA': 'africa-sub', 'NER': 'africa-sub', 'NGA': 'africa-sub',
    'BEN': 'africa-sub', 'TGO': 'africa-sub', 'GHA': 'africa-sub', 'CIV': 'africa-sub',
    'LBR': 'africa-sub', 'SLE': 'africa-sub', 'GIN': 'africa-sub', 'GNB': 'africa-sub',
    'CMR': 'africa-sub', 'CAF': 'africa-sub', 'TCD': 'africa-sub', 'SDN': 'africa-sub',
    'SSD': 'africa-sub', 'ETH': 'africa-sub', 'ERI': 'africa-sub', 'DJI': 'africa-sub',
    'SOM': 'africa-sub', 'KEN': 'africa-sub', 'UGA': 'africa-sub', 'RWA': 'africa-sub',
    'BDI': 'africa-sub', 'TZA': 'africa-sub', 'COD': 'africa-sub', 'COG': 'africa-sub',
    'GAB': 'africa-sub', 'GNQ': 'africa-sub', 'STP': 'africa-sub', 'AGO': 'africa-sub',
    'ZMB': 'africa-sub', 'MWI': 'africa-sub', 'MOZ': 'africa-sub', 'ZWE': 'africa-sub',
    'BWA': 'africa-sub', 'NAM': 'africa-sub', 'ZAF': 'africa-sub', 'LSO': 'africa-sub',
    'SWZ': 'africa-sub', 'MDG': 'africa-sub', 'MUS': 'africa-sub', 'SYC': 'africa-sub',
    'COM': 'africa-sub',

    # NORTH AFRICA & SW ASIA (Chapter 7)
    'MAR': 'mena', 'DZA': 'mena', 'TUN': 'mena', 'LBY': 'mena', 'EGY': 'mena',
    'ISR': 'mena', 'LBN': 'mena', 'JOR': 'mena', 'SYR': 'mena', 'IRQ': 'mena',
    'SAU': 'mena', 'YEM': 'mena', 'OMN': 'mena', 'ARE': 'mena', 'QAT': 'mena',
    'BHR': 'mena', 'KWT': 'mena', 'TUR': 'mena', 'IRN': 'mena', 'PSE': 'mena',
    'ESH': 'mena',

    # SOUTH ASIA (Chapter 8)
    'AFG': 'south-asia', 'PAK': 'south-asia', 'IND': 'south-asia', 'NPL': 'south-asia',
    'BTN': 'south-asia', 'BGD': 'south-asia', 'LKA': 'south-asia', 'MDV': 'south-asia',

    # EAST ASIA (Chapter 9)
    'CHN': 'east-asia', 'MNG': 'east-asia', 'PRK': 'east-asia', 'KOR': 'east-asia',
    'JPN': 'east-asia', 'TWN': 'east-asia',

    # SOUTHEAST ASIA (Chapter 10)
    'MMR': 'southeast-asia', 'THA': 'southeast-asia', 'LAO': 'southeast-asia',
    'VNM': 'southeast-asia', 'KHM': 'southeast-asia', 'MYS': 'southeast-asia',
    'SGP': 'southeast-asia', 'IDN': 'southeast-asia', 'BRN': 'southeast-asia',
    'PHL': 'southeast-asia', 'TLS': 'southeast-asia',

    # OCEANIA (Chapter 11)
    'AUS': 'oceania', 'NZL': 'oceania', 'PNG': 'oceania', 'SLB': 'oceania',
    'VUT': 'oceania', 'NCL': 'oceania', 'FJI': 'oceania', 'TON': 'oceania',
    'WSM': 'oceania', 'KIR': 'oceania', 'MHL': 'oceania', 'FSM': 'oceania',
    'PLW': 'oceania', 'NRU': 'oceania', 'TUV': 'oceania'
}

REGION_METADATA = {
    "europe": {
        "name": "Europe",
        "chapter": "../02-europe/index.html",
        "color": "#4A90A4"
    },
    "russia": {
        "name": "Russia & Central Asia",
        "chapter": "../03-russia/index.html",
        "color": "#7B68EE"
    },
    "north-america": {
        "name": "North America",
        "chapter": "../04-north-america/index.html",
        "color": "#2E8B57"
    },
    "latin-america": {
        "name": "Latin America & Caribbean",
        "chapter": "../05-latin-america/index.html",
        "color": "#DAA520"
    },
    "africa-sub": {
        "name": "Sub-Saharan Africa",
        "chapter": "../06-sub-saharan-africa/index.html",
        "color": "#CD853F"
    },
    "mena": {
        "name": "North Africa & SW Asia",
        "chapter": "../07-north-africa-sw-asia/index.html",
        "color": "#DC143C"
    },
    "south-asia": {
        "name": "South Asia",
        "chapter": "../08-south-asia/index.html",
        "color": "#FF8C00"
    },
    "east-asia": {
        "name": "East Asia",
        "chapter": "../09-east-asia/index.html",
        "color": "#FF4500"
    },
    "southeast-asia": {
        "name": "Southeast Asia",
        "chapter": "../10-southeast-asia/index.html",
        "color": "#32CD32"
    },
    "oceania": {
        "name": "Australia & Oceania",
        "chapter": "../11-australia-oceania/index.html",
        "color": "#9370DB"
    }
}

def create_regions_geojson():
    with open('countries.geo.json', 'r', encoding='utf-8') as f:
        countries_data = json.load(f)

    # Initialize regions dictionary to store geometries
    regions = {rid: [] for rid in REGION_METADATA.keys()}

    # Assign countries to regions
    for feature in countries_data['features']:
        iso_code = feature['id']

        # Handle cases where ID might be in properties or different format
        if not iso_code and 'properties' in feature and 'iso_a3' in feature['properties']:
             iso_code = feature['properties']['iso_a3']

        if iso_code in REGION_MAPPING:
            region_id = REGION_MAPPING[iso_code]
            # We are just collecting the MultiPolygons/Polygons here
            # In a real GIS workflow we would union them, but without Shapely/Turf
            # we will create a MultiPolygon of all country polygons for the region.

            geom = feature['geometry']
            if geom['type'] == 'Polygon':
                regions[region_id].append(geom['coordinates'])
            elif geom['type'] == 'MultiPolygon':
                regions[region_id].extend(geom['coordinates'])

    # Construct the final GeoJSON
    final_features = []

    for rid, coords_list in regions.items():
        if not coords_list:
            continue

        feature = {
            "type": "Feature",
            "id": rid,
            "properties": REGION_METADATA[rid],
            "geometry": {
                "type": "MultiPolygon",
                "coordinates": coords_list
            }
        }
        final_features.append(feature)

    final_geojson = {
        "type": "FeatureCollection",
        "features": final_features
    }

    # Write to file formatted as a JS variable
    with open('js/regions-data.js', 'w', encoding='utf-8') as f:
        f.write("/**\n")
        f.write(" * World Regional Geography - Regional GeoJSON Data\n")
        f.write(" * Generated from high-quality country boundaries.\n")
        f.write(" */\n\n")
        f.write("const RegionalData = ")
        json.dump(final_geojson, f)  # Minified for size
        f.write(";\n\n")
        f.write("window.WorldRegionsData = RegionalData;\n")

    print(f"Successfully generated js/regions-data.js with {len(final_features)} regions.")

if __name__ == "__main__":
    create_regions_geojson()
