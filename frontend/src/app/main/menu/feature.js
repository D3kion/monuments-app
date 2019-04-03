import Bb from 'backbone'
import { View } from 'backbone.marionette'
import template from './feature.hbs'

export default View.extend({
  template: template,

  initialize(feature) {
    this.feature = feature.values_
  },

  serializeData() {
    const isCountry = this.feature.city_set !== undefined

    if (isCountry)
      return {
        isCountry,
        name: this.feature.name,
        // capital, city_set
      }
    else
      return {
        isCountry,
        name: this.feature.name,
        // country, description, photos
      }
  },
})
