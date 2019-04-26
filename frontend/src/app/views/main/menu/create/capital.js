import _ from "underscore";
import { Model } from "backbone";
import { View } from "backbone.marionette";
import { CapitalModel } from "Models/capital";
import template from "./capital.hbs";

export class CapitalView extends View {
  constructor(countries, options={}) {
    _.defaults(options, {
      className: "content-inner",
      template,
      model: new Model(),
      events: {
        "change #country": "onChangeCountry",
        "click #submit": "onSubmit",
      },
    });
    super(options);

    this.countries = countries.clone();
    if (this.countries.models.length !== 0) {
      this.countries.models = this.countries.models.filter(x => x.get("capital") === null);
      if (this.countries.models.length !== 0)
        this.model.set({cities: this.countries.models[0].get("cities")});
    }

    this.model.on("change", this.render, this);
  }

  serializeData() {
    return {
      countries: this.countries.toJSON(),
      cities: this.model.get("cities"),
    };
  }

  onRender() {
    if (typeof this.activeCountry !== "undefined")
      this.$el.find("#country").val(this.activeCountry);
  }

  onChangeCountry(e) {
    const countryId = e.target.value;

    this.activeCountry = countryId;
    this.model.set({cities: this.countries.get(countryId).get("cities")});
  }

  onSubmit() {
    const $form = this.$el.find("form");
    let data = {};
    $form.serializeArray().map(x => data[x.name] = x.value);

    (new CapitalModel()).save({
      capital_of: data.country,
      city: data.city,
    }, {
      success: () => {
        this.triggerMethod("refresh:map", this);
        this.triggerMethod("close:menu", this);
      }
    });
  }
}
