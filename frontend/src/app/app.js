import "bootstrap/dist/css/bootstrap.min.css";
import "Styles/main.scss";
import _ from "underscore";
import { Application } from "backbone.marionette";
import { fetch, getCookie } from "./utils";
import { LoginView } from "./views/login/view";
import { MainView } from "./views/main/view";

export class App extends Application {
  constructor(options={}) {
    _.defaults(options, {
      region: "#root",
    });
    super(options);
  }
  
  onStart() {
    if (typeof localStorage.token !== "undefined")
      fetch("GET", "api/token-info/?token=" + localStorage.token)
      .then(res => {
        if (res.status == 401)
          this.showView(new LoginView());
        else
          this.showView(new MainView());
      });
    else
      this.showView(new LoginView());

    let _sync = Backbone.sync;
    Backbone.sync = function(method, model, options) {
      options.beforeSend = xhr => {
        xhr.setRequestHeader("Authorization", "Token " + localStorage.token);
        xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
      };

      if (model && (method === "create" || method === "update" || method === "patch")) {
        options.contentType = "application/json";
        options.data = JSON.stringify(options.attrs || model.toJSON());
      }

      // Add trailing slash to backbone model views
      const parts = _.result(model, "url").split("?");
      let _url = parts[0];
      const params = parts[1];

      _url += _url.endsWith("/") ? "" : "/";
      if (!_.isUndefined(params))
        _url += "?" + params;

      options.url = _url;
  
      return _sync.call(this, method, model, options);
    };
  }
}
