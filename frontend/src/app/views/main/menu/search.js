import _ from "underscore";
import { Model } from "backbone";
import { View } from "backbone.marionette";
import { fetch } from "App/utils";
import template from "./search.hbs";

export class SearchView extends View {
  constructor(q, options={}) {
    _.defaults(options, {
      className: "content-inner",
      template,
      model: new Model({
        loading: true,
      }),
      events: {
        "click .clickable": "openFeature"
      }
    });
    super(options);

    this.search(q);
  }

  search(q) {
    let res = [];
    fetch("GET", "api/country/?search=" + q)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0)
        res.push({countries: data});
    })
    .then(() => 
      fetch("GET", "api/city/?search=" + q)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0)
          res.push({cities: data});
        this.model.set({
          loading: false,
          list: res,
        });
        this.render();
      }));
  }

  openFeature(e) {
    this.triggerMethod("open:feature:id", this, e.target.dataset);
  }
}
