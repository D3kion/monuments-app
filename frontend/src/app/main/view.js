import Bb from 'backbone'
import { View } from 'backbone.marionette'
import template from './template.hbs'
import MapView from './map'
import MenuView from './menu/view'
import FeatureView from './menu/feature'

export default View.extend({
  template: template,

  model: new Bb.Model(),

  ui: {
    layers: '#layers',
    homeExtent: '#home-extent',
    logout: '#logout',
  },

  events: {
    'click @ui.layers': 'openLayers',
    'click @ui.homeExtent': 'onHomeExtent',
    'click @ui.logout': 'onLogout',
  },

  childViewEvents: {
    'close:menu': 'closeMenu',
    'open:feature': 'openFeature',
    'open:feature:id': 'openFeatureById',
  },

  initialize() {
    this.addRegions({
      menu: {
        el: '#menu-placeholder',
        replaceElement: true,
      },
      map: {
        el: '#map-placeholder',
        replaceElement: true,
      },
    })

    this.model.on('change', this.render, this)
    this.getUsername()
  },

  onRender() {
    this.map = new MapView()
    this.showChildView('map', this.map)
  },

  showMenu(view) {
    this.showChildView('menu', new MenuView({
      contentView: view
    }))
  },

  closeMenu() {
    this.getRegion('menu').empty()
    this.map.select.getFeatures().clear()
  },

  openLayers() {
    this.showMenu()
  },

  openFeature(view, feature) {
    if (feature !== undefined) {
      const type = feature.getGeometry().constructor.name === 'Point' ? 'city' : 'country'    
      this.showMenu(new FeatureView(type, feature.getId()))
    }
  },

  openFeatureById(view, feature) {
    const obj = Object.entries(feature)[0]
    this.showMenu(new FeatureView(obj[0], obj[1]))
  },

  onHomeExtent() {
    this.map.homeExtent()
  },

  onLogout() {
    localStorage.removeItem('token')
    location.reload()
  },

  getUsername() {
    const url = 'http://' + location.hostname + ':8000/api/token-info/'
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + localStorage.token
      }
    }).then(res => res.json())
      .then(data => this.model.set('name', data.user))
  },
})
