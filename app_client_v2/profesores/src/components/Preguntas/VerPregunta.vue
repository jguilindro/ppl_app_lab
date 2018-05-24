<template>
  <v-card>
        <v-card-title class="white justify-center">
          <span class="headline white--text espol">Superposición 2</span>
        </v-card-title>
        <v-list two-line>
          <v-list-tile>
            <v-list-tile-action>
              <v-tooltip bottom>
                <v-icon slot="activator">assignment_ind</v-icon>
                <span>Creador</span>
              </v-tooltip>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Eduardo Efrain Montero Carpio</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
        </v-list>
        <v-card-actions>
          <v-tooltip bottom>
              <v-icon slot="activator">assignment</v-icon>
              <span>Descripción</span>
          </v-tooltip>
          <v-subheader>Descripción</v-subheader>
        </v-card-actions>
        <v-card-text>Dos pulsos de igual ancho y amplitud se acercan en lados opuestos de una cuerda (por ejemplo, los pulsos desplazan la cuerda en direcciones opuestas). Las  capturas mostradas fueron tomadas en intervalos de tiempos iguales.</v-card-text>
        <v-card-media src="https://picsum.photos/700?image=996" height="200px"></v-card-media>
        <v-divider></v-divider>
        <v-card-actions>
          <v-subheader>Subpregunta 1</v-subheader>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="show1 = !show1">
            <v-icon>{{ show1 ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
          </v-btn>
        </v-card-actions>
        <v-slide-y-transition>
          <v-card-text v-show="show1">
              I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.
          </v-card-text>
        </v-slide-y-transition>
        <v-divider></v-divider>
        <v-card-actions>
          <v-subheader>Subpregunta 2</v-subheader>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="show2 = !show2">
            <v-icon>{{ show2 ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
          </v-btn>
        </v-card-actions>
        <v-slide-y-transition>
          <v-card-text v-show="show2">
              La caca de Edison. 
          </v-card-text>
        </v-slide-y-transition>
      </v-card>
</template>

<script>
  export default {
    data: () => ({
      show1: false,
      show2: false
    })
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.espol{
  color: #001C43 !important;
}
</style>

