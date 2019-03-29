import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM'

const layer = new TileLayer({
  source: new OSM(),
});

const view = new View({
  center: [0, 0],
  zoom: 3,
});

const map = new Map({
  target: 'map',
  layers: [layer],
  view: view,
});

/*

// Obtaining loken
const tokenAuthUrl = 'http://127.0.0.1:8000/geoapi/api-token-auth/'
let token
fetch(tokenAuthUrl, {
  method: 'POST',
  headers: {
    "Content-Type": "application/json"
  }, 
  body: JSON.stringify({
    username: 'dekion',
    password: 'salikov'
  })
}).then(res => res.json()).then(data => token = data.token)

// Get countries object
const countryurl = 'http://127.0.0.1:8000/geoapi/country/'
fetch(countryurl, {
  method: 'GET',
  headers: {
    "Authorization": "Token " + token
  }
}).then(res => res.json()).then(data => console.log(data))

*/
