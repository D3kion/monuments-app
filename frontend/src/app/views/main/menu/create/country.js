import Bb from 'backbone'
import { View } from 'backbone.marionette'
import template from './country.hbs'
import CountryHelpers from 'Collections/countryHelpers'
import Country from 'Models/country'

export default View.extend({
  template: template,

  collection: new CountryHelpers(),

  events: {
    'click #submit': 'onSubmit',
    'change #country': 'onChangeCountry',
  },

  initialize() {
    this.collection.on('add', this.render, this)

    this.collection.fetch()
  },

  serializeData: function() {
    return this.collection.toJSON()
  },

  onSubmit() {
    const $form = this.$el.find('form')
    const helperId = $form.serializeArray()[0].value
    this.collection.get(helperId).fetch({
      success: model => {
        (new Country()).save({
          name: model.get('name'),
          geometry: model.get('geometry'),
        }, {
          success: model => {
            this.triggerMethod('refresh:map', this)
            this.triggerMethod('close:menu', this)
          },
  
          error: (model, res) => console.error(res),
        })
      },

      error: (model, res) => console.log(res),
    })
  },
})
