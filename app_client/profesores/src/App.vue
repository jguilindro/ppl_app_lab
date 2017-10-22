<template>
  <div id="app">
    <router-link to="/">Perfil</router-link>
    <router-link to="/tomar-leccion">Tomar leccion</router-link>
    <router-link to="/quejas">Quejdas</router-link>
    <router-link to="/prueba">Prueba</router-link>
    <router-link to="/leccion">Leccion</router-link>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>
