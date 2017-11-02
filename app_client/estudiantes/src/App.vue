<template>
  <v-app>
    <v-navigation-drawer v-model="sideNav" temporary>
      
      <v-list>
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="http://www.iepfvillarreal.com/images/usuario.png" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Bosco Andrade Bravo</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-divider></v-divider>

        <v-list-tile v-for="item in items" :hey="item.title" @click="">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
      </v-list>

    </v-navigation-drawer>


    <v-toolbar class="indigo white--text" height=110>
      <!-- class="hidden-sm-and-up " -->
      <v-toolbar-side-icon
        @click.stop="sideNav = !sideNav"
        class="white--text">
      </v-toolbar-side-icon>
      <v-avatar size="110px">
        <img id="logo_espol" src="http://conduespol.edu.ec/wp-content/themes/conduespol/images/logo_espol_new.png" alt="">
      </v-avatar>

      <v-toolbar-title class="hidden-xs-only"><h4 class="titulo">Peer Proyect Learning</h4></v-toolbar-title>
      <v-toolbar-title class="hidden-sm-and-up"><h2 class="titulo">PPL</h2></v-toolbar-title>

     <!--  <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat>
          <v-icon left dark>exit_to_app</v-icon>
          Cerrar Sesión
        </v-btn>
      </v-toolbar-items> -->

    </v-toolbar>
  
    <main>
      <!-- <router-link to="/ingresar-codigo">Leccion</router-link> -->
      <!-- <div id="main"> -->
        <router-view class="grey lighten-3"></router-view>  
      <!-- </div> -->
      
    </main>

    <v-footer class="indigo">
      <div id="footer" class="white--text">ESPOL ©2017</div>
    </v-footer>

  </v-app>

</template>



<script>
  export default {
    data() {
      return {
        sideNav: false,
        items: [
          { title: 'Cerrar Sesión', icon: 'exit_to_app' },
          { title: 'About', icon: 'question_answer' },
        ],
      }
    },
  }
</script>

<style>
  #usuario {
    width: 100%;
    font-size: 18em;
    border: 1px solid;
    text-align: center;
  }

  .titulo {
    /*border: 1px solid;*/
    padding-top: 15px;
  }

  #footer {
    width: 100%;
    text-align: center;
    height: 50%;
  }

  #main {
    border: 1px solid;
    width: 100%;
    background-color: 
  }

</style>
