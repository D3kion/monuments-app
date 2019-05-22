/* eslint-disable no-undef */
import _ from "underscore";
import { Model } from "backbone";
import { View } from "backbone.marionette";
import { fetch } from "App/utils";
import { ToastView } from "Views/toast/view";
import { MapView } from "./map";
import { MenuView } from "./menu/view";
import { FeatureView } from "./menu/feature";
import { CreateView } from "./menu/create/view";
import { EditCountryView } from "./menu/editCountry";
import { EditCityView } from "./menu/editCity";
import { SearchView } from "./menu/search";
import { LayersView } from "./menu/layers";
import { GoToCoordsView } from "./menu/goToCoords";
import { PrintView } from "./menu/print";
import template from "./template.hbs";

export class MainView extends View {
  constructor(options={}) {
    _.defaults(options, {
      template,
      model: new Model(),
      regions: {
        menu: {
          el: "#menu-placeholder",
          replaceElement: true,
        },
        map: {
          el: "#map-placeholder",
          replaceElement: true,
        },
        toast: {
          el: "#toast-placeholder",
          replaceElement: true,
        },
      },
      events: {
        "click #home-extent": "onHomeExtent",
        "click #create": "openCreate",
        "click #goToCoords": "goToCoords",
        "click #layers": "openLayers",
        "click #print": "onPrint",
        "click #screenshot": "takeScreenshot",
        "click #admin": "onAdmin",
        "click #logout": "onLogout",
        "keyup #search": "onSearch",
      },
      childViewEvents: {
        "show:toast": "showToast",
        "close:menu": "closeMenu",
        "open:feature": "openFeature",
        "open:feature:id": "openFeatureById",
        "edit:feature:country": "editCountry",
        "edit:feature:city": "editCity",
        "refresh:map": "refreshMap",
      },
      ui: {
        printText: "#print-text",
      }
    });
    super(options);

    this.model.on("change", this.render, this);
    this.getUserInfo();
  }
  
  onRender() {
    this.map = new MapView();
    this.showChildView("map", this.map);
  }

  showMenu(view) {
    this.showChildView("menu", new MenuView({contentView: view}));
  }
  
  onHomeExtent() {
    this.map.homeExtent();
  }

  openCreate() {
    this.map.select.getFeatures().clear();
    this.showMenu(new CreateView(this.map.drawPoint.bind(this.map)));
  }

  goToCoords() {
    this.map.select.getFeatures().clear();
    this.showMenu(new GoToCoordsView(this.map.goToCoords.bind(this.map)));
  }
  
  openLayers() {
    this.map.select.getFeatures().clear();
    this.showMenu(new LayersView(this.map.map.getLayers().getArray(), l => this.map.activeLayer = l));
  }

  onPrint() {
    this.showMenu(new PrintView(text => {
      const css = "@page { size: auto; }",
            head = document.head || document.getElementsByTagName("head")[0],
            style = document.createElement("style");

      style.type = "text/css";
      style.media = "print";

      if (style.styleSheet)
        style.styleSheet.cssText = css;
      else
        style.appendChild(document.createTextNode(css));

      head.appendChild(style);

      this.getUI("printText").text(text);
      this.map.map.once("rendercomplete", () => window.print());
      this.map.map.renderSync();
    }));
  }

  takeScreenshot() {
    this.map.takeScreenshot();
  }

  onAdmin() {
    location.replace("admin");
  }

  onLogout() {
    localStorage.removeItem("token");
    location.reload();
  }

  onSearch(e) {
    this.map.select.getFeatures().clear();
    if (e.keyCode == 13)
      this.showMenu(new SearchView(e.target.value));
  }

  showToast(view, type, text) {
    const toast = new ToastView(type, text);
    this.showChildView("toast", toast);
    toast.show();
  }

  closeMenu() {
    this.getRegion("menu").empty();
    this.map.select.getFeatures().clear();
  }

  openFeature(view, feature) {
    if (typeof feature !== "undefined") {
      let type;
      if (feature.getGeometry().flatCoordinates.length == 2)
        type = "city";
      else
        type = "country";

      this.showMenu(new FeatureView(type, feature.getId()));
    } else
      this.closeMenu();
  }

  openFeatureById(view, feature) {
    const type = Object.entries(feature)[0][0];
    const id = Object.entries(feature)[0][1];

    this.showMenu(new FeatureView(type, id));
    
    this.map.select.getFeatures().clear();
    this.map.select.getFeatures().push(this.getFeature(type, id));
  }

  editCountry(view, id) {
    this.showMenu(new EditCountryView(id));
  }

  editCity(view, id) {
    this.showMenu(new EditCityView(id, this.map.drawPoint.bind(this.map)));
  }
  
  refreshMap() {
    this.map.loadLayers();
  }

  getUserInfo() {
    fetch("GET", "api/token-info/?token=" + localStorage.token)
    .then(res => res.json())
    .then(data => {
      this.model.set("name", data.user);
      this.model.set("isAdmin", data.isAdmin);
    });
  }

  getFeature(type, id) {
    if (type == "city")
      return this.map.cityLayer.getSource().getFeatureById(id);
    else
      return this.map.countryLayer.getSource().getFeatureById(id);
  }
}
