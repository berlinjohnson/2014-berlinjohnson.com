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

    getScrollBarWidth =function() {  
    var inner = document.createElement('p');  
    inner.style.width = "100%";  
    inner.style.height = "200px";  
  
    var outer = document.createElement('div');  
    outer.style.position = "absolute";  
    outer.style.top = "0px";  
    outer.style.left = "0px";  
    outer.style.visibility = "hidden";  
    outer.style.width = "200px";  
    outer.style.height = "150px";  
    outer.style.overflow = "hidden";  
    outer.appendChild (inner);  
  
    document.body.appendChild (outer);  
    var w1 = inner.offsetWidth;  
    outer.style.overflow = 'scroll';  
    var w2 = inner.offsetWidth;  
    if (w1 == w2) w2 = outer.clientWidth;  
  
    document.body.removeChild (outer);  
  
    return (w1 - w2);  
  };


  var scrollBarWidth = getScrollBarWidth()+"px";
  

  openModal = function(clicked){
    $(".modal").fadeIn('fast');
    $(".darkenScreen").fadeIn('fast');
    $("body").addClass("modal-open");
    $('.modal-open').css('padding-right', scrollBarWidth);

    //Gets src for original from thumbnail
    var src = clicked.attr("src");
    var imageFile = src.substring(src.lastIndexOf("300"));
    src = src.replace("300", "");
    src = src.replace("thumbs", "originals");

    //Determines if image or video, adds image and caption
    if (imageFile in data){     
      if ("video" in data[imageFile]){
        $(".clickImage").prepend(data[imageFile].video);
      }
      else {
        $(".clickImage").prepend('<img class="temp" src="'+src+'"/>');
      }
      $(".caption").append("<p class='temp'>"+data[imageFile].caption+"</p>");

    }
  };

  closeModal = function(){
    $(".temp").remove();
    $(".modal").fadeOut('fast');
    $(".darkenScreen").fadeOut('fast');

    $("body").removeClass("modal-open")
  };

  //Opens modal if thumbnail is clicked
  $('.column img').click(function(e){
      e.preventDefault();
      openModal($(this));
    });


  //Closes modal if esc is pressued
  $( document ).on( 'keydown', function ( e ) {
      if ( e.keyCode === 27 ) { // ESC
        closeModal();
      }
  });

  //Closes modal if surrounding area is clicked
  $('.modal').click(function(){
    closeModal();
  });

  //Zooms modal image in and out when clicked
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

  //Prevents modal from closing if text clicked
  $('.caption').click(function(e){
    e.stopPropagation();
  }); 





});