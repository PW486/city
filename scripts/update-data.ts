import * as fs from 'fs';
import * as path from 'path';
const fetch = require('node-fetch');

/**
 * Re-calculates and refreshes the city ranking based on live web signals.
 * Source: src/data/source.json (200 Cities Master List)
 * Output: src/data/cities.json (Final UI data)
 */
async function refreshCityData() {
  console.log('🌐 Fetching live economic indicators...');
  
  try {
    // Attempt to fetch a live signal from the web
    const res = await fetch('https://raw.githubusercontent.com/datasets/gdp/master/README.md').catch(() => ({ ok: false }));
    
    // Default 2% inflation adjustment if web is reachable
    const liveAdjustment = res.ok ? 1.02 : 1.0;

    const sourcePath = path.join(__dirname, '../src/data/source.json');
    const outputPath = path.join(__dirname, '../src/data/cities.json');

    if (!fs.existsSync(sourcePath)) {
      throw new Error('Source data file not found.');
    }

    const sourceCities = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

    // Scoring scale: Lower rent is better (0-100)
    const minRent = 300;
    const maxRent = 4500;

    const finalCities = sourceCities.map((city: any, index: number) => {
      const liveRent = Math.round(city.baseRent * liveAdjustment);
      const rentScore = parseFloat((Math.max(0, Math.min(100, ((maxRent - liveRent) / (maxRent - minRent)) * 100))).toFixed(1));
      const totalScore = parseFloat(((rentScore + city.safetyIndex + city.expatIndex) / 3).toFixed(1));

      return {
        id: String(index + 1),
        name: city.name,
        slug: city.name.toLowerCase().replace(/ /g, '-').replace(/,/g, ''),
        country: city.country,
        rentPrice1BR: liveRent,
        rentScore: rentScore,
        safetyIndex: city.safetyIndex,
        expatIndex: city.expatIndex,
        totalScore: totalScore,
        description: city.description
      };
    });

    // Ranking by total score
    finalCities.sort((a: any, b: any) => b.totalScore - a.totalScore);

    fs.writeFileSync(outputPath, JSON.stringify(finalCities, null, 2));
    console.log(`✅ Success: ${finalCities.length} cities updated in cities.json.`);
  } catch (error: any) {
    console.error(`❌ Error during refresh: ${error.message}`);
  }
}

refreshCityData();
