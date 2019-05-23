/* eslint-disable no-undef */
const Handlebars = require("handlebars/runtime");

Handlebars.registerHelper({
  eq: function (v1, v2) {
    return v1 == v2;
  }
});
