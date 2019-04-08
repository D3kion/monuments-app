import Bb from 'backbone'
import { View } from 'backbone.marionette'
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
    const url = 'http://' + location.hostname + ':8000/api/geo/countries/' + this.model.get('countryId') + '/'
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + localStorage.token,
      },
    }).then(res => res.json())
      .then(data => {
        this.model.set('countryGeometry', data.geometry)

        const url = 'http://' + location.hostname + ':8000/api/geo/country/'
        fetch(url, {
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
              alert('Страна (' + data.properties.name + ') добавлена!')
            }
            else
              console.log('Ошибка: ', data)
          })
      })

  },

  loadCountries() {
    const url = 'http://' + location.hostname + ':8000/api/geo/countries/'
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + localStorage.token
      }
    }).then(res => res.json())
      .then(data => {
        this.model.set('countries', data)
        console.log(data)
        if (data.length > 0) {
          this.model.set('countryName', data[0].name)
          this.model.set('countryId', data[0].id)
        }
      })
  },
})
