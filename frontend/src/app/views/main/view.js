import _ from "underscore";
import { Model } from "backbone";
import { View } from "backbone.marionette";
import { fetch } from "../../utils";
import template from "./template.hbs";
import { ToastView } from "Views/toast/view";
import { MapView } from "./map";
import { MenuView } from "./menu/view";
import { FeatureView } from "./menu/feature";
import { CreateView } from "./menu/create/view";
import { EditCountryView } from "./menu/editCountry";
import { EditCityView } from "./menu/editCity";
import { SearchView } from "./menu/search";
import { LayersView } from "./menu/layers";

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
        "click #layers": "openLayers",
        "click #create": "openCreate",
        "click #screenshot": "takeScreenshot",
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
    });
    super(options);

    this.model.on("change", this.render, this);
    this.getUsername();
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
  
  openLayers() {
    this.map.select.getFeatures().clear();
    this.showMenu(new LayersView(this.map.map.getLayers().getArray()));
  }

  openCreate() {
    this.map.select.getFeatures().clear();
    this.showMenu(new CreateView(this.map.drawPoint.bind(this.map)));
  }

  takeScreenshot() {
    this.map.takeScreenshot();
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
      const type = feature.getGeometry().constructor.name === "Point" ? "city" : "country";    
      this.showMenu(new FeatureView(type, feature.getId()));
    } else {
      this.closeMenu();
    }
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

  getUsername() {
    fetch("GET", "api/token-info/")
    .then(res => res.json())
    .then(data => this.model.set("name", data.user));
  }

  getFeature(type, id) {
    if (type == "city")
      return this.map.cityLayer.getSource().getFeatureById(id);
    else
      return this.map.countryLayer.getSource().getFeatureById(id);
  }
}
