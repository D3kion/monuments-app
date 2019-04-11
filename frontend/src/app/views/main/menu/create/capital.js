import { View } from 'backbone.marionette'
import template from './capital.hbs'
import CapitalModel from 'Models/capital'
import CountriesCollection from 'Collections/countries'

export default View.extend({
  template: template,

  events: {
    'change #country': 'onChangeCountry',
    'click #submit': 'onSubmit',
  },

  initialize() {
    this.countries = new CountriesCollection()
    this.countries.on('add', this.render, this)
    this.countries.fetch({
      success: collection => this.cities = collection.models[0].get('city_set')
    })
  },

  serializeData() {
    return {
      countries: this.countries.toJSON().filter(x => x.capital == null),
      cities: this.cities,
    }
  },

  onRender() {
    if (typeof this.activeCountry !== 'undefined')
      this.$el.find('#country').val(this.activeCountry)
  },

  onChangeCountry(e) {
    const countryId = e.target.value
    this.cities = this.countries.get(countryId).get('city_set')
    this.activeCountry = countryId
    this.render()
  },

  onSubmit() {
    const $form = this.$el.find('form')
    let data = {}
    $form.serializeArray().map(x => data[x.name] = x.value)

    ;(new CapitalModel()).save({
      capital_of: data.country,
      city: data.city,
    }, {
      success: () => {
        this.triggerMethod('refresh:map', this)
        this.triggerMethod('close:menu', this)
      },

      error: (_model, res) => console.error(res),
    })
  },
})
