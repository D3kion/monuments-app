import _ from "underscore";
import { Model } from "backbone";
import { View } from "backbone.marionette";
import template from "./capital.hbs";
import { CapitalModel } from "Models/capital";
import { CountriesCollection } from "Collections/countries";

export class CapitalView extends View {
  constructor(options={}) {
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

    this.loading = true;
    this.countries = new CountriesCollection();

    this.model.on("change", this.render, this);

    this.countries.fetch({
      success: collection => {
        if (collection.models.length !== 0) {
          collection.models = collection.models.filter(x => x.get("capital") === null);
          if (collection.models.length !== 0)
            this.model.set({cities: collection.models[0].get("cities")});
        }
        this.loading = false;
        this.render();
      }
    });
  }

  serializeData() {
    return {
      loading: this.loading,
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
