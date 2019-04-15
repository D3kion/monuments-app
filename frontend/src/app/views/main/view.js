import _ from "underscore";
import { Model } from "backbone";
import { View } from "backbone.marionette";
import fetch from "../../utils";
import template from "./template.hbs";
import { MapView } from "./map";
import { MenuView } from "./menu/view";
import { FeatureView } from "./menu/feature";
import { CreateView } from "./menu/create/view";
import { EditCityView } from "./menu/editCity";
import { SearchView } from "./menu/search";

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
      },
      events: {
        // 'click #layers': 'openLayers',
        "click #create": "openCreate",
        "click #home-extent": "onHomeExtent",
        "click #logout": "onLogout",
        "keyup #search": "onSearch",
      },
      childViewEvents: {
        "close:menu": "closeMenu",
        "open:feature": "openFeature",
        "open:feature:id": "openFeatureById",
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
  
  // openLayers() {
  //   this.map.select.getFeatures().clear()
  //   this.showMenu()
  // },

  openCreate() {
    this.map.select.getFeatures().clear();
    this.showMenu(new CreateView(this.map.drawPoint.bind(this.map)));
  }

  onHomeExtent() {
    this.map.homeExtent();
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
