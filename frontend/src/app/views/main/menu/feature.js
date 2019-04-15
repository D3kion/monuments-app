import { View } from "backbone.marionette";
import countryTemplate from "./featureCountry.hbs";
import cityTemplate from "./featureCity.hbs";
import CountryModel from "Models/country";
import CityModel from "Models/city";

export default View.extend({
  template: false,

  events: {
    "click .clickable": "openFeature",
    "click #edit": "editFeature",
    "click #delete": "deleteFeature",
  },

  initialize(type, id) {
    this.featureType = type;
    this.featureId = id;

    if (type =="country") {
      this.feature = new CountryModel();
      this.template = countryTemplate;
    } else { // city
      this.feature = new CityModel();
      this.template = cityTemplate;
    }

    this.feature.on("change", this.render, this);
    
    this.feature.set({id}).fetch();
  },

  serializeData() {
    return {
      feature: this.feature.toJSON(),
    };
  },

  openFeature(e) {
    this.triggerMethod("open:feature:id", this, e.target.dataset);
  },

  editFeature() {
    // if (this.featureType === 'country')
    //   this.triggerMethod('edit:feature:country', this, this.feature)
    // else
    this.triggerMethod("edit:feature:city", this, this.feature);
  },

  deleteFeature() {
    this.feature.destroy({
      success: () => {
        this.triggerMethod("refresh:map", this);
        this.triggerMethod("close:menu", this);
      }
    });
  },
});
