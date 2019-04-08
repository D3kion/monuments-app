import 'ol/ol.css'
import * as proj from 'ol/proj'
import { Map, View } from 'ol'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import Polygon from 'ol/geom/Polygon'
import MultiPolygon from 'ol/geom/MultiPolygon'
import OSM from 'ol/source/OSM'
import Vector from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import Select from 'ol/interaction/Select.js'
import { never } from 'ol/events/condition'
import { View as MnView } from 'backbone.marionette'
import template from './map.hbs'

export default MnView.extend({
  template: template,
  
  initialize() {
    this.map = new Map({
      layers: [],
      view: new View({
        center: proj.transform([39, 47], 'EPSG:4326', 'EPSG:3857'),
        zoom: 4,
      }),
      controls: [],
    })
    
    this.select = new Select({
      toggleCondition: never
    })
    this.map.addInteraction(this.select)
    this.select.on('select', this.onSelect.bind(this))
    this.loadLayers()
  },

  onDomRefresh() {
    this.map.setTarget('map')
  },

  onSelect(e) {
    const feature = e.target.getFeatures().getArray()[0]
    this.triggerMethod('open:feature', this, feature)
  },

  homeExtent() {
    this.map.setView(new View({
      center: proj.transform([39, 47], 'EPSG:4326', 'EPSG:3857'),
      zoom: 4,
    }))
  },

  loadLayers() {
    const url = 'http://' + location.hostname + ':8000/api/geo/geojson/'

    let countrySource = new Vector({
      format: new GeoJSON({
        defaultDataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      }),
      loader: function() {
        fetch(url + 'country/', {
          method: 'GET',
          headers: {
            'Authorization': 'Token ' + localStorage.token
          }
        }).then(res => res.json())
          .then(data => {
            countrySource.addFeatures(
              countrySource.getFormat().readFeatures(data))
          })
      }
    })
    
    let citySource = new Vector({
      format: new GeoJSON({
        defaultDataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      }),
      loader: function() {
        fetch(url + 'city/', {
          method: 'GET',
          headers: {
            'Authorization': 'Token ' + localStorage.token
          }
        }).then(res => res.json())
          .then(data => {
            citySource.addFeatures(
              citySource.getFormat().readFeatures(data))
          })
      }
    })

    this.mainLayer = new TileLayer({
      source: new OSM(),
    })
    
    this.countryLayer = new VectorLayer({
      source: countrySource
    })
    
    this.cityLayer = new VectorLayer({
      source: citySource
    })

    this.map.addLayer(this.mainLayer)
    this.map.addLayer(this.countryLayer)
    this.map.addLayer(this.cityLayer)
  },
})
