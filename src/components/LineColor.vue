<template>
  <div :style="{ color: getColor(journey) }">
    <slot></slot>
  </div>
</template>

<script>


export default {
  name: 'LineColor',
  components: {},
  methods: {
    getColor(journey) {
      if (journey?.line?.id === '4-a6s1-1') return '#00a76d';
      if (journey?.line?.id === '4-a6-2') return '#a066aa';
      if (journey?.line?.id === '4-a6s4-4') return '#ae4a63';
      if (journey?.line?.id === '4-a6s5-5') return '#f69795';
      if (journey?.line?.id === '4-a6s6-6') return '#282268';
      if (journey?.line?.id === '4-a6s7-7') return '#fff200';
      if (journey?.line?.id === '4-a6s8-8') return '#6e692a';
      if (journey?.line?.id === '4-a6s11-11') return '#00a76d';
      if (journey?.line?.id === '4-a6s12-12') return '#00a76d';
      if (journey?.line?.id === '4-a6s31-31') return '#00a99d';
      if (journey?.line?.id === '4-a6s32-32') return '#00a99d';
      if (journey?.line?.id === '4-a6s41-41') return '#bed730';
      if (journey?.line?.id === '4-a6s42-42') return '#0097bb';
      if (journey?.line?.id === '4-a6s51-51') return '#f69795';
      if (journey?.line?.id === '4-a6s52-52') return '#f69795';
      if (journey?.line?.id === '4-a6s71-71') return '#fff200';
      if (journey?.line?.id === '4-a6s81-81') return '#6e692a';
      if (journey?.line?.id === '4-a6s1-fex') return '#00a76d';
      if (journey?.line?.id === '4-kvv22e-e') return '#ffffff';
      if (journey?.line?.id === '8-kvv021-1') return '#ed1c24';
      if (journey?.line?.id === '8-kvv021-2') return '#0071bc';
      if (journey?.line?.id === '8-kvv021-3') return '#947139';
      if (journey?.line?.id === '8-kvv021-4') return '#ffcb04';
      if (journey?.line?.id === '8-kvv021-5') return '#00c0f3';
      if (journey?.line?.id === '8-kvv021-16') return '#660000';
      if (journey?.line?.id === '8-kvv021-17') return '#660000';
      if (journey?.line?.id === '8-kvv021-18') return '#197248';
      if (journey?.line?.id === '8-kvv021-e') return '#ffffff';
      if (journey?.line?.id === '8-kvv021-nl1') return '#ed1c24';
      if (journey?.line?.id === '8-kvv021-nl2') return '#0071bc';
      return '#000';
    }
  }
}
</script>


<style></style>
