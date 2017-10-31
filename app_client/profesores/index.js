document.addEventListener("DOMContentLoaded", function(event) {
  $.get({
    url: "partials/navbar/profesores",
    success: function(data) {
      document.getElementById('#navbar').innerHTML = data;
      inicializarMaterialize();
      $('#descargar').click( function(){
        descargarCSV();
      });
    }
  })
});

function inicializarMaterialize(){
  $(".button-collapse").sideNav();
  $(".dropdown-button").dropdown();
  $('.modal').modal();
  $('select').material_select();
}

function descargarCSV(){
  const materia   = $('#selectMateriaCSV').val();
  const paralelos = $('#selectParalelosCSV').val();
  const capitulos = $('#selectCapitulosCSV').val();
  const csv       = {
    materia   : materia,
    paralelos : JSON.stringify(paralelos),
    capitulos : JSON.stringify(capitulos)
  };
  
  $.ajax({
    type: 'POST',
    url: '/api/rubrica/csv',
    data: csv,
    success: function(res){
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      if (res.estado) {
        var byteCharacters = atob(res.datos);
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var blob = new Blob([byteArray], {type: 'application/octet-stream'});
        url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'rubrica' + '.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    },
    error: function(err){
      console.log(err)
    }
  });
}