import {Deck} from '@deck.gl/core';
import {GeoJsonLayer, ArcLayer} from '@deck.gl/layers';
import {GeoProjectionExtension, GeoProjectionView} from '@deck.gl/extensions';
import * as d3 from 'd3-geo';

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const COUNTRIES =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson'; //eslint-disable-line
const AIR_PORTS =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson';

const INITIAL_VIEW_STATE = {
  latitude: 51.47,
  longitude: 0.45,
  zoom: 4,
  bearing: 0,
  pitch: 0
};

// Provides the correct viewport and controller
const VIEW = new GeoProjectionView({
  // projection: d3.geoEqualEarth()
  // projection: d3.geoConicConformal()
  // projection: d3.geoStereographic()
  projection: d3.geoAzimuthalEqualArea()
});
const EXTENSIONS = [new GeoProjectionExtension()];

export const deck = new Deck({
  views: VIEW,
  initialViewState: INITIAL_VIEW_STATE,
  controller: true,
  layers: [
    new GeoJsonLayer({
      id: 'base-map',
      data: COUNTRIES,
      // Styles
      stroked: true,
      filled: true,
      lineWidthMinPixels: 2,
      opacity: 0.4,
      getLineDashArray: [3, 3],
      getLineColor: [60, 60, 60],
      getFillColor: [200, 200, 200],
      extensions: EXTENSIONS
    }),
    new GeoJsonLayer({
      id: 'airports',
      data: AIR_PORTS,
      // Styles
      filled: true,
      pointRadiusMinPixels: 2,
      opacity: 1,
      pointRadiusScale: 2000,
      getRadius: f => 11 - f.properties.scalerank,
      getFillColor: [200, 0, 80, 180],
      extensions: EXTENSIONS,
      // Interactive props
      pickable: true,
      autoHighlight: true,
      onClick: info =>
        // eslint-disable-next-line
        info.object && alert(`${info.object.properties.name} (${info.object.properties.abbrev})`)
    }),
    new ArcLayer({
      id: 'arcs',
      data: AIR_PORTS,
      dataTransform: d => d.features.filter(f => f.properties.scalerank < 4),
      // Styles
      getSourcePosition: f => [-0.4531566, 51.4709959], // London
      getTargetPosition: f => f.geometry.coordinates,
      getSourceColor: [0, 128, 200],
      getTargetColor: [200, 0, 80],
      extensions: EXTENSIONS,
      getWidth: 1
    })
  ]
});

// For automated test cases
/* global document */
document.body.style.margin = '0px';
