import Bb from 'backbone'
import { View } from 'backbone.marionette'
import fetch from '../../utils'
import template from './editCity.hbs'

export default View.extend({
  template: template,

  model: new Bb.Model(),
  
  ui: {
    city: '#city',
    country: '#country',
    description: '#description',
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
    const id = this.model.get('id')
    const url = 'api/edit/city/' + id + '/'
    fetch('PUT', url, JSON.stringify({
      name: this.getUI('city').val(),
      country: this.getUI('country').val(),
      description: this.getUI('description').val(),
    }))
    .then(() => this.openFeature())
  },

  openFeature() {
    const id = this.model.get('id')
    this.triggerMethod('open:feature:id', this, {'city': id})
  },

  loadFeatureInfo(id) {
    const url = 'api/info/city/' + id + '/'
    fetch('GET', url)
    .then(res => res.json())
    .then(data => {
      this.model.set('id', id)
      this.model.set('name', data.name)
      this.model.set('country', data.country)
      this.model.set('description', data.description)
      this.model.set('images', data.images)

      fetch('GET', 'api/search/country/')
      .then(res => res.json())
      .then(data => {
        const countries = data.filter(x => x.id != this.model.get('country').id)
        this.model.set('countryList', countries)
      })
    })
  },
})
