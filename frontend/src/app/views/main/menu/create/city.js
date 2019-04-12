import { View } from 'backbone.marionette'
import template from './city.hbs'
import fetch from '../../../../utils'
import CityModel from 'Models/city'
import CountriesCollection from 'Collections/countries'

export default View.extend({
  template: template,

  events: {
    'change #images': 'onChangeImages',
    'click #place': 'onPlace',
    'click #submit': 'onSubmit',
  },

  initialize(drawPoint) {
    this.drawPoint = drawPoint
    this.city = new CityModel()
    this.countries = new CountriesCollection()

    this.countries.on('add', this.render, this)
    
    this.countries.fetch()
  },

  serializeData() {
    return {
      countries: this.countries.toJSON()
    }
  },

  onChangeImages(e) {
    this.images = e.target.files
  },

  onPlace() {
    this.drawPoint(coords => this.city.set({geometry: {type: 'Point', coordinates: coords}}))
  },

  onSubmit() {
    const $form = this.$el.find('form')
    let data = {}
    $form.serializeArray().map(x => data[x.name] = x.value)

    this.city.save({
      name: data.name,
      country_: data.country,
      description: data.description,
    }, {
      success: (model) => {
        if (typeof this.images !== 'undefined')
          for (let i = 0; i < this.images.length; i++) {
            let formData = new FormData()
            formData.append('city', model.get('id'))
            formData.append('image', this.images[i])
      
            fetch('POST', 'api/image/', formData)
            .then(res => {
              if (!res.ok)
                console.log(res)
            })
          }

        this.triggerMethod('refresh:map', this)
        this.triggerMethod('close:menu', this)
      },

      error: (_model, res) => console.error(res),
    })
  },
})
