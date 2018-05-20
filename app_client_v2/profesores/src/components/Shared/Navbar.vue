<template>
  <main>
    <v-navigation-drawer app v-model="sidenav">
      <v-toolbar flat class="transparent py-2">
        <v-list class="pa-0">
          <v-list-tile>
            <v-list-tile-avatar color="blue" size="45px">
              <v-avatar size="45px">
                <img color="red" src="@/assets/espol.png" alt="">
              </v-avatar>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ usuario.correo }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list>
        <v-list-group v-for="item in items" :key="item.id" no-action>
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-for="subItem in item.items" :key="subItem.id" @click="">
            <v-list-tile-content>
              <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>{{ subItem.action }}</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
        <v-divider></v-divider>
        <v-list-tile @click="logout">
          <v-list-tile-content>
            <v-list-tile-title>Cerrar Sesión</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app dark color="indigo darken-4">
      <v-toolbar-side-icon @click.stop="sidenav = !sidenav"></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">PPL</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat>ATT</v-btn>
        <v-menu v-for="item in items" :key="item.id">
          <v-btn flat slot="activator">
            <span>{{ item.title }}</span>
            <v-icon dark>arrow_drop_down</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile v-for="item in item.items" :key="item.id" @click="" router :to="item.link">
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-btn flat>Grupos</v-btn>
        <v-btn flat @click.native="logout">
          <v-icon>exit_to_app</v-icon>
        </v-btn>  
      </v-toolbar-items>
    </v-toolbar>  
  </main>  
</template>
<script>
export default {
  computed: {
    usuario () {
      return this.$store.getters.usuario
    }
  },
  data () {
    return {
      sidenav: false,
      items: [
        {
          id: '1',
          title: 'Lecciones',
          items: [
            {
              id: '1-1',
              title: 'Crear',
              link: '/lecciones/crear'
            },
            {
              id: '1-2',
              title: 'Ver Todas',
              link: '/lecciones/'
            }
          ]
        },
        {
          id: '2',
          title: 'Preguntas',
          items: [
            {
              id: '2-1',
              title: 'Crear',
              link: '/preguntas/crear'
            },
            {
              id: '2-2',
              title: 'Ver Todas',
              link: '/preguntas/'
            }
          ]
        },
        {
          id: '3',
          title: 'Rúbrica',
          items: [
            {
              id: '3-1',
              title: 'Ingresar',
              link: '/rubrica'
            },
            {
              id: '3-2',
              title: 'CSV'
            }
          ]
        }
      ]
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
    }
  }
}
</script>
<style scoped>
.navigation-drawer>.list:not(.list--dense) .list__tile {
    font-weight: 400 !important;
}
</style>
