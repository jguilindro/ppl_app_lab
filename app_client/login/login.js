function realizarLogin(){
	var credenciales={
	 username: "a",
	 password: "a",
	 rol: "a"
	}
	credenciales.username=$('#username').val();
	credenciales.password=$('#password').val();
	credenciales.rol= $("#rol").val();
	
	$.ajax({
	type: "POST",
	  url: "http://localhost:3000/login",
	  data: JSON.stringify(credenciales),
	  success: function(data){
	  window.location.assign("http://localhost:3000/"+data);
	  
	  },
	  error: function(error){
          if(error.responseText == 'showAlert')
              alert("Usuario o Contraseña Incorrectos.")},
	  contentType: 'application/json'
	});
}