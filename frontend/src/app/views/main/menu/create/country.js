import { View } from 'backbone.marionette'
import template from './country.hbs'
import CountryModel from 'Models/country'
import CountryHelpersCollection from 'Collections/countryHelpers'

export default View.extend({
  template: template,

  events: {
    'click #submit': 'onSubmit',
  },

  initialize() {
    this.countries = new CountryHelpersCollection()
    this.countries.on('add', this.render, this)
    this.countries.fetch()
  },

  serializeData: function() {
    return {
      countries: this.countries.toJSON(),
    }
  },

  onSubmit() {
    const $form = this.$el.find('form')
    const helperId = $form.serializeArray()[0].value
    this.countries.get(helperId).fetch({
      success: model => {
        (new CountryModel()).save({
          name: model.get('name'),
          geometry: model.get('geometry'),
        }, {
          success: () => {
            this.triggerMethod('refresh:map', this)
            this.triggerMethod('close:menu', this)
          },
  
          error: (_model, res) => console.error(res),
        })
      },

      error: (_model, res) => console.log(res),
    })
  },
})
