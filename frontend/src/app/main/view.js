import Bb from 'backbone'
import { View } from 'backbone.marionette'

import { MapView } from './map'
import template from './template.hbs'

export const MainView = View.extend({
  template: template,

  model: new Bb.Model(),

  region: {
    'mapRegion': '#map',
  },

  ui: {
    homeExtent: '#home-extent',
    logout: '#logout',
  },

  events: {
    'click @ui.homeExtent': 'onHomeExtent',
    'click @ui.logout': 'onLogout',
  },

  initialize() {
    this.model.on('change', this.render, this)
    this.getUsername()
  },

  onRender() {
    this.map = new MapView()
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
