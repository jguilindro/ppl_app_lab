function salir () {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.location.href = `/` 
    //  document.getElementById("demo").innerHTML = this.responseText;
    }
  };
  xhttp.open("POST", "/api/session/logout", true);
  xhttp.send();
}
