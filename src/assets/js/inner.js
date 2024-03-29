/* Functions                                        
--------------------------------------------------------*/
//= components/functions


$(function(){

    // Main menu
    $(".hamburger--in").on("click", function(e){
        e.stopPropagation();
        $(".side-menu").addClass("side-menu--open");
    });

    // menu drop
    $(".menu-drop").on("click", ".menu__caption", function(){
        $(this).closest(".menu").toggleClass("menu-drop--open");
    });

    // Inbox list tbody click
    $(".clickable-row").on("click", function(e){
        if(!e.target.closest("label")) {
            window.location = $(this).data("href");
        }
    });

    // Support Files Upload
    const renderSupportFiles = function(file){
		const input = document.querySelector("#js-support-file-inp");
		
		let html = `<div class="fl-name">
                        <span>${file.name}</span>
                        <span class="fl-close" data-name="${file.name}">
                            <svg>
                                <use xlink:href="#ic-close"></use>
                            </svg>
                        </span>
                        <p class="ps-img"><img src="${file.result}" alt=""/></p>
                    </div>`;
		
		$(".popup__support__inps").append(html).on("click", ".fl-close", function(){
			const dt = new DataTransfer();
			const files = input.files;
			
			for (let i = 0; i < files.length; i++) {
				if (files[i].name !== $(this).attr("data-name"))
					dt.items.add(files[i])
			}
			
			input.files = dt.files;
	
			$(this).parent(".fl-name").remove();
		});	
	}
	//call chat upload
	xupload("#js-support-file-inp", {
		trigger: ".js-support-file-btn",
		multi  : false,
		accept : [".png",".jpg",".jpeg",".gif"],
		cb 	   : function(file) { renderSupportFiles(file); }
	});


    // Document outer click
    $(document).on("click", function(e) { 
        const $target = $(e.target);

        if(!$target.closest(".side-menu").length && $(".side-menu").is(":visible") && !$target.hasClass("hamburger--in")) {
            $(".side-menu").removeClass("side-menu--open");
         }  
    });


    // Document keydown
    $(document).on("keydown", function(e) {
        // ESCAPE key pressed
        if (e.keyCode == 27) {
            // menu
            if($(".side-menu").hasClass("side-menu--open") && $(".side-menu").is(":visible")){
                $(".side-menu").removeClass("side-menu--open");
            }
        }
    });

});