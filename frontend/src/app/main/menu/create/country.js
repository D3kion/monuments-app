import Bb from 'backbone'
import { View } from 'backbone.marionette'
import fetch from '../../../utils'
import template from './country.hbs'

export default View.extend({
  template: template,

  model: new Bb.Model(),

  ui: {
    country: '#country',
    submit: '#submit',
  },

  events: {
    'click @ui.submit': 'onSubmit',
  },

  initialize() {
    this.model.on('change', this.render, this)
    this.loadCountries()
  },

  onSubmit() {
    const id = this.getUI('country').val()
    const itemId = this.getUI('country').prop('selectedIndex')
    const name = this.getUI('country').prop('options').item(itemId).text

    const url = 'api/geo/countries/' + id + '/'
    fetch('GET', url)
    .then(res => res.json())
    .then(data => {
      fetch('POST', 'api/geo/country/', JSON.stringify({
        name,
        geometry: data.geometry,
      }))
      .then(res => {
        if (res.ok) {
          this.triggerMethod('refresh:map', this)
          this.loadCountries()
        }
      })
    })
  },

  loadCountries() {
    fetch('GET', 'api/geo/countries/')
    .then(res => res.json())
    .then(data => this.model.set('countries', data))
  },
})
