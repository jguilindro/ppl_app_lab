<template>
  <nav id="navbar">
    <div class="nav-wrapper">
      <a href="../grupos" class="brand-logo titulo-nav">Profesor</a>
      <a href="#" data-activates="mobile-demo" class="button-collapse"><i class="material-icons">menu</i></a>
      <ul class="right hide-on-med-and-down ">
        <li><a href="#">Sesiones</a></li>
        <li><a href="#">Lecciones</a></li>
        <li><a href="../grupos">Grupos</a></li>
        <li><a href="../preguntas">Preguntas</a></li>
      </ul>
      <ul class="side-nav" id="mobile-demo">
        <li><a href="#">Sesiones</a></li>
        <li><a href="#">Lecciones</a></li>
        <li><a href="../grupos">Grupos</a></li>
        <li><a href="../preguntas">Preguntas</a></li>
      </ul>
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'navbar'
  }
</script>

