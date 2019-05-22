import _ from "underscore";
import { View } from "backbone.marionette";
import template from "./goToCoords.hbs";

export class GoToCoordsView extends View {
  constructor(goToCoordsFn, options={}) {
    _.defaults(options, {
      className: "content-inner",
      template,
      events: {
        "click #submit": "onSubmit",
        "submit form": "onSubmit",
      },
      ui: {
        form: "form",
      }
    });
    super(options);
    
    this.goToCoords = goToCoordsFn;
    this.projections = [
      {
        name: "WGS84",
        value: "EPSG:4326",
      },
      {
        name: "Проекция Меркатора",
        value: "EPSG:3857",
      },
      {
        name: "Проекция Меркатора (Яндекс)",
        value: "EPSG:3395",
      },
      {
        name: "Проекция МСК",
        value: "EPSG:4284",
      },
    ];
  }

  serializeData() {
    return {
      projections: this.projections,
    };
  }

  onBeforeDestroy() {
    if (typeof this.onEndCb !== "undefined")
      this.onEndCb();
  }

  onSubmit(e) {
    if (typeof this.onEndCb !== "undefined")
      this.onEndCb();

    e.preventDefault();
    const $form = this.getUI("form");
    let data = {};
    $form.serializeArray().map(x => data[x.name] = x.value);
    data.longitude = parseFloat(data.longitude);
    data.latitude = parseFloat(data.latitude);

    if (isNaN(data.longitude) || isNaN(data.latitude))
      this.triggerMethod("show:toast", this, "Ошибка", "Некорректные координаты.");
    else
      this.onEndCb = this.goToCoords(data.longitude, data.latitude, data.projection);
  }
}
