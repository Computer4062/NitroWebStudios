import express from 'express';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import fs from 'fs';
import path from 'path';

// Configure router
const router = express.Router();

// Configure client
const keyPath = path.resolve('./google-credentials.json');                                                    // MANUALLY CHECK THE FILE

if (fs.existsSync(keyPath)) {
    const content = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    console.log("✅ File found! Service Account Email:", content.client_email);
} else {
    console.error("❌ FILE NOT FOUND AT:", keyPath);
}

const analyticsClient = new BetaAnalyticsDataClient({
    keyFilename: './google-credentials.json', 
});

const getAnalyticsReport = async (propertyId) => {
    try {
        const [response] = await analyticsClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            dimensions: [
                { name: 'pagePath' }, 
                { name: 'date' }
            ],
            metrics: [{ name: 'activeUsers' }],
        });

        return response;
    } catch (err) {
        console.error('GA4 API Error:', err);
        throw err;
    }
};

router.get('/report', async (req, res) => {
    try {
        const propertyId = process.env.GA4_PROPERTY_ID;
        const data = await getAnalyticsReport(propertyId);

        // Process the data for the frontend
        const formattedData = {
            dailyLabels: [], // Extract from data.rows
            dailyValues: [], // Extract from data.rows
            pages: data.rows.map(row => ({
                url: row.dimensionValues.value,
                views: parseInt(row.metricValues.value)
            }))
        };

        res.status(200).json(formattedData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;