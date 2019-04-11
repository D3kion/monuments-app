import Bb from 'backbone'
import { View } from 'backbone.marionette'
import fetch from '../../../utils'
import template from './country.hbs'

export default View.extend({
  template: template,

  model: new Bb.Model(),

  events: {
    'click #submit': 'onSubmit',
    'change #country': 'onChangeCountry',
  },

  initialize() {
    this.model.on('change', this.render, this)
    this.loadCountries()
  },

  onSubmit() {
    // TODO: Move to models directory if need
    const Country = Bb.Model.extend({
      urlRoot: 'http://' + location.hostname + ':8000/api/country/',
      defaults: {
        name: '',
        geometry: '',
      },
    })

    const url = 'api/countries/' + this.model.get('countryHelperId') + '/'
    fetch('GET', url)
    .then(res => res.json())
    .then(data => {
      (new Country()).save({
        name: data.properties.name,
        geometry: data.geometry,
      },
      {
        success: (model) => {
          this.triggerMethod('refresh:map', this)
          this.triggerMethod('close:menu', this)
        },

        error: function(model, res) {
          console.error(res)
        }
      })
    })
  },
  
  onChangeCountry(e) {
    const countryHelper = this.model.get('countries').filter(x => x.id == e.target.value)[0]
    this.model.set({
      countryHelperId: countryHelper.id
    })
  },

  loadCountries() {
    fetch('GET', 'api/countries/')
    .then(res => res.json())
    .then(data => this.model.set({
      countries: data,
      countryHelperId: data[0].id,
    }))
  },
})
