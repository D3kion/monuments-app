import "bootstrap/js/dist/util";
import "bootstrap/js/dist/toast";
import _ from "underscore";
import { View } from "backbone.marionette";
import template from "./template.hbs";

export class ToastView extends View {
  constructor(type, text, options={}) {
    _.defaults(options, {
      template,
    });
    super(options);
  
    this.type = type;
    this.text = text;
  }

  serializeData() {
    return {
      type: this.type,
      text: this.text,
    };
  }

  show() {
    const toast = this.$el.find(".toast");
    toast.toast({delay: 5000});
    toast.toast("show");
  }
}
