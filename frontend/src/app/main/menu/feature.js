import Bb from 'backbone'
import { View } from 'backbone.marionette'
import template from './feature.hbs'

export default View.extend({
  template: template,

  model: new Bb.Model(),
  
  ui: {
    feature: '.clickable',
    edit: '#edit',
    delete : '#delete',
  },

  events: {
    'click @ui.feature': 'openFeature',
    'click @ui.edit': 'editFeature',
    'click @ui.delete': 'deleteFeature',
  },

  initialize(type, id) {
    this.model.on('change', this.render, this)
    this.loadFeatureInfo(type, id)
  },

  openFeature(e) {
    this.triggerMethod('open:feature:id', this, e.target.dataset)
  },

  editFeature() {
    const type = this.model.get('type')
    const id = this.model.get('id')

    // if (type === 'country')
    //   this.triggerMethod('edit:feature:country', this, id)
    // else
    this.triggerMethod('edit:feature:city', this, id)
  },

  deleteFeature() {
    const type = this.model.get('type')
    const id = this.model.get('id')
    const url = 'http://' + location.hostname + ':8000/api/geo/'
    fetch(url + type + '/' + id, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Token ' + localStorage.token,
      },
    }).then(() => {
      this.triggerMethod('refresh:map', this)
      this.triggerMethod('close:menu', this)
    })
      
  },

  loadFeatureInfo(type, id) {
    const url = 'http://' + location.hostname + ':8000/api/geo/info/'
    fetch(url + type + '/' + id + '/', {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + localStorage.token,
      }
    }).then(res => res.json())
      .then(data => {
        this.model.set('isCountry', type === 'country')
        this.model.set('id', id)
        this.model.set('type', type)
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
