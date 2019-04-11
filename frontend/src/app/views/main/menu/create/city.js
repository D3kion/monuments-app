import Bb from 'backbone'
import { View } from 'backbone.marionette'
import fetch from '../../../../utils'
import template from './city.hbs'

export default View.extend({
  template: template,

  model: new Bb.Model({
    coords: null,
  }),

  ui: {
    country: '#country',
    name: '#name',
    description: '#description',
    place: '#place',
    submit: '#submit',
  },

  events: {
    'click @ui.place': 'onPlace',
    'click @ui.submit': 'onSubmit',
  },

  initialize(drawPoint) {
    this.drawPoint = drawPoint

    this.model.on('change', () => {
      if (!this.model.hasChanged('coords'))
        this.render()
    }, this)
    
    this.loadCountries()
  },

  onPlace() {
    this.drawPoint(this.model)
  },

  onSubmit() {
    if (this.model.get('coords') == null)
      return

    const name = this.getUI('name').val()
    const country = this.getUI('country').val()
    const description = this.getUI('description').val()
    const geometry = {
      type: 'Point',
      coordinates: this.model.get('coords')
    }

    fetch('POST', 'api/city/', JSON.stringify({
      name,
      country,
      description,
      geometry,
      image_set: [],
    }))
    .then(res => {
      if (res.ok) {
        this.triggerMethod('refresh:map', this)
        this.triggerMethod('close:menu', this)
      }
    })
  },

  loadCountries() {
    fetch('GET', 'api/info/country/')
    .then(res => res.json())
    .then(data => this.model.set('countries', data))
  },
})
