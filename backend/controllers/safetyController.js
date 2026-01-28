const axios = require('axios');

const getGeospatialContext = (lat) => ({
    is_police_station: lat > 12.95 ? 1 : 0,
    residence_level: 2,
    cctv_coverage: 1,
    historical_crime_rate: lat > 12.96 ? 1 : 0,
    weather_condition: 0 
});

exports.getSafetyRisk = async (req, res) => {
    try {
        const { lat, lng, people_freq, lighting_score, is_wine_shop, image } = req.body;
        const geo = getGeospatialContext(lat);

        const payload = {
            features: {
                lat: parseFloat(lat), log: parseFloat(lng),
                hour_of_day: new Date().getHours(),
                is_weekend: [0, 6].includes(new Date().getDay()) ? 1 : 0,
                people_freq, is_wine_shop, lighting_score,
                is_police_station: geo.is_police_station,
                residence_level: geo.residence_level,
                cctv_coverage: geo.cctv_coverage,
                historical_crime_rate: geo.historical_crime_rate,
                weather_condition: geo.weather_condition
            },
            image: image 
        };

        const mlResponse = await axios.post('http://127.0.0.1:8000/analyze_all', payload);
        res.json(mlResponse.data);
    } catch (err) {
        res.status(500).json({ error: "AI Service Offline" });
    }
};
// const axios = require('axios');

// // --- HELPER: MOCK GEOSPATIAL DATABASE ---
// // This simulates fetching data from Google Places or a Crime DB
// const getGeospatialContext = (lat, lng) => {
//     // Example: If user is near Katpadi (lat ~12.96), set higher crime/cctv
//     const isNearBusyArea = lat > 12.95; 
    
//     return {
//         is_police_station: isNearBusyArea ? 1 : 0,
//         residence_level: lat > 12.92 ? 3 : 1, // 3: High Residential, 1: Isolated
//         cctv_coverage: isNearBusyArea ? 1 : 0,
//         historical_crime_rate: (lat > 12.96 && lng > 79.13) ? 1 : 0,
//         weather_condition: 0 // 0: Clear, 1: Storm (Could fetch from OpenWeather)
//     };
// };

// exports.getSafetyRisk = async (req, res) => {
//     try {
//         const { lat, lng, people_freq, lighting_score, is_wine_shop } = req.body;
        
//         // 1. Automatic Temporal Data
//         const now = new Date();
//         const hour_of_day = now.getHours();
//         const is_weekend = [0, 6].includes(now.getDay()) ? 1 : 0;

//         // 2. Fetch/Mock the 5 "Hidden" Features
//         const geoContext = getGeospatialContext(lat, lng);

//         // 3. Assemble the 12-Feature Payload for Python
//         const payload = {
//             lat: parseFloat(lat),
//             log: parseFloat(lng),
//             hour_of_day,
//             is_weekend,
//             people_freq: parseInt(people_freq),
//             is_police_station: geoContext.is_police_station,
//             is_wine_shop: parseInt(is_wine_shop),
//             residence_level: geoContext.residence_level,
//             lighting_score: parseInt(lighting_score),
//             cctv_coverage: geoContext.cctv_coverage,
//             historical_crime_rate: geoContext.historical_crime_rate,
//             weather_condition: geoContext.weather_condition
//         };

//         console.log("Enriched AI Payload:", payload);

//         // 4. Send to Python ML Service
//         const mlResponse = await axios.post('http://127.0.0.1:8000/predict_safety', payload);
        
//         // 5. Send result back to React
//         res.json(mlResponse.data);

//     } catch (err) {
//         console.error("Enrichment/ML Error:", err.message);
//         res.status(500).json({ error: "Safety analysis failed" });
//     }
// };