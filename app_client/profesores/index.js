document.addEventListener("DOMContentLoaded", function(event) {
  $.get({
    url: "/navbar/profesores",
    success: function(data) {
      document.getElementById('#navbar').innerHTML = data;
      $(".button-collapse").sideNav();
      $(".dropdown-button").dropdown();
    }
  })
});
