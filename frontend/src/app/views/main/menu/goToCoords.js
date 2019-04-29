/* eslint-disable no-console */
/* eslint-disable no-undef */
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
    });
    super(options);
    
    this.goToCoords = goToCoordsFn;
  }

  onBeforeDestroy() {
    if (typeof this.onEndCb !== "undefined")
      this.onEndCb();
  }

  onSubmit(e) {
    console.log("submit");

    if (typeof this.onEndCb !== "undefined")
      this.onEndCb();

    e.preventDefault();
    const $form = this.$el.find("form");
    let data = {};
    $form.serializeArray().map(x => data[x.name] = parseFloat(x.value));

    if (isNaN(data.longitude) || isNaN(data.latitude)) {
      this.triggerMethod("show:toast", this, "Ошибка", "Некорректные координаты.");
      return;
    }

    this.onEndCb = this.goToCoords(data.longitude, data.latitude);
  }
}
