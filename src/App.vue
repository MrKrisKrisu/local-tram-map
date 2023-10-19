<template>
  <html lang="de" data-bs-theme="dark">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>VBK Tools</title>
    </head>
    <body>
      <main>
        <div id="app">

        </div>
      </main>
    </body>
  </html>
  <router-view></router-view>
</template>

<script>

export default {
  name: 'App',
  components: {},
  mounted() {
  }
}
</script>

<style>
:root {
  --bs-primary: #c30a37;
}

@import 'bootstrap';

h1 {
  color: #c30a37;
}
</style>
