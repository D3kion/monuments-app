/* eslint-disable no-undef */
import "ol/ol.css";
import * as proj from "ol/proj";
import { register } from "ol/proj/proj4";
import { Map, View } from "ol";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { createStringXY } from "ol/coordinate";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import CircleStyle from "ol/style/Circle";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import BingMaps from "ol/source/BingMaps";
import Vector from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { defaults } from "ol/interaction";
import Select from "ol/interaction/Select";
import Draw from "ol/interaction/Draw";
import MousePosition from "ol/control/MousePosition";
import OverviewMap from "ol/control/OverviewMap";
import { never } from "ol/events/condition";
import proj4 from "proj4";
import { saveAs } from "file-saver";
import _ from "underscore";
import { View as MnView } from "backbone.marionette";
import { fetch } from "App/utils";
import template from "./map.hbs";

proj4.defs("EPSG:3395", "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:4284","+proj=longlat +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +no_defs");
register(proj4);
proj.get("EPSG:3395").setExtent(
  [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244]
);

export class MapView extends MnView {
  constructor(options={}) {
    _.defaults(options, {
      template,
    });
    super(options);

    this.activeLayer = "OSM";

    this.map = new Map({
      layers: [],
      view: new View({
        center: proj.transform([65, 45], "EPSG:4326", "EPSG:3857"),
        zoom: 4,
      }),
      controls: [],
      interactions: defaults({doubleClickZoom: false})
    });
    this.map.on("pointermove", function(e) {
      let hit = this.forEachFeatureAtPixel(e.pixel, () => true);
      this.getTargetElement().style.cursor = hit ? "pointer" : "";
    });
    this.mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(6),
      projection: "EPSG:4326",
    });
    this.map.addControl(this.mousePositionControl);
    this.mapOverview = new OverviewMap();
    this.map.addControl(this.mapOverview);

    this.select = new Select({
      layers: layer => layer.get("selectable") == true,
      toggleCondition: never
    });    
    this.select.on("select", this.onSelect.bind(this));
    this.map.addInteraction(this.select);

    this.loadLayers();
  }

  onDomRefresh() {
    this.map.setTarget("map");
  }

  onSelect(e) {
    const feature = e.target.getFeatures().getArray()[0];
    this.triggerMethod("open:feature", this, feature);
  }

  homeExtent() {
    this.map.setView(new View({
      center: proj.transform([65, 45], "EPSG:4326", "EPSG:3857"),
      zoom: 4,
    }));
  }

  takeScreenshot() {
    this.map.once("rendercomplete", e => {
      const canvas = e.context.canvas;
      if (window.navigator && window.navigator.msSaveOrOpenBlob)
        window.navigator.msSaveOrOpenBlob(canvas.msToBlob(), "map.png");
      else
        canvas.toBlob(blob => saveAs(blob, "map.png"));
    });

    this.map.renderSync();
  }

  goToCoords(x, y, projection) {
    const style = new Style({
      image: new CircleStyle({
        radius: 6,
        stroke: new Stroke({
          color: "rgba(0, 0, 0, 0.6)",
          width: 2,
        }),
        fill: new Fill({
          color: "rgba(200, 0, 0, 0.7)"
        }),
      }),
    });

    const marker = new Feature({
      geometry: new Point(proj.transform([x, y], projection, "EPSG:3857")),
    });

    this.goToSource = new Vector({
      features: [marker],
    });
    let vector = new VectorLayer({
      source: this.goToSource,
      style,
    });
    this.map.addLayer(vector);

    this.map.setView(new View({
      center: proj.transform([x, y], projection, "EPSG:3857"),
      zoom: 9,
    }));

    return () => {
      this.map.removeLayer(vector);
    };
  }

  drawPoint(setCoords) {
    const style = new Style({
      image: new CircleStyle({
        radius: 6,
        stroke: new Stroke({
          color: "rgba(0, 0, 0, 0.6)",
          width: 2,
        }),
        fill: new Fill({
          color: "rgba(255, 204, 51, 0.7)"
        })
      })
    });

    let source = new Vector();
    let vector = new VectorLayer({
      source,
      style,
    });
    this.map.addLayer(vector);

    let draw = new Draw({
      source,
      type: "Point",
    });

    draw.on("drawend", e => {
      const rawCoords = e.feature.getGeometry().getCoordinates();
      setCoords(proj.transform(rawCoords, "EPSG:3857", "EPSG:4326"));

      this.map.removeInteraction(draw);
    });

    this.map.removeInteraction(this.select);
    this.map.addInteraction(draw);

    return () => {
      this.map.removeLayer(vector);
      this.map.addInteraction(this.select);
    };
  }

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

    this.osmLayer = new TileLayer({
      name: "OSM",
      switchType: "radio",
      source: new OSM(),
    });
    this.osmLayer.setVisible(this.activeLayer === this.osmLayer.get("name"));

    this.yandexLayer = new TileLayer({
      name: "Яндекс Карты",
      switchType: "radio",
      source: new XYZ({
        url: "https://vec0{1-4}.maps.yandex.net/tiles?l=map&v=4.55.2&x={x}&y={y}&z={z}",
        projection: "EPSG:3395",
      }),
    });
    this.yandexLayer.setVisible(this.activeLayer === this.yandexLayer.get("name"));

    this.yandexSatelliteLayer = new TileLayer({
      name: "Яндекс Карты (Спутник)",
      switchType: "radio",
      source: new XYZ({
        url: "https://sat0{1-4}.maps.yandex.net/tiles?l=sat&x={x}&y={y}&z={z}",
        projection: "EPSG:3395",
      }),
    });
    this.yandexSatelliteLayer.setVisible(this.activeLayer === this.yandexSatelliteLayer.get("name"));

    this.googleLayer = new TileLayer({
      name: "Google Карты",
      switchType: "radio",
      source: new XYZ({
        url: "http://mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=ru",
        projection: "EPSG:3857",
      }),
    });
    this.googleLayer.setVisible(this.activeLayer === this.googleLayer.get("name"));

    this.googleSatelliteLayer = new TileLayer({
      name: "Google Карты (Спутник)",
      switchType: "radio",
      source: new XYZ({
        url: "http://mt.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&hl=ru",
        projection: "EPSG:3857",
      }),
    });
    this.googleSatelliteLayer.setVisible(this.activeLayer === this.googleSatelliteLayer.get("name"));

    this.bingLayer = new TileLayer({
      name: "Bing Карты",
      switchType: "radio",
      source: new BingMaps({
        culture: "ru-ru",
        key: "AtvW5gEKmgVe7bQwBo-Ndg1iEK7k73kbu8c8SBzVJpkPOnGvyMIDGcT4DJcPnMMG",
        imagerySet: "RoadOnDemand",
      }),
    });
    this.bingLayer.setVisible(this.activeLayer === this.bingLayer.get("name"));

    this.countryLayer = new VectorLayer({
      name: "Страны",
      switchType: "checkbox",
      source: countrySource,
      selectable: true,
    });

    this.cityLayer = new VectorLayer({
      name: "Города",
      switchType: "checkbox",
      source: citySource,
      selectable: true,
    });

    this.map.getLayers().clear();
    this.map.getLayers().extend([
      this.osmLayer,
      this.yandexLayer,
      this.yandexSatelliteLayer,
      this.googleLayer,
      this.googleSatelliteLayer,
      this.bingLayer,
      this.countryLayer,
      this.cityLayer
    ]);
  }
}
