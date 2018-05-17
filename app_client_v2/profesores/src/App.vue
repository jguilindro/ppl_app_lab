<template>
  <v-app>
    <v-navigation-drawer app v-model="sidenav">
    </v-navigation-drawer>
    <v-toolbar app dark color="primary">
      <v-toolbar-side-icon @click.stop="sidenav = !sidenav"></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">PPL</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>apps</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      sidenav: false
    }
  },
  name: 'App'
}
</script>
