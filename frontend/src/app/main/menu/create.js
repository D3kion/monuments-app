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
    'click @ui.country': 'onCountrySelect',
    'click @ui.submit': 'onSubmit',
  },

  initialize() {
    this.model.on('change:countries', this.render, this)
    this.model.on('change:isCountry', this.render, this)
    this.loadCountries()
  },

  onChoose(e) {
    if (e.target.dataset.choose == 'country')
      this.model.set('isCountry', true)
    else
      this.model.set('isCountry', false)
  },

  onCountrySelect(e) {
    this.model.set('countryName', e.target.value)
    this.model.set('countryId', e.target.children[e.target.selectedIndex].dataset.id)
  },

  onSubmit() {
    const url = 'api/geo/countries/' + this.model.get('countryId') + '/'
    fetch('GET', url)
    .then(res => res.json())
    .then(data => {
      this.model.set('countryGeometry', data.geometry)

      fetch('POST', 'api/geo/country/', JSON.stringify({
        name: this.model.get('countryName'),
        geometry: this.model.get('countryGeometry'),
      }))
      .then(res => res.json())
      .then(data => {
        if (typeof data.id !== 'undefined') {
          this.triggerMethod('refresh:map', this)
          this.loadCountries()
        }
        else
          console.log('Ошибка: ', data)
      })
    })

  },

  loadCountries() {
    fetch('GET', 'api/geo/countries/')
    .then(res => res.json())
    .then(data => {
      this.model.set('countries', data)
      if (data.length > 0) {
        this.model.set('countryName', data[0].name)
        this.model.set('countryId', data[0].id)
      }
    })
  },
})
