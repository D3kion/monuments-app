import Bb from 'backbone'
import { View } from 'backbone.marionette'
import template from './template.hbs'
import MapView from './map'
import MenuView from './menu/view'

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

  showMenu() {
    this.showChildView('menu', new MenuView())
  },

  closeMenu() {
    this.getRegion('menu').empty()
  },

  openLayers() {
    this.showMenu()
  },

  openFeature(view, feature) {
    console.log(feature)
    this.showMenu()
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
