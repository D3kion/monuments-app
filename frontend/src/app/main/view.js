import Bb from 'backbone'
import { View } from 'backbone.marionette'
import template from './template.hbs'
import MapView from './map'
import MenuView from './menu/view'
import FeatureView from './menu/feature'
import SearchView from './menu/search'
import CreateView from './menu/create'

export default View.extend({
  template: template,

  model: new Bb.Model(),

  ui: {
    layers: '#layers',
    create: '#create',
    homeExtent: '#home-extent',
    logout: '#logout',
    search: '#search',
  },

  events: {
    'click @ui.layers': 'openLayers',
    'click @ui.create': 'openCreate',
    'click @ui.homeExtent': 'onHomeExtent',
    'click @ui.logout': 'onLogout',
    'keyup @ui.search': 'searchFeature',
  },

  childViewEvents: {
    'close:menu': 'closeMenu',
    'open:feature': 'openFeature',
    'open:feature:id': 'openFeatureById',
    'refresh:map': 'refreshMap',
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

  searchFeature(e) {
    if (e.keyCode == 13)
      this.showMenu(new SearchView(e.target.value))
  },

  showMenu(view) {
    this.showChildView('menu', new MenuView({ contentView: view }))
  },

  closeMenu() {
    this.getRegion('menu').empty()
    this.map.select.getFeatures().clear()
  },

  openLayers() {
    this.showMenu()
  },

  openCreate() {
    this.showMenu(new CreateView())
  },

  openFeature(view, feature) {
    if (feature !== undefined) {
      const type = feature.getGeometry().constructor.name === 'Point' ? 'city' : 'country'    
      this.showMenu(new FeatureView(type, feature.getId()))
    } else {
      this.closeMenu()
    }
  },

  openFeatureById(view, feature) {
    const type = Object.entries(feature)[0][0]
    const id = Object.entries(feature)[0][1]

    this.showMenu(new FeatureView(type, id))
    
    this.map.select.getFeatures().clear()
    this.map.select.getFeatures().push(this.getFeature(type, id))
  },
  
  refreshMap() {
    this.map.loadLayers()
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

  getFeature(type, id) {
    if (type == 'city')
      return this.map.cityLayer.getSource().getFeatureById(id)
    else
      return this.map.countryLayer.getSource().getFeatureById(id)
  }
})
