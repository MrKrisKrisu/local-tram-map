<template>
  <div class="px-4 py-5 my-5 text-center">
    <h1 class="display-5 fw-bold text-body-emphasis text-primary">Haltestellenquiz</h1>

    <hr/>
    <h3>{{ this.currentStopName }}</h3>
    <h6>Anzahl gesuchter Linien: {{ this.lineCount }}</h6>

    <div class="d-flex justify-content-center flex-wrap">
      <button
          v-for="line in this.lines"
          :id="line"
          :key="line"
          type="button"
          class="btn btn-outline-primary m-1 text-white"
          @click="checkClickedLine(line)"
      >
        {{ line }}
      </button>
    </div>

    <hr/>

    <div class="d-flex justify-content-center">
      <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          @click="next"
      >
        Überspringen & Nächste Station
      </button>
    </div>

  </div>
</template>

<script>
import {Notyf} from "notyf";

let notyf = new Notyf({
  duration: 2000,
  position: {x: "right", y: "top"}
});

export default {
  name: 'StationGame',
  data() {
    return {
      stops: require('../data/stops.json'),
      lines: require('../data/lines.json'),
      currentStopName: null,
      currentStopLines: null
    }
  },
  computed: {
    lineCount() {
      return this.currentStopLines ? this.currentStopLines.length : null;
    }
  },
  methods: {
    randomStop() {
      let proxyObject = this.stops.sort(() => Math.random() - 0.5).pop();
      return JSON.parse(JSON.stringify(proxyObject));
    },
    next() {
      this.reset();
      let stop = this.randomStop();
      this.currentStopName = stop.name;
      this.currentStopLines = stop.lines;
    },
    checkClickedLine(line) {
      let button = document.getElementById(line);
      if (this.currentStopLines.includes(line)) {
        button.classList.add('btn-success');
      } else {
        button.classList.add('btn-danger');
      }

      if (this.isEveryLineClicked()) {
        notyf.success('Richtig!');
        this.next();
      }
      return true;
    },
    reset() {
      let buttons = document.getElementsByClassName('btn');
      for (const element of buttons) {
        element.classList.remove('btn-success');
        element.classList.remove('btn-danger');
      }
    },
    isEveryLineClicked() {
      let buttons = document.getElementsByClassName('btn-success');
      return buttons.length === this.currentStopLines.length;
    }
  },
  mounted() {
    this.next();
  }
}
</script>

<style>
@import "notyf/notyf.min.css";

.btn.btn-success:hover {
  background-color: #28a745;
  border-color: #28a745;
}

.btn.btn-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
}
</style>
