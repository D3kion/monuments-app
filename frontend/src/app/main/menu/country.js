import Bb from 'backbone'
import { View } from 'backbone.marionette'
import template from './country.hbs'

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
