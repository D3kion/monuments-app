import _ from "underscore";
import { View } from "backbone.marionette";
import template from "./layers.hbs";

export class LayersView extends View {
  constructor(layers, setActiveLayer, options={}) {
    _.defaults(options, {
      className: "content-inner",
      template,
      events: {
        "click .layer": "onClickLayer",
      },
    });
    super(options);

    this.layers = layers;
    this.setActiveLayer = setActiveLayer;
  }

  serializeData() {
    return {
      layers: this.layers,
    };
  }

  onClickLayer(e) {
    let layer = this.layers[e.target.dataset.value];
    if (layer.get("switchType") == "radio") {
      this.setActiveLayer(layer.get("name"));

      this.layers.map(x => {
        if (x.get("switchType") == "radio")
          x.setVisible(false);
      });
    }

    layer.setVisible(!layer.getVisible());
    this.render();
  }
}
