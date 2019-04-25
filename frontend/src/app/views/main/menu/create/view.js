import _ from "underscore";
import { View } from "backbone.marionette";
import { CountryView } from "./country";
import { CityView } from "./city";
import { CapitalView } from "./capital";
import template from "./template.hbs";

export class CreateView extends View {
  constructor(drawPoint, options={}) {
    _.defaults(options, {
      className: "content-inner",
      template,
      regions: {
        content: "#create-content",
      },
      events: {
        "click .choose": "onChoose",
      },
      childViewEvents: {
        "show:toast": "showToast",
        "refresh:map": "refreshMap",
        "close:menu": "closeMenu",
      },
    });
    super(options);

    this.drawPoint = drawPoint;
    this.showChildView("content", new CountryView());
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

  showToast(view, type, text) {
    this.triggerMethod("show:toast", this, type, text);
  }

  refreshMap() {
    this.triggerMethod("refresh:map", this);
  }

  closeMenu() {
    this.triggerMethod("close:menu", this);
  }
}
