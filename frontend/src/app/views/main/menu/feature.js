import Bb from 'backbone'
import { View } from 'backbone.marionette'
// TODO
import fetch from '../../../utils'
import template from './feature.hbs'

export default View.extend({
  template: template,

  model: new Bb.Model(),

  events: {
    'click .clickable': 'openFeature',
    'click #edit': 'editFeature',
    'click #delete': 'deleteFeature',
  },

  initialize(type, id) {
    this.model.on('change', this.render, this)
    this.loadFeatureInfo(type, id)
  },

  openFeature(e) {
    this.triggerMethod('open:feature:id', this, e.target.dataset)
  },

  editFeature() {
    // const type = this.model.get('type')
    const id = this.model.get('id')

    // if (type === 'country')
    //   this.triggerMethod('edit:feature:country', this, id)
    // else
    this.triggerMethod('edit:feature:city', this, id)
  },

  deleteFeature() {
    // TODO
    const type = this.model.get('type')
    const id = this.model.get('id')
    const url = 'api/' + type + '/' + id + '/'
    fetch('DELETE', url)
    .then(() => {
      this.triggerMethod('refresh:map', this)
      this.triggerMethod('close:menu', this)
    })
      
  },

  loadFeatureInfo(type, id) {
    // TODO
    const url = 'api/info/' + type + '/' + id + '/'
    fetch('GET', url)
    .then(res => res.json())
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
