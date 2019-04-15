import _ from "underscore";
import { View } from "backbone.marionette";
import template from "./template.hbs";
import { CountryView } from "./country";
import { CityView } from "./city";
import { CapitalView } from "./capital";

export class CreateView extends View {
  constructor(drawPoint, options={}) {
    _.defaults(options, {
      template,
      regions: {
        content: "#create-content"
      },
      events: {
        "click .choose": "onChoose",
      },
      childViewEvents: {
        "refresh:map": "refreshMap",
        "close:menu": "closeMenu",
      },
    });
    super(options);

    this.drawPoint = drawPoint;
  }

  onChoose(e) {
    let childView;
    switch (e.target.dataset.choose) {
      case "country":
        childView = new CountryView();
        break;
      case "city":
        childView = new CityView(this.drawPoint);
        break;
      case "capital":
        childView = new CapitalView();
        break;
    }
    this.showChildView("content", childView);
  }

  refreshMap() {
    this.triggerMethod("refresh:map", this);
  }

  closeMenu() {
    this.triggerMethod("close:menu", this);
  }
}
