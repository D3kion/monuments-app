import _ from "underscore";
import { View } from "backbone.marionette";
import template from "./template.hbs";

export class MenuView extends View {
  constructor(options={}) {
    _.defaults(options, {
      template,
      regions: {
        content: "#content"
      },
      ui: {
        close: "#close",
      },
      events: {
        "click @ui.close": "onClose",
      },
    });
    super(options);
  }

  onRender() {
    this.showChildView("content", this.contentView);
  }

  initialize(obj) {
    this.contentView = obj.contentView;

    this.contentView.on("open:feature:id", this.openFeatureById, this);
    this.contentView.on("edit:feature:city", this.editCity, this);
    this.contentView.on("refresh:map", this.refreshMap, this);
    this.contentView.on("close:menu", this.onClose, this);
  }

  openFeatureById(view, feature) {
    this.triggerMethod("open:feature:id", this, feature);
  }

  editCity(view, id) {
    this.triggerMethod("edit:feature:city", this, id);
  }

  refreshMap() {
    this.triggerMethod("refresh:map", this);
  }

  onClose() {
    this.triggerMethod("close:menu", this);
  }
}
