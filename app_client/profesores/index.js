      document.addEventListener("DOMContentLoaded", function(event) {
  $.get({
    url: "./partials/navbar.html",
    success: function(data) {
      document.getElementById('#navbar').innerHTML = data;
    }
  })
});