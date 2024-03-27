//Debounce
function debounce(func) {
	let timer;
	return function (event) {
		if (timer) clearTimeout(timer);
		timer = setTimeout(func, 200, event);
	};
}

//Popup
const popup = new Popup();
function Popup(){
	
	if(!(this instanceof Popup)) { return new Popup(); }
	
	const wWidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
	const wHeight = window.innerHeight > 0 ? window.innerHeight : screen.height;
	const scrollSize = wWidth - $("body").width();

    const overlay = `<div class="popups-overlay">
                        <a href="./" class="popups-overlay__logo">
                            <img src="assets/img/logo.svg" alt="logo">
                        </a>
                    </div>`;
	
	this.open = function(id, ovr = false){
        $(".popup").hide();
        if(!$(document.body).find('.popups-overlay').length){
            $(document.body).append(overlay);        
        }

        const $overlay = $(document.body).find('.popups-overlay');

		$(`${id} .popup__container`).css("transform","translate(-50%,-400%)");
		
		$(id).fadeIn(1, function(){
			let popupHeight = parseInt( $(`${id} .popup__container`).innerHeight() + 50);
			
			$overlay.css({ "opacity": "1", "min-height": popupHeight + "px" });
						
			if( (wWidth <= 992) || (popupHeight > wHeight) ){
				$(`${id} .popup__container`).css({ "transform":"translate(-50%,0%)", "top": "80px" });
			} else {
				$(`${id} .popup__container`).css("transform","translate(-50%,-50%)");
			}
			
			$("body").css({"overflow": "hidden", "margin-right": scrollSize + "px"});
		});
		
		$(window).on("resize", debounce(
			function() {
				let w = window.innerWidth > 0 ? window.innerWidth : screen.width;
				let h = window.innerHeight > 0 ? window.innerHeight : screen.height;
				let ph = $(`${id} .popup__container`).innerHeight();
				
				if( (w <= 992) || (ph > h) ){
					$(document.body).find(`${id} .popup__container`).css({ "transform":"translate(-50%,0%)", "top": "30px" });
				} else {
					$(document.body).find(`${id} .popup__container`).css({ "transform":"translate(-50%,-50%)", "top": "50%" });
				}		
			}
		));	
	}	

	this.close = function(id){
		$(`${id} .popup__container`).css("transform","translate(-50%, -400%)");
		$(document.body).find('.popups-overlay').css("opacity","0");
		
		setTimeout(function(){
			$(id).hide(0);
			$("body").css({"overflow": "", "margin-right":"0"});
            $(document.body).find('.popups-overlay').remove();
		}, 500);
	}
}
