import Bb from 'backbone'
import { View } from 'backbone.marionette'
import template from './search.hbs'

export default View.extend({
  template: template,

  model: new Bb.Model(),
  
  ui: {
    feature: '.clickable',
  },

  events: {
    'click @ui.feature': 'openFeature'
  },

  initialize(list) {
    this.model.on('change', this.render, this)
    this.model.set('list', list)
  },

  openFeature(e) {
    this.triggerMethod('open:feature:id', this, e.target.dataset)
  },
})
