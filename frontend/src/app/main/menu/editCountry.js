import Bb from 'backbone'
import { View } from 'backbone.marionette'
import template from './editCountry.hbs'

export default View.extend({
  template: template,

  model: new Bb.Model(),
  
  ui: {
    submit: '#submit',
  },

  events: {
    'click @ui.submit': 'onSubmit',
  },

  initialize(id) {
    this.model.on('change', this.render, this)
    this.loadFeatureInfo(id)
  },

  onSubmit() {
    const url = 'http://' + location.hostname + ':8000/api/geo/country/'
        fetch(url + id + '/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.token,
          },
          body: JSON.stringify({
            name: this.model.get('countryName'),
            geometry: this.model.get('countryGeometry'),
          }),
        }).then(res => res.json())
          .then(data => {
            if (typeof data.id !== 'undefined') {
              this.triggerMethod('refresh:map', this)
              this.loadCountries()
            }
            else
              console.log('Ошибка: ', data)
          })
  },

  openFeature(e) {
    this.triggerMethod('open:feature:id', this, {type: 'country', id})
  },

  loadFeatureInfo(id) {
    const url = 'http://' + location.hostname + ':8000/api/geo/info/country/'
    fetch(url + id + '/', {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + localStorage.token,
      }
    }).then(res => res.json())
      .then(data => {
        this.model.set('id', id)
        this.model.set('name', data.name)
        this.model.set('capital', data.capital)
        this.model.set('city_set', data.city_set)
        console.log(this.model)
      })
  },
})
