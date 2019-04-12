import { View } from 'backbone.marionette'
import template from './editCity.hbs'
import CountriesCollection from 'Collections/countries'

export default View.extend({
  template: template,

  events: {
    'click #submit': 'onSubmit',
  },

  initialize(feature) {
    this.feature = feature.clone()
    this.countries = new CountriesCollection()

    this.feature.on('change', this.render, this)
    this.countries.on('add', this.render, this)

    this.feature.fetch()
    this.countries.fetch()
  },

  serializeData() {
    return {
      feature: this.feature.toJSON(),
      countries: this.countries.toJSON().filter(x => x.id != this.feature.attributes.country.id)
    }
  },

  onSubmit() {
    const $form = this.$el.find('form')
    let data = {}
    $form.serializeArray().map(x => data[x.name] = x.value)

    this.feature.save({
      name: data.name,
      country_: data.country,
      description: data.description,
    }, {
      success: () => this.openFeature(),
      error: (_model, res) => console.error(res),
    })
  },

  openFeature() {
    this.triggerMethod('open:feature:id', this, {'city': this.feature.get('id')})
  },
})
