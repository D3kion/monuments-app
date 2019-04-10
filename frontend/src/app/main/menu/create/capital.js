import Bb from 'backbone'
import { View } from 'backbone.marionette'
import fetch from '../../../utils'
import template from './capital.hbs'

export default View.extend({
  template: template,

  model: new Bb.Model(),

  ui: {
    country: '#country',
    city: '#city',
    submit: '#submit',
  },

  events: {
    'change @ui.country': 'onCountry',
    'click @ui.submit': 'onSubmit',
  },

  initialize() {
    this.model.on('change', this.render, this)

    this.loadCountries()
  },

  onRender() {
    this.getUI('country').val(this.model.get('selectedCountry'))
  },

  onCountry() {
    const id = this.getUI('country').val()
    const cities = this.model.get('countries')
                    .filter((x) => x.id == id)[0].city_set

    this.model.set({
      'selectedCountry': id,
      'cities': cities,
    })
  },

  onSubmit() {
    const capital_of = this.getUI('country').val()
    const city = this.getUI('city').val()

    if (city == -1)
      return

    fetch('POST', 'api/geo/capital/', JSON.stringify({
      capital_of,
      city,
    }))
    .then(res => {
      if (res.ok) {
        this.triggerMethod('refresh:map', this)
        this.triggerMethod('close:menu', this)
      }
    })
  },

  loadCountries() {
    fetch('GET', 'api/geo/info/country/')
    .then(res => res.json())
    .then(data => {
      data = data.filter((x) => x.capital == null)
      this.model.set({
        'countries': data,
        'selectedCountry': data[0].id,
        'cities': data[0].city_set,
      })
    })
  },
})
