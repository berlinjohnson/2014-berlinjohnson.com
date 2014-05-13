$(document).ready(function(){

  $('#submit').click(function(e){
    

    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var website = document.getElementById("website").value;
    var message = document.getElementById("message").value;

    console.log("Name:"+name);
    
    if (name === "" || email === "" || message === ""){
      e.preventDefault();
      $("#formError").css("display", "block");
      $(".by70").css("display", "block");
    }
  });

  $('#tryAgain').click(function(e){
    e.preventDefault();

    $("#formError").css("display", "none");
    $(".by70").css("display", "none");
  });


});