import Bb from 'backbone'
import { View } from 'backbone.marionette'
import fetch from '../../utils'
import template from './create.hbs'

export default View.extend({
  template: template,

  model: new Bb.Model({
    isCountry: true
  }),

  ui: {
    choose: '.choose',
    country: '#country',
    submit: '#submit',
  },

  events: {
    'click @ui.choose': 'onChoose',
    'click @ui.submit': 'onSubmit',
  },

  initialize() {
    this.model.on('change', this.render, this)
    this.loadCountries()
  },

  onChoose(e) {
    this.model.set('isCountry', false)
    this.model.set('isCity', false)
    this.model.set('isCapital', false)

    switch (e.target.dataset.choose) {
      case 'country':
        this.model.set('isCountry', true)
        break;
      case 'city':
        this.model.set('isCity', true)
        break;
      case 'capital':
        this.model.set('isCapital', true)
        break;
    }
  },

  onSubmit() {
    if (this.model.get('isCountry'))
      this.onSubmitCountry()

  },

  onSubmitCountry() {
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
