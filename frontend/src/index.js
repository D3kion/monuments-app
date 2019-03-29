import 'ol/ol.css'
import { Map, View } from 'ol'
import OSM from 'ol/source/OSM'
import Vector from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'

let view = new View({
  projection: 'EPSG:4326',
  center: [39, 47],
  zoom: 5,
})

let layer = new TileLayer({
  source: new OSM(),
})

let countrySource = new Vector({
  format: new GeoJSON(),
  loader: function() {
    const url = 'http://127.0.0.1:8000/geoapi/country/'
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Token 4bdcd987799c8a78fcb57a10a9756ddcc7a31f59'
      }
    }).then(res => res.json())
      .then(data => {
        console.log(data)
        countrySource.addFeatures(countrySource.getFormat().readFeatures(data))
        console.log(countrySource.getFeatures())
      })
  }
})

let citySource = new Vector({
  format: new GeoJSON(),
  loader: function() {
    const url = 'http://127.0.0.1:8000/geoapi/city/'
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Token 4bdcd987799c8a78fcb57a10a9756ddcc7a31f59'
      }
    }).then(res => res.json())
      .then(data => {
        console.log(data)
        citySource.addFeatures(citySource.getFormat().readFeatures(data))
        console.log(citySource.getFeatures())
      })
  }
})

let countryLayer = new VectorLayer({
  source: countrySource
})

let cityLayer = new VectorLayer({
  source: citySource
}) 

let map = new Map({
  target: 'map',
  layers: [layer, countryLayer, cityLayer],
  view: view,
})

/*

Login page (Obtaining token) -> Map

// document.location.hostname

// Obtaining loken
const tokenAuthUrl = 'http://127.0.0.1:8000/geoapi/api-token-auth/'
let token
fetch(tokenAuthUrl, {
  method: 'POST',
  headers: {
    "Content-Type": "application/json"
  }, 
  body: JSON.stringify({
    username: 'admin',
    password: 'qwerty12+'
  })
}).then(res => res.json()).then(data => token = data.token)
*/
