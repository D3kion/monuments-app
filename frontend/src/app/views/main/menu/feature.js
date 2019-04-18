import _ from "underscore";
import { View } from "backbone.marionette";
import countryTemplate from "./featureCountry.hbs";
import cityTemplate from "./featureCity.hbs";
import { CountryModel } from "Models/country";
import { CityModel } from "Models/city";

export class FeatureView extends View {
  constructor(type, id, options={}) {
    _.defaults(options, {
      template: type === "country" ? countryTemplate : cityTemplate,
      events: {
        "click .clickable": "openFeature",
        "click #edit": "editFeature",
        "click #delete": "deleteFeature",
      },
    });
    super(options);

    this.loading = true;
    this.featureType = type;

    if (type === "country") 
      this.feature = new CountryModel();
    else
      this.feature = new CityModel();

    this.feature.set({id}).fetch({
      success: () => {
        this.loading = false;
        this.render();
      }
    });
  }

  serializeData() {
    return {
      loading: this.loading,
      feature: this.feature.toJSON(),
    };
  }

  openFeature(e) {
    this.triggerMethod("open:feature:id", this, e.target.dataset);
  }

  editFeature() {
    if (this.featureType === "country")
      this.triggerMethod("edit:feature:country", this, this.feature);
    else
      this.triggerMethod("edit:feature:city", this, this.feature);
  }

  deleteFeature() {
    this.feature.destroy({
      success: () => {
        this.triggerMethod("refresh:map", this);
        this.triggerMethod("close:menu", this);
      }
    });
  }
}
