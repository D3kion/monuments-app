/* eslint-disable no-undef */
import _ from "underscore";
import { View } from "backbone.marionette";
import template from "./layers.hbs";

export class LayersView extends View {
  constructor(layers, options={}) {
    _.defaults(options, {
      template,
      events: {
        "click .layer": "onClickLayer",
      },
    });
    super(options);

    this.layers = layers;
  }

  serializeData() {
    return {
      layers: this.layers
    };
  }

  onClickLayer(e) {
    let layer = this.layers[e.target.value];
    layer.setVisible(!layer.getVisible());
  }
}