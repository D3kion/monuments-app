import Bb from 'backbone'
import { View } from 'backbone.marionette'
import template from './country.hbs'

// TODO: Move to models directory if need
const Country = Bb.Model.extend({
  urlRoot: 'http://' + location.hostname + ':8000/api/country/',
})

const CountryHelper = Bb.Model.extend({
  urlRoot: 'http://' + location.hostname + ':8000/api/countries/',
})

const CountryHelpers = Bb.Collection.extend({
  url: 'http://' + location.hostname + ':8000/api/countries/',
  model: CountryHelper,
})

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
        },
        {
          success: (model) => {
            this.triggerMethod('refresh:map', this)
            this.triggerMethod('close:menu', this)
          },
  
          error: function(model, res) {
            console.error(res)
          }
        })
      }
    })
  },
})
