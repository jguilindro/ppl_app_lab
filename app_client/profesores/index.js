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

function getImage(input) {
  console.log(input.files[0]);
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $('#source_image')
        .attr('src', e.target.result)
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function comprimir(e){
  var output_format = "jpg";
  var source_image = document.getElementById('source_image');
  var result_image = document.getElementById('result_image');
  if (source_image.src == "") {
      alert("You must load an image first!");
      return false;
  }
  var quality = 15;

  result_image.src = jic.compress(source_image,quality,output_format).src;  
  console.log(result_image);
  result_image.onload = function(){
    var image_width=$(result_image).width(),
      image_height=$(result_image).height();
          
    if(image_width > image_height){
      result_image.style.width="320px";
    }else{
      result_image.style.height="300px";
    }
   result_image.style.display = "block";


  }
}

