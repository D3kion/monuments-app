import _ from "underscore";
import { CountryHelpersCollection } from "Collections/countryHelpers";
import { CountriesCollection } from "Collections/countries";
import { View } from "backbone.marionette";
import { CountryView } from "./country";
import { CityView } from "./city";
import { CapitalView } from "./capital";
import template from "./template.hbs";

export class CreateView extends View {
  constructor(drawPoint, options={}) {
    _.defaults(options, {
      className: "content-inner",
      template,
      regions: {
        content: "#create-content",
      },
      events: {
        "click .choose": "onChoose",
      },
      childViewEvents: {
        "show:toast": "showToast",
        "refresh:map": "refreshMap",
        "close:menu": "closeMenu",
      },
    });
    super(options);

    this.loading = true;
    this.drawPoint = drawPoint;
    this.countryHelpers = new CountryHelpersCollection();
    this.countries = new CountriesCollection();

    this.countryHelpers.fetch({
      success: () => {
        this.countries.fetch({
          success: () => {
            this.loading = false;
            this.render();
            this.showChildView("content", new CountryView(this.countryHelpers));
          },
        });
      },
    });
  }

  serializeData() {
    return {
      loading: this.loading,
    };
  }

  onChoose(e) {
    let childView;
    switch (e.target.dataset.choose) {
      case "country":
        childView = new CountryView(this.countryHelpers);
        break;
      case "city":
        childView = new CityView(this.countries, this.drawPoint);
        break;
      case "capital":
        childView = new CapitalView(this.countries);
        break;
    }
    this.showChildView("content", childView);
  }

  showToast(view, type, text) {
    this.triggerMethod("show:toast", this, type, text);
  }

  refreshMap(view, type) {
    this.triggerMethod("refresh:map", this, type);
  }

  closeMenu() {
    this.triggerMethod("close:menu", this);
  }
}
