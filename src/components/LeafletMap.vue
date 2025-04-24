<template>
  <div id="map"></div>
</template>

<script>
import L from 'leaflet';
import LineColor from "@/components/LineColor.vue";

let map;
let layerControl;
let switches = {};
let st1 = {};
let st2 = {};
let sh7 = {};
let layers = {};

export default {
  name: 'LeafletMap',
  mounted() {
    map = L.map('map', {
      center: [49.009574469179896, 8.40394520151058],
      zoom: 14
    });
    this.initLayers();
    this.initMap();
    this.locate();
  },
  computed: {
    iconSh7() {
      return L.icon({
        iconUrl: require('../assets/icons/sh7.png'),
        iconSize: [15, 23],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10],
        shadowUrl: null,
      });
    },
    iconSt1() {
      return L.icon({
        iconUrl: require('../assets/icons/st1.svg'),
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10],
        shadowUrl: null,
      });
    },
    iconSt2() {
      return L.icon({
        iconUrl: require('../assets/icons/st2.svg'),
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10],
        shadowUrl: null,
      });
    }
  },
  methods: {
    getIconSwitch(element) {
      let color = 'grey';
      if (element.tags?.['railway:switch:electric'] === 'yes') {
        color = 'green';
      } else if (element.tags?.['railway:switch:electric'] === 'no') {
        color = 'red';
      }

      return L.icon({
        iconUrl: require('../assets/icons/dot-' + color + '.svg'),
        iconSize: [15, 15],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10],
        shadowUrl: null,
      });
    },
    getJourneyIcon(journey) {
      let color = LineColor.methods.getColor(journey);

      return L.divIcon({
        html: '<i class="fa-solid fa-train" style="line-height: 24px; font-size: 20px; color: ' + color + '"></i>',
        iconSize: [24, 24],
        backgroundColor: 'transparent',
      });
    },
    locate() {
      map.locate({setView: true, maxZoom: 16});
    },
    initLayers() {
      layerControl = L.control.layers(layers['switches']).addTo(map).expand();

      let base = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      layerControl.addBaseLayer(base, "Hintergrundkarte");

      let orm = L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
        attribution: '© OpenRailwayMap contributors'
      }).addTo(map);
      layerControl.addOverlay(orm, "Infrastruktur");

      let ormSpeed = L.tileLayer('https://{s}.tiles.openrailwaymap.org/maxspeed/{z}/{x}/{y}.png', {
        attribution: '© OpenRailwayMap contributors'
      });
      layerControl.addOverlay(ormSpeed, "Geschwindigkeitsbegrenzungen");
    },
    initMap() {
      layers['switches'] = L.layerGroup().addTo(map);
      layerControl.addOverlay(layers['switches'], "Weichen");
      layers['st1'] = L.layerGroup().addTo(map);
      layerControl.addOverlay(layers['st1'], "Signalkontakte");
      layers['st2'] = L.layerGroup().addTo(map);
      layerControl.addOverlay(layers['st2'], "Weichenkontakte");
      layers['journeys'] = L.layerGroup().addTo(map);
      layerControl.addOverlay(layers['journeys'], "Fahrzeuge");
      layers['sh7'] = L.layerGroup().addTo(map);
      layerControl.addOverlay(layers['sh7'], "Standanforderungen");

      this.refreshMap();
      map.on('dragend', this.refreshMap);
    },
    refreshMap() {
      this.fetchSwitches();
      this.fetchSt1();
      this.fetchSt2();
      this.fetchSh7();
    },
    fetchSh7() {
      const bbox = map.getBounds();
      let bboxString = bbox._southWest.lat + ',' + bbox._southWest.lng + ',' + bbox._northEast.lat + ',' + bbox._northEast.lng;
      const query = encodeURIComponent('[out:json][timeout:25];(node["railway:signal:switch"="DE-BOStrab:st1"]["railway:signal:stop"="DE-BOStrab:sh7"]["operator"~"Verkehrs"](') + bboxString + encodeURIComponent('););out body;>;out skel qt;');
      fetch('https://overpass-api.de/api/interpreter?data=' + query)
          .then(response => response.json())
          .then(data => {
            if (!data.elements) {
              return;
            }
            data.elements.forEach(element => {
              if (sh7[element.id]) {
                return;
              }
              let popup = '<h3>Standanforderung</h3>';
              if (element.tags?.['railway:signal:states']) {
                let states = element.tags['railway:signal:states'].split(';');
                states.forEach(state => {
                  state = state.replace('left', '<i class="fa-solid fa-left-long"></i> links');
                  state = state.replace('right', '<i class="fa-solid fa-right-long"></i> rechts');
                  state = state.replace('straight', '<i class="fa-solid fa-arrow-up"></i> geradeaus');
                  popup += '<span>' + state + '</span><br />';
                });
              }

              sh7[element.id] = L.marker([element.lat, element.lon])
                  .addTo(layers['sh7'])
                  .bindPopup(popup)
                  .setIcon(this.iconSh7);
            });
          });
    },
    fetchSt1() {
      const bbox = map.getBounds();
      let bboxString = bbox._southWest.lat + ',' + bbox._southWest.lng + ',' + bbox._northEast.lat + ',' + bbox._northEast.lng;
      const query = encodeURIComponent('[out:json][timeout:25];(node["railway:signal:switch"="DE-BOStrab:st1"][!"railway:signal:stop"]["operator"~"Verkehrs"](') + bboxString + encodeURIComponent('););out body;>;out skel qt;');
      fetch('https://overpass-api.de/api/interpreter?data=' + query)
          .then(response => response.json())
          .then(data => {
            if (!data.elements) {
              return;
            }
            data.elements.forEach(element => {
              if (st1[element.id]) {
                return;
              }
              st1[element.id] = L.marker([element.lat, element.lon])
                  .addTo(layers['st1'])
                  .bindPopup(this.getPopupContentForSt1(element))
                  .setIcon(this.iconSt1);
            });
          });
    },
    fetchSt2() {
      const bbox = map.getBounds();
      let bboxString = bbox._southWest.lat + ',' + bbox._southWest.lng + ',' + bbox._northEast.lat + ',' + bbox._northEast.lng;
      const query = encodeURIComponent('[out:json][timeout:25];(node["railway:signal:switch"="DE-BOStrab:st2"]["operator"~"Verkehrs"](') + bboxString + encodeURIComponent('););out body;>;out skel qt;');
      fetch('https://overpass-api.de/api/interpreter?data=' + query)
          .then(response => response.json())
          .then(data => {
            data.elements.forEach(element => {
              if (st2[element.id]) {
                return;
              }
              st2[element.id] = L.marker([element.lat, element.lon])
                  .addTo(layers['st2'])
                  .setIcon(this.iconSt2);
            });
          });
    },
    fetchSwitches() {
      const bbox = map.getBounds();
      let bboxString = bbox._southWest.lat + ',' + bbox._southWest.lng + ',' + bbox._northEast.lat + ',' + bbox._northEast.lng;
      const query = encodeURIComponent('[out:json][timeout:25];(node["railway"="switch"]["operator"~"Verkehrs"](') + bboxString + encodeURIComponent('););out body;>;out skel qt;');
      fetch('https://overpass-api.de/api/interpreter?data=' + query)
          .then(response => response.json())
          .then(data => {
            data.elements.forEach(element => {
              if (switches[element.id] || element.tags?.['razed:switch']) {
                return;
              }
              switches[element.id] = L.marker([element.lat, element.lon])
                  .addTo(layers['switches'])
                  .setIcon(this.getIconSwitch(element))
                  .bindPopup(this.getPopupContentForSwitch(element));
            });
          });
    },
    getPopupContentForSwitch(element) {
      let content = '<h3>Weiche ' + element.tags?.ref + '</h3>';

      content += '<p class="text-center">';

      if (element.tags?.['railway:switch:electric']) {
        if (element.tags['railway:switch:electric'] === 'yes') {
          content += '<b class="text-success"><i class="fa-solid fa-check"></i> Elektrischer Antrieb</b><br/>';
        } else {
          content += '<b class="text-danger"><i class="fa-solid fa-xmark"></i> Kein elektrischer Antrieb</b><br/>';
        }
      }

      // railway:local_operated
      if (element.tags?.['railway:local_operated']) {
        if (element.tags['railway:local_operated'] === 'yes') {
          content += '<b class="text-success"><i class="fa-solid fa-check"></i> Ortsgestellt</b><br/>';
        } else {
          content += '<b class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> Ferngestellt!</b><br/>';
        }
      }

      if (element.tags?.['railway:switch:resetting']) {
        if (element.tags['railway:switch:resetting'] === 'yes') {
          content += '<b class="text-success"><i class="fa-solid fa-rotate-left"></i> Rückfallweiche</b><br/>';
        }
      }

      if (element.tags?.['railway:turnout_side']) {
        if (element.tags['railway:turnout_side'] === 'left') {
          content += '<span><i class="fa-solid fa-left-long"></i> Links abzweigend</span><br />';
        } else {
          content += '<span>Rechts abzweigend <i class="fa-solid fa-right-long"></i></span><br/>';
        }
      }

      content += '</p>';

      if (element.tags?.['description']) {
        content += '<i>' + element.tags['description'] + '</i><br />';
      }

      if (element.tags?.['note']) {
        content += '<i>' + element.tags['note'] + '</i><br />';
      }

      if (element.tags?.['fixme']) {
        content += '<hr /><i><b class="text-danger"><i class="fa-regular fa-circle-question"></i> ' + element.tags['fixme'] + '</b></i><br />';
      }

      return content;
    },
    getPopupContentForSt1(element) {
      let content = '<h3>Signalkontakt ' + (element.tags?.ref ?? '') + '</h3>';

      if (element.tags?.['railway:signal:states']) {
        content += '<b><i class="fa-regular fa-hand-point-up"></i> Ansteuerung:</b><br/>';

        let states = element.tags['railway:signal:states'].split(';');
        states.forEach(state => {
          state = state.replace('left', '<i class="fa-solid fa-left-long"></i> links');
          state = state.replace('right', '<i class="fa-solid fa-right-long"></i> rechts');
          state = state.replace('straight', '<i class="fa-solid fa-arrow-up"></i> geradeaus');
          content += '<span>' + state + '</span><br />';
        });
      }

      if (element.tags?.['description']) {
        content += '<i>' + element.tags['description'] + '</i><br />';
      }

      if (element.tags?.['note']) {
        content += '<i>' + element.tags['note'] + '</i><br />';
      }

      if (element.tags?.['fixme']) {
        content += '<hr /><i><b class="text-danger"><i class="fa-regular fa-circle-question"></i> ' + element.tags['fixme'] + '</b></i><br />';
      }

      return content;
    }
  }
}
</script>

<style>
@import 'leaflet';
@import '@fortawesome/fontawesome-free/css/all.css';

body {
  margin: 0;
}

#map {
  /** full screen map */
  height: 100vh;
  width: 100vw;
}

.text-success {
  color: #28a745;
}

.text-danger {
  color: #dc3545;
}

.text-center {
  text-align: center;
}

.leaflet-div-icon {
  background-color: transparent;
  border-color: transparent
}
</style>
