$(document).ready(function(){


// Scrolls to element in mseconds

  scrollTo = function(element, mseconds){
    $('html, body').animate({
        scrollTop: element.offset().top
      }, mseconds);
  }

//----------------------------------------------------------------//

  // ---- Scroll to Portfolio section ---- //

  $("#portfolioLink").click(function(e){
    e.preventDefault();
    scrollTo($("#portfolioTop"), 600);
  });


  // ---- Make belowFold fill whole screen with min-height ---- //
  $("#belowFold").css("min-height", $("#aboveFold").height()-$(".portfolioNav").height());


  // ---- Displays Portfolio Categories, Highlights Current Category ---- //

  var previousDisplay = "all";

  //Make 'All' highlighted to start
  $("#allImgLink").css("color", "#F1645A");

  //Click Portfolio Nav Category
  $(".portfolioNav a").click(function(e){
    e.preventDefault();

    var currentDisplay = e.target.id.substring(0, e.target.id.length - 7);

    //Removes preivous Highlight, Adds current Highlight
    $("#"+previousDisplay+"ImgLink").css("color", "auto");
    $("#"+currentDisplay+"ImgLink").css("color", "#F1645A");

    //Scrolls back to top of Portfolio
    scrollTo($("#portfolioTop"), 300);

    //Removes Previous Display
    $("." + previousDisplay + "Img").fadeOut("fast", function() {
      //Adds Current Display after fade out has completed
      $("." + currentDisplay + "Img").fadeIn("slow");
      previousDisplay = currentDisplay;
    });

  });

  // ---- Keep Portfolio Nav on Top after you scroll past it ---- //

  var currentlyFixed = false;

  fixMenu = function(){
    $(".portfolioNav").css("position", "fixed");
    $(".portfolioNav").css("top", "0");
    $(".portfolioNav").css("bottom", "");
    currentlyFixed = true;
  };

  unfixMenu = function(){
    $(".portfolioNav").css("position", "absolute");
    $(".portfolioNav").css("bottom", "0");
    $(".portfolioNav").css("top", "");
    currentlyFixed = false;

  };

  aboveFold = function(){
    if ($(window).scrollTop() > ($("#aboveFold").height()-$(".portfolioNav").height())){
      return false;
    }
    else {
      return true;
    }
  };

  $(window).scroll(function(){ 
    if (aboveFold()){
      if (currentlyFixed){
        unfixMenu();
      }
    }
    else if (aboveFold() === false){
      if (currentlyFixed === false){
        fixMenu();
      }
    } 
  });


  // ---- Portfolio Modal ---- //

  var data = {};
  $.getJSON( "json/sortingLabels.json", function( imgList ) {
        $.each( imgList, function(img) {
          data[imgList[img].fileName]= imgList[img]
        });
  });


  $('.column img').click(function(e){
      e.preventDefault();
      var clicked = $(this);
      $(".modal").fadeIn('fast');
      $(".darkenScreen").fadeIn('fast');
      $("body").addClass("modal-open");

      var src = $(this).attr("src");
      var imageFile = src.substring(src.lastIndexOf("300"));
      src = src.replace("300", "");
      src = src.replace("thumbs", "originals");

      if (imageFile in data){     
        if ("video" in data[imageFile]){
          $(".clickImage").prepend(data[imageFile].video);
        }
        else {
          $(".clickImage").prepend('<img class="temp" src="'+src+'"/>');
        }
        $(".caption").append("<p class='temp'>"+data[imageFile].caption+"</p>");

      }
   
    });


  $('.modal').click(function(){
    $(".temp").remove();
    $(".modal").fadeOut('fast');
    $(".darkenScreen").fadeOut('fast');
    $("body").removeClass("modal-open")
  });

  var zoomed = false  

  $('.clickImage').click(function(e){
    e.stopPropagation();
    if (zoomed){
      $('.clickImage img').css('max-height', '100%');
      $('.clickImage img').css('cursor', '-webkit-zoom-in');
      zoomed = false;
    }
    else {
      $('.clickImage img').css('max-height', 'none');
      $('.clickImage img').css('cursor', '-webkit-zoom-out');
      zoomed = true;
    }
  });  

  $('.caption').click(function(e){
    e.stopPropagation();
  }); 




});