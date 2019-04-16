/* eslint-disable no-undef */
import _ from "underscore";
import { Model } from "backbone";
import { View } from "backbone.marionette";
import template from "./capital.hbs";
import { CapitalModel } from "Models/capital";
import { CountriesCollection } from "Collections/countries";

export class CapitalView extends View {
  constructor(options={}) {
    _.defaults(options, {
      template,
      model: new Model(),
      events: {
        "change #country": "onChangeCountry",
        "click #submit": "onSubmit",
      },
    });
    super(options);

    this.countries = new CountriesCollection();

    this.countries.on("add", this.render, this);
    this.model.on("change", this.render, this);

    this.countries.fetch({
      success: collection => {
        if (collection.models.length != 0) {
          collection.models = collection.models.filter((x) => x.get("capital") === null);
          this.model.set({cities: collection.models[0].get("cities")});
        }
      }
    });
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
      },

      error: (_model, res) => console.error(res),
    });
  }
}
