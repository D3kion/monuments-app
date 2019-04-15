/* eslint-disable no-undef */
import "ol/ol.css";
import * as proj from "ol/proj";
import { Map, View } from "ol";
import OSM from "ol/source/OSM";
import Vector from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { defaults } from "ol/interaction";
import Select from "ol/interaction/Select.js";
import Draw from "ol/interaction/Draw.js";
import { never } from "ol/events/condition";
import { View as MnView } from "backbone.marionette";
import fetch from "../../utils";
import template from "./map.hbs";

export default MnView.extend({
  template: template,
  
  initialize() {
    this.map = new Map({
      layers: [],
      view: new View({
        center: proj.transform([65, 45], "EPSG:4326", "EPSG:3857"),
        zoom: 4,
      }),
      controls: [],
      interactions: defaults({doubleClickZoom: false})
    });
    this.select = new Select({toggleCondition: never});
    
    this.select.on("select", this.onSelect.bind(this));
    this.map.on("pointermove", function(e) {
      let hit = this.forEachFeatureAtPixel(e.pixel, () => true);
      this.getTargetElement().style.cursor = hit ? "pointer" : "";
    });
    
    this.map.addInteraction(this.select);

    this.loadLayers();
  },

  onDomRefresh() {
    this.map.setTarget("map");
  },

  onSelect(e) {
    const feature = e.target.getFeatures().getArray()[0];
    this.triggerMethod("open:feature", this, feature);
  },

  homeExtent() {
    this.map.setView(new View({
      center: proj.transform([65, 45], "EPSG:4326", "EPSG:3857"),
      zoom: 4,
    }));
  },

  drawPoint(setCoords) {
    let source = new Vector();
    let vector = new VectorLayer({source});
    this.map.addLayer(vector);

    let draw = new Draw({
      source,
      type: "Point",
    });

    draw.on("drawend", (e) => {
      const rawCoords = e.feature.getGeometry().getCoordinates();
      setCoords(proj.transform(rawCoords, "EPSG:3857", "EPSG:4326"));

      this.map.removeInteraction(draw);
      this.map.removeLayer(vector);
      setTimeout(() => this.map.addInteraction(this.select), 1000);
    });

    this.map.removeInteraction(this.select);
    this.map.addInteraction(draw);
  },

  loadLayers() {
    let countrySource = new Vector({
      format: new GeoJSON({
        defaultDataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857"
      }),

      loader: () =>
        fetch("GET", "api/geojson/country/")
        .then(res => res.json())
        .then(data => countrySource.addFeatures(countrySource.getFormat().readFeatures(data)))
    });
    
    let citySource = new Vector({
      format: new GeoJSON({
        defaultDataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857"
      }),

      loader: () =>
        fetch("GET", "api/geojson/city/")
        .then(res => res.json())
        .then(data => citySource.addFeatures(citySource.getFormat().readFeatures(data)))
    });

    this.mainLayer = new TileLayer({source: new OSM()});
    this.countryLayer = new VectorLayer({source: countrySource});
    this.cityLayer = new VectorLayer({source: citySource});

    this.map.getLayers().clear();
    this.map.addLayer(this.mainLayer);
    this.map.addLayer(this.countryLayer);
    this.map.addLayer(this.cityLayer);
  },
});
