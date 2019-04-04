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
        capital: this.feature.capital_name,
        city_set: this.feature.cities
      }
    else
      return {
        isCountry,
        name: this.feature.name,
        country: this.feature.country_name,
        description: this.feature.description,
        // photos
      }
  },
})
