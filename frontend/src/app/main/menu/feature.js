import Bb from 'backbone'
import { View } from 'backbone.marionette'
import template from './feature.hbs'

export default View.extend({
  template: template,

  initialize(feature) {
    this.feature = feature.values_
  },

  serializeData() {
    return {
      name: this.feature.name,
    }
  },
})
