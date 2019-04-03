import Bb from 'backbone'
import { View } from 'backbone.marionette'
import template from './template.hbs'
import { MapView } from './map'
import { MenuView } from './menu/view'

export const MainView = View.extend({
  template: template,

  model: new Bb.Model(),

  ui: {
    layers: '#layers',
    homeExtent: '#home-extent',
    logout: '#logout',
  },

  events: {
    'click @ui.layers': 'onLayers',
    'click @ui.homeExtent': 'onHomeExtent',
    'click @ui.logout': 'onLogout',
  },

  initialize() {
    this.addRegions({
      menu: {
        el: '#menu-placeholder',
        replaceElement: true,
      }
    })

    this.model.on('change', this.render, this)
    this.getUsername()
  },

  onRender() {
    this.map = new MapView()
  },

  onLayers() {
    this.getRegion('menu').show(new MenuView())
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
