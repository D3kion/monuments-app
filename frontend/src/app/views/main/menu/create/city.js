/* eslint-disable no-undef */
import _ from "underscore";
import { View } from "backbone.marionette";
import { fetch } from "App/utils";
import { CityModel } from "Models/city";
import template from "./city.hbs";

export class CityView extends View {
  constructor(countries, drawPoint, options={}) {
    _.defaults(options, {
      className: "content-inner",
      template,
      events: {
        "change #images": "onChangeImages",
        "click #place": "onPlace",
        "click #submit": "onSubmit",
        "submit form": "onSubmit",
      },
      ui: {
        form: "form",
      }
    });
    super(options);

    this.drawPoint = drawPoint;
    this.countries = countries;
    this.city = new CityModel();
  }

  serializeData() {
    return {
      countries: this.countries.toJSON(),
    };
  }

  onBeforeDestroy() {
    if (typeof this.onEndCb !== "undefined")
      this.onEndCb();
  }

  onChangeImages(e) {
    this.images = e.target.files;

    this.triggerMethod("show:toast", this, "Изображения", "Изображения добавлены.");
  }

  onPlace() {
    if (typeof this.onEndCb !== "undefined")
      this.onEndCb();

    this.onEndCb = this.drawPoint(coords => 
      this.city.set({geometry: {type: "Point", coordinates: coords}}));
  }

  onSubmit(e) {
    e.preventDefault();
    const $form = this.getUI("form");
    let data = {};
    $form.serializeArray().map(x => data[x.name] = x.value);

    this.city.save({
      name: data.name,
      country_: data.country,
      description: data.description,
    }, {
      success: model => {
        if (typeof this.images !== "undefined")
          for (let i = 0; i < this.images.length; i++) {
            let formData = new FormData();
            formData.append("city", model.get("id"));
            formData.append("image", this.images[i]);
      
            fetch("POST", "api/image/", formData)
            .then(res => {
              if (!res.ok)
                res.json().then(data => {
                  this.triggerMethod("show:toast", this, "Ошибка: Изображение", data.image);
                });
            });
          }

        this.triggerMethod("refresh:map", this, "city");
        this.triggerMethod("close:menu", this);
      },

      error: (_model, res) => {
        if (res.responseJSON.geometry)
          this.triggerMethod("show:toast", this, "Ошибка: Место", "Выберите место на карте");
        else
          this.triggerMethod("show:toast", this, "Ошибка: Название", res.responseJSON.name);
      },
    });
  }
}
