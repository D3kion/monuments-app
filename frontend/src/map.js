import 'ol/ol.css'
import { Map, View } from 'ol'
import OSM from 'ol/source/OSM'
import Vector from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import ZoomToExtent from 'ol/control/ZoomToExtent'
import Bb from 'backbone'
import { View as MnView } from 'backbone.marionette'

import template from './templates/map.hbs'

export const MapView = MnView.extend({
  template: template,

  model: new Bb.Model(),

  ui: {
    logout: '#logout',
  },

  events: {
    'click @ui.logout': 'onLogout',
  },

  initialize() {
    this.initLayers()
    this.map = new Map({
      layers: [this.mainLayer, this.countryLayer, this.cityLayer],
      view: new View({
        projection: 'EPSG:4326',
        center: [39, 47],
        zoom: 5,
      }),
    })

    this.map.addControl(new ZoomToExtent({extent: [26, 34, 52, 60]}))


    console.log(this.map)


    this.model.on('change', this.render, this)
    this.getUsername()
  },

  onDomRefresh() {
    this.map.setTarget('#map') // hack
    this.map.setTarget('map') // hack
  },

  onLogout() {
    localStorage.removeItem('token')
    location.reload()
  },

  initLayers() {
    const url = 'http://' + location.hostname + ':8000/api/geo/'

    let countrySource = new Vector({
      format: new GeoJSON(),
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
      format: new GeoJSON(),
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
  },

  getUsername() {
    const url = 'http://' + location.hostname + ':8000/api/'
    fetch(url + 'token-info/', {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + localStorage.token
      }
    }).then(res => res.json())
      .then(data => this.model.set('name', data.user))
  }
})
