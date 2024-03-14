import axios from 'axios';
import xml2js from 'xml2js';

// URL to fetch XML data from
const url = 'http://www.pohodovynakup.cz/export/productsComplete.xml?patternId=-5&partnerId=8&hash=25b0e061a07c76e7a2606179b039a186d03f478b8322c51c376829914d5bbb7d';

// Function to fetch XML data
async function fetchXML(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching XML:', error);
        throw error; // Rethrow the error to handle it later
    }
}

// Function to parse XML data
function parseXML(xmlData) {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xmlData, (err, result) => {
            if (err) {
                reject('Error parsing XML:', err);
            } else {
                resolve(result.SHOP.SHOPITEM.map(rearrangeData));
            }
        });
    });
}

// Function to rearrange data
function rearrangeData(original) {
    return {
        id: original.$.id,
        guid: original.GUID,
        short_description: original.SHORT_DESCRIPTION,
        description: original.SHORT_DESCRIPTION,
        manufacturer: original.MANUFACTURER,
    };
}

// Function to fetch and process data
async function fetchData() {
    try {
        const xmlData = await fetchXML(url);
        const items = await parseXML(xmlData);
        console.log('Fetched and processed data:', items.length);
        return items; // Return the processed data
    } catch (error) {
        console.error('Error:', error);
        throw error; // Rethrow the error to handle it later
    }
}

// Fetch data initially
fetchData();

// Schedule fetching every hour
const interval = 60 * 60 * 1000; // 1 hour in milliseconds
setInterval(fetchData, interval);
