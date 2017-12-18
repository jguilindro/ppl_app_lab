<template>
  <v-container>
    <v-layout>
      <v-flex>
        <v-data-table
            v-bind:headers="headers"
            :items="items"
            hide-actions
            class="elevation-1"
          >
          
          
          <template slot="items" slot-scope="props">
            <td>{{ props.item.nombre }}</td>
            <td class="text-xs-right">{{ props.item.tipo }}</td>
            <td class="text-xs-right">{{ props.item.materia_paralelo }}</td>
            <td class="text-xs-right">{{ props.item.f_creada }}</td>
            <td class="text-xs-right">{{ props.item.f_tomada }}</td>
            <td class="text-xs-right">{{ props.item.h_terminada }}</td>
            <td class="text-xs-right">{{ props.item.estado }}</td>
            <td class="text-xs-right">{{ props.item.accion }}</td>
          </template>
        </v-data-table>

          <ul v-if="posts && posts.length">
            <li v-for="post of posts">
              <p><strong>{{post.title}}</strong></p>
              <p>{{post.body}}</p>
            </li>
          </ul>

          <ul v-if="errors && errors.length">
            <li v-for="error of errors">
              {{error.message}}
            </li>
          </ul>
      </v-flex>
    </v-layout>
  </v-container>


</template>


<script>
  import axios from 'axios'

  export default {

    data() {
      return {
        headers: [
          {
            text: 'Estudiante',
            align: 'left',
            sortable: false,
            value: 'nombre',
          },
          { text: 'Tipo', value: 'tipo' },
          { text: 'Paralelo', value: 'materia_paralelo' },
          { text: 'Fecha Creada', value: 'f_creada' },
          { text: 'Fecha Tomada', value: 'f_tomada' },
          { text: 'Hora Terminada', value: 'h_terminada' },
          { text: 'Estado', value: 'estado' },
          { text: 'Accion', value: 'accion' },

        ],
        items: [
          {
            value: false,
            nombre: 'Frozen Yogurt',
            materia_paralelo: 159,
            tipo: 6.0,
            f_creada: 24,
            f_tomada: 4.0,
            h_terminada: 87,
            estado: '14%',
            accion: '1%',
          },
          {
            value: false,
            nombre: 'Ice cream sandwich',
            materia_paralelo: 237,
            tipo: 9.0,
            f_creada: 37,
            f_tomada: 4.3,
            h_terminada: 129,
            estado: '8%',
            accion: '1%',
          },
          {
            value: false,
            nombre: 'Eclair',
            materia_paralelo: 262,
            tipo: 16.0,
            f_creada: 23,
            f_tomada: 6.0,
            h_terminada: 337,
            estado: '6%',
            accion: '7%',
          },
          {
            value: false,
            nombre: 'Cupcake',
            materia_paralelo: 305,
            tipo: 3.7,
            f_creada: 67,
            f_tomada: 4.3,
            h_terminada: 413,
            estado: '3%',
            accion: '8%',
          },
          {
            value: false,
            nombre: 'Gingerbread',
            materia_paralelo: 356,
            tipo: 16.0,
            f_creada: 49,
            f_tomada: 3.9,
            h_terminada: 327,
            estado: '7%',
            accion: '16%',
          },
          {
            value: false,
            nombre: 'Jelly bean',
            materia_paralelo: 375,
            tipo: 0.0,
            f_creada: 94,
            f_tomada: 0.0,
            h_terminada: 50,
            estado: '0%',
            accion: '0%',
          },
          {
            value: false,
            nombre: 'Lollipop',
            materia_paralelo: 392,
            tipo: 0.2,
            f_creada: 98,
            f_tomada: 0,
            h_terminada: 38,
            estado: '0%',
            accion: '2%',
          },
          {
            value: false,
            nombre: 'Honeycomb',
            materia_paralelo: 408,
            tipo: 3.2,
            f_creada: 87,
            f_tomada: 6.5,
            h_terminada: 562,
            estado: '0%',
            accion: '45%',
          },
          {
            value: false,
            nombre: 'Donut',
            materia_paralelo: 452,
            tipo: 25.0,
            f_creada: 51,
            f_tomada: 4.9,
            h_terminada: 326,
            estado: '2%',
            accion: '22%',
          },
          {
            value: false,
            nombre: 'KitKat',
            materia_paralelo: 518,
            tipo: 26.0,
            f_creada: 65,
            f_tomada: 7,
            h_terminada: 54,
            estado: '12%',
            accion: '6%',
          },
        ],
        posts: [],
        errors: [],
      }
    },


    methods: {
      getCourses() {
        const url = '/api/lecciones/'
        axios.get(url)
      .then((response) => {
        // JSON responses are automatically parsed.
        this.posts = response.data
        console.log('no sirve tu webda')
        console.log(response.data)
      })
      .catch((e) => {
        this.errors.push(e)
        console.log(e)
      })
      },
    },
  }
</script>

<style>
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
  color: #35495E;
}
</style>
