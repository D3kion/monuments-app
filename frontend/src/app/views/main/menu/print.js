import _ from "underscore";
import { View } from "backbone.marionette";
import template from "./print.hbs";

export class PrintView extends View {
  constructor(printFn, options={}) {
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
    
    this.print = printFn;
  }

  onSubmit(e) {
    e.preventDefault();
    const $form = this.getUI("form");
    let data = {};
    $form.serializeArray().map(x => data[x.name] = x.value);

    this.print(data.comment);
    this.triggerMethod("close:menu", this);
  }
}
