import Bb from 'backbone'
import { View } from 'backbone.marionette'
import fetch from '../../utils'
import template from './create.hbs'

export default View.extend({
  template: template,

  model: new Bb.Model({
    isCountry: true,
    coords: null,
  }),

  ui: {
    choose: '.choose',
    country: '#country',
    name: '#name',
    description: '#description',
    place: '#place',
    city: '#city',
    submit: '#submit',
  },

  events: {
    'click @ui.choose': 'onChoose',
    'change @ui.country': 'onCountry',
    'click @ui.place': 'onPlace',
    'click @ui.submit': 'onSubmit',
  },

  initialize(drawPoint) {
    this.drawPoint = drawPoint
    this.model.on('change', () => {
      if (!this.model.hasChanged('coords'))
        this.render()
    }, this)
    this.loadCountries()
  },

  onRender() {
    if (this.model.get('isCapital')) {
      this.getUI('country').val(this.model.get('selectedCountry'))
    }
  },

  onChoose(e) {
    this.model.set('isCountry', false)
    this.model.set('isCity', false)
    this.model.set('isCapital', false)

    switch (e.target.dataset.choose) {
      case 'country':
        this.model.set('isCountry', true)
        break;
      case 'city':
        this.model.set('isCity', true)
        break;
      case 'capital':
        this.model.set('isCapital', true)
        break;
    }

    this.loadCountries()
  },

  onCountry() {
    if (this.model.get('isCapital')) {
      const id = this.getUI('country').val()
      this.model.set('selectedCountry', id)

      const cities = this.model.get('countries')
                      .filter((x) => x.id == id)[0].city_set
      this.model.set('cities', cities)
    }
  },

  onPlace() {
    this.drawPoint(this.model)
  },

  onSubmit() {
    if (this.model.get('isCountry'))
      this.onSubmitCountry()
    else if (this.model.get('isCity'))
      this.onSubmitCity()
    else if (this.model.get('isCapital'))
      this.onSubmitCapital()
  },

  onSubmitCountry() {
    const id = this.getUI('country').val()
    const itemId = this.getUI('country').prop('selectedIndex')
    const name = this.getUI('country').prop('options').item(itemId).text

    const url = 'api/geo/countries/' + id + '/'
    fetch('GET', url)
    .then(res => res.json())
    .then(data => {
      fetch('POST', 'api/geo/country/', JSON.stringify({
        name,
        geometry: data.geometry,
      }))
      .then(res => {
        if (res.ok) {
          this.triggerMethod('refresh:map', this)
          this.loadCountries()
        }
      })
    })
  },

  onSubmitCity() {
    if (this.model.get('coords') == null)
      return

    const name = this.getUI('name').val()
    const country = this.getUI('country').val()
    const description = this.getUI('description').val() || ''
    const geometry = {
      type: 'Point',
      coordinates: this.model.get('coords')
    }

    fetch('POST', 'api/geo/city/', JSON.stringify({
      name,
      country,
      description,
      geometry,
      image_set: [],
    }))
    .then(res => {
      if (res.ok) {
        this.triggerMethod('refresh:map', this)
        this.triggerMethod('close:menu', this)
      }
    })
  },

  onSubmitCapital() {
    const capital_of = this.getUI('country').val()
    const city = this.getUI('city').val()

    if (city == -1)
      return

    fetch('POST', 'api/geo/capital/', JSON.stringify({
      capital_of,
      city,
    }))
    .then(res => {
      if (res.ok) {
        this.triggerMethod('refresh:map', this)
        this.triggerMethod('close:menu', this)
      }
    })
  },

  loadCountries() {
    if (this.model.get('isCountry'))
      fetch('GET', 'api/geo/countries/')
      .then(res => res.json())
      .then(data => this.model.set('countries', data))
    else
      fetch('GET', 'api/geo/info/country/')
      .then(res => res.json())
      .then(data => {
        if (this.model.get('isCapital')) {
          data = data.filter((x) => x.capital == null)
          this.model.set('selectedCountry', data[0].id)
          this.model.set('cities', data[0].city_set)
        }
        this.model.set('countries', data)
      })
  },
})
