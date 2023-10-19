<template>
  <div class="px-4 py-5 my-5 text-center">
    <h1 class="display-5 fw-bold text-body-emphasis text-primary">VBK Tools</h1>
    <div class="col-lg-6 mx-auto">
      <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
        <router-link to="/map">Karte</router-link>
        <router-link to="/stations">Haltestellen</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainDashboard',
  mounted() {

  }
}
</script>

<style>

</style>
