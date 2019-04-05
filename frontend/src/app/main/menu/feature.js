import Bb from 'backbone'
import { View } from 'backbone.marionette'
import template from './feature.hbs'

export default View.extend({
  template: template,

  model: new Bb.Model(),
  
  ui: {
    feature: '.clickable',
  },

  events: {
    'click @ui.feature': 'openFeature'
  },

  initialize(type, id) {

    this.model.on('change', this.render, this)
    this.loadFeatureInfo(type, id)
  },

  openFeature(e) {
    this.triggerMethod('open:feature:id', this, e.target.dataset)
  },

  loadFeatureInfo(type, id) {
    const url = 'http://' + location.hostname + ':8000/api/geo/info/'
    fetch(url + type + '/' + id, {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + localStorage.token
      }
    }).then(res => res.json())
      .then(data => {
        this.model.set('isCountry', type === 'country')
        this.model.set('name', data.name)

        if (type === 'country') {
          this.model.set('capital', data.capital)
          this.model.set('city_set', data.city_set)
        } else { // city
          this.model.set('country', data.country)
          this.model.set('description', data.description)
          this.model.set('images', data.images)
        }
      })
  },
})
