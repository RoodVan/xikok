
/* Functions                                        
--------------------------------------------------------*/
/* wow.js */
//= components/wow

wow = new WOW(
    {
    boxClass:     'wow',      // default
    animateClass: 'animated', // default
    offset:       0,          // default
    mobile:       true,       // default
    live:         true        // default
  }
  );
wow.init();

//= components/popups
 


/* Onload DOM                                        
--------------------------------------------------------*/
$(function(){

    // Home menu
    $(".hamburger--hm").on("click", function(e){
        e.stopPropagation();
        $(".menu-hm").addClass("menu-hm--open");
    });


    // Document outer click
    $(document).on("click", function(e) { 
        const $target = $(e.target);

        // Menu
        if(!$target.closest(".menu-hm").length && $(".menu-hm").is(":visible") && !$target.hasClass("hamburger--hm")) {
           $(".menu-hm").removeClass("menu-hm--open");
        }        
    });


    // Document keydown
    $(document).on("keydown", function(e) {
        // ESCAPE key pressed
        if (e.keyCode == 27) {
            // menu
            if($(".menu-hm").hasClass("menu-hm--open") && $(".menu-hm").is(":visible")){
                $(".menu-hm").removeClass("menu-hm--open");
            }
        }
    });

});