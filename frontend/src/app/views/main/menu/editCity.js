/* eslint-disable no-undef */
import _ from "underscore";
import { View } from "backbone.marionette";
import template from "./editCity.hbs";
import { fetch } from "../../../utils";
import { ImageModel } from "Models/image";
import { CountriesCollection } from "Collections/countries";

export class EditCityView extends View {
  constructor(feature, drawPoint, options={}) {
    _.defaults(options, {
      template,
      events: {
        "change #images": "uploadImages",
        "click .remove": "removeImage",
        "click #place": "onPlace",
        "click #submit": "onSubmit",
        "submit form": "onSubmit",
      },
    });
    super(options);

    this.drawPoint = drawPoint;
    this.feature = feature.clone();
    this.countries = new CountriesCollection();

    this.countries.on("add", this.render, this);

    this.countries.fetch();
  }

  serializeData() {
    return {
      feature: this.feature.toJSON(),
      countries: this.countries.toJSON().filter(x => x.id != this.feature.get("country").id)
    };
  }

  uploadImages(e) {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      let formData = new FormData();
      formData.append("city", this.feature.get("id"));
      formData.append("image", files[i]);

      fetch("POST", "api/image/", formData)
      .then(res => {
        if (res.ok) {
          this.feature.fetch({
            success: () => {
              this.triggerMethod("show:toast", this, "Успешно", "Изображения успешно загружены");
              this.render();
            }
          });
        } else
          res.json().then(data => {
            this.triggerMethod("show:toast", this, "Ошибка: Изображение", data.image);
          });
      });
    }
  }

  removeImage(e) {
    (new ImageModel()).set({id: e.target.dataset.id}).destroy({
      success: () => {
        this.feature.fetch({
          success: () => this.render()
        });
      }
    });
  }

  onPlace() {
    this.drawPoint((coords) => this.feature.set({geometry: {type: "Point", coordinates: coords}}));
  }

  onSubmit(e) {
    e.preventDefault();
    const $form = this.$el.find("form");
    let data = {};
    $form.serializeArray().map(x => data[x.name] = x.value);

    this.feature.save({
      name: data.name,
      country_: data.country,
      description: data.description,
    }, {
      success: () => {
        this.triggerMethod("refresh:map", this);
        this.triggerMethod("close:menu", this);
      },

      error: (_model, res) => {
        this.triggerMethod("show:toast", this, "Ошибка: Название", res.responseJSON.name);
      }
    });
  }
}
