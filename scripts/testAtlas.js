import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as topojson from 'topojson-client';
import * as d3Geo from 'd3-geo';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read world-atlas and us-atlas
const worldAtlasPath = path.join(__dirname, '../node_modules/world-atlas/countries-110m.json');
const usAtlasPath = path.join(__dirname, '../node_modules/us-atlas/states-10m.json');

const worldData = JSON.parse(fs.readFileSync(worldAtlasPath, 'utf8'));
const usData = JSON.parse(fs.readFileSync(usAtlasPath, 'utf8'));

// Convert TopoJSON to GeoJSON features
const worldFeatures = topojson.feature(worldData, worldData.objects.countries).features;
const usFeatures = topojson.feature(usData, usData.objects.states).features;

console.log(`Loaded ${worldFeatures.length} world country features and ${usFeatures.length} US state features.`);
