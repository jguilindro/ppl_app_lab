<template>
  <v-app >
    <!-- <div id="main" v-show="loggeado"> -->
        <v-navigation-drawer id="navegacion" v-model="sideNav" temporary>
        <avatar id="avatarUsuario" :username="estudiante.apellidos" :size="55" color="#fff"></avatar>  
          <div id="info">
              <div id="nombres">{{estudiante.apellidos}} {{estudiante.nombres}}</div>
              <div id="correo">{{estudiante.correo}}</div>
          </div>

        <v-list>
          <v-divider></v-divider>
          <v-list-tile v-for="item in items" :key="item.title" @click="">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>{{ item.title }}</v-list-tile-content>
          </v-list-tile>

        </v-list>
      </v-navigation-drawer>

      <v-toolbar class="cyan darken-4 white--text col-12">
        <v-toolbar-side-icon
          @click.stop="sideNav = !sideNav"
          class="white--text">
        </v-toolbar-side-icon>
        <v-avatar size="100px">
          <img id="logo_espol" src="http://ceemp.org/wp-content/uploads/2016/03/ESPOL-Logo-nuevotransparente.png" alt="">
        </v-avatar>
        <v-toolbar-title class="hidden-xs-only">Peer Proyect Learning</v-toolbar-title>
        <v-toolbar-title class="hidden-sm-and-up">PPL</v-toolbar-title>
      </v-toolbar>
      <main>
          <router-view class="grey lighten-3"></router-view>
      </main>

      <v-footer class="cyan darken-4 white--text">
        <div id="footer" class="white--text">ESPOL ©2017</div>
      </v-footer>
    <!-- </div>
    <div v-show="!loggeado">
      <router-view></router-view>
    </div> -->
  </v-app>
</template>



<script>
  import { mapGetters } from 'vuex'

  // npm install vue-avatar
  // npm i -S vue-avatar
  import Avatar from 'vue-avatar/dist/Avatar'

  export default {
    computed: mapGetters([
      'loggeado',
      'estudiante',
      'lecciones',
    ]),
    components: { Avatar },
    data() {
      return {
        sideNav: false,
        nombre1: 'Bosco Andrade',
        items: [
          { title: 'Cerrar Sesión', icon: 'exit_to_app' },
          { title: 'About', icon: 'question_answer' },
        ],
      }
    },
  }

</script>

<style>

  main {
    width: 100%;
    /*border: 1px solid red;*/
  }

  ul {
    padding-top: 0em !important;
    padding-bottom: 0em !important;
  }

  #container_general {
    width: 100%;
    padding-top: 0em !important;
    padding-bottom: 0em !important;
    padding-left: 10% !important;
    padding-right: 10% !important;
  }

  /*Toolbar*/
  .toolbar__content{
    height: 7em !important;
  }

  #logo_espol{
    padding: 8px;
  }

  /*Botón hamburguesa*/
  .navigation-drawer {
    width: auto !important;
  }

    #avatarUsuario {
      margin-top: 1em;
      margin-bottom: 0.5em;
    }

    #avatarUsuario *{
      display: table;
      margin: 0 auto;
    }

    #info {
      text-align: center;
      margin-left: 1em;
      margin-right: 1em;
      margin-bottom: 1em;
    }

    #nombres {
      font-weight: bold;
    }

    #correo {
      opacity: 0.5;
    }

  /*Titulo Princiapl*/
  .toolbar__title{
    font-size: 2em;
  }

  /*Footer*/
  #footer {
    width: 100%;
    text-align: center;
  }

  @media only screen and (max-width : 750px) {
    #container_general {
      width: 100%;
      padding-top: 0em !important;
      padding-bottom: 0em !important;
      padding-left: 0% !important;
      padding-right: 0% !important;
    }

    #navegacion {
      width: 75% !important;
    }

  }

</style>
