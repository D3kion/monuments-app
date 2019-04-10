import Bb from 'backbone'
import { View } from 'backbone.marionette'
import template from './create.hbs'
import CountryView from './create/country'
import CityView from './create/city'
import CapitalView from './create/capital'

export default View.extend({
  template: template,

  model: new Bb.Model(),
  
  regions: {
    content: '#create-content'
  },

  ui: {
    choose: '.choose',
  },

  events: {
    'click @ui.choose': 'onChoose',
  },

  childViewEvents: {
    'refresh:map': 'refreshMap',
    'close:menu': 'closeMenu',
  },

  initialize(drawPoint) {
    this.drawPoint = drawPoint

    this.model.on('change', this.render, this)
  },

  onChoose(e) {
    this.model.set('target', e.target.dataset.choose)
    
    let childView
    switch (this.model.get('target')) {
      case 'country':
        childView = new CountryView()
        break;
      case 'city':
        childView = new CityView(this.drawPoint)
        break;
      case 'capital':
        childView = new CapitalView()
        break;
    }
    
    this.showChildView('content', childView)
  },

  refreshMap() {
    this.triggerMethod('refresh:map', this)
  },

  closeMenu() {
    this.triggerMethod('close:menu', this)
  },
})








// import Bb from 'backbone'
// import { View } from 'backbone.marionette'
// import fetch from '../../utils'
// import template from './create.hbs'

// export default View.extend({
//   template: template,

//   model: new Bb.Model({
//     isCountry: true,
//     coords: null,
//   }),

//   ui: {
//     choose: '.choose',
//     country: '#country',
//     name: '#name',
//     description: '#description',
//     place: '#place',
//     city: '#city',
//     submit: '#submit',
//   },

//   events: {
//     'click @ui.choose': 'onChoose',
//     'change @ui.country': 'onCountry',
//     'click @ui.place': 'onPlace',
//     'click @ui.submit': 'onSubmit',
//   },

//   initialize(drawPoint) {
//     this.drawPoint = drawPoint
//     this.model.on('change', () => {
//       if (!this.model.hasChanged('coords'))
//         this.render()
//     }, this)
//     this.loadCountries()
//   },

//   onRender() {
//     if (this.model.get('isCapital')) {
//       this.getUI('country').val(this.model.get('selectedCountry'))
//     }
//   },

//   onCountry() {
//     if (this.model.get('isCapital')) {
//       const id = this.getUI('country').val()
//       this.model.set('selectedCountry', id)

//       const cities = this.model.get('countries')
//                       .filter((x) => x.id == id)[0].city_set
//       this.model.set('cities', cities)
//     }
//   },

//   onSubmitCapital() {
//     const capital_of = this.getUI('country').val()
//     const city = this.getUI('city').val()

//     if (city == -1)
//       return

//     fetch('POST', 'api/geo/capital/', JSON.stringify({
//       capital_of,
//       city,
//     }))
//     .then(res => {
//       if (res.ok) {
//         this.triggerMethod('refresh:map', this)
//         this.triggerMethod('close:menu', this)
//       }
//     })
//   },

//   loadCountries() {
//       fetch('GET', 'api/geo/info/country/')
//       .then(res => res.json())
//       .then(data => {
//         if (this.model.get('isCapital')) {
//           data = data.filter((x) => x.capital == null)
//           this.model.set('selectedCountry', data[0].id)
//           this.model.set('cities', data[0].city_set)
//         }
//         this.model.set('countries', data)
//       })
//   },
// })
