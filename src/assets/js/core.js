
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

//= components/functions

//= components/select

//= libs/noty


function notify(type, text) {
    var n = new Noty({
	    layout 		: 'topRight',
        text        : text,
        type        : type,
        theme 		: 'nest',
        dismissQueue: true,
        closeWith   : ['click','button','timeout'],
        maxVisible  : 10,
        progressBar : false,
        timeout     : 5000,
        buttons 	: false
    }).show();
} 

 


/* Onload DOM                                        
--------------------------------------------------------*/
$(function(){

    // Home menu
    $(".hamburger--hm").on("click", function(e){
        e.stopPropagation();
        $(".menu-hm").addClass("menu-hm--open");
    });

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
    //call Support upload
    xupload("#js-support-file-inp", {
        trigger: ".js-support-file-btn",
        multi  : false,
        accept : [".png",".jpg",".jpeg",".gif"],
        cb 	   : function(file) { renderSupportFiles(file); }
    });


    //Message Files Upload
    let msgFilesSize = 0;
    let msgFilesLength = 0;
    const renderMsgFiles = function(file){
        const input = document.querySelector("#js-msg-file-inp");
        msgFilesSize += Math.round(file.size / 1000);
        msgFilesLength++; 
        
        let html = `<li class="msg__files__item">
                        <img src="${file.result}" alt="">
                        <div class="text-ellipsis">
                            <span>${file.name}</span>
                        </div>
                        <div class="msg__files__hide">
                            <span class="fdelete" data-name="${file.name}" data-size="${Math.round(file.size / 1000)}">
                                <svg>
                                    <use xlink:href="#ic-close"></use>
                                </svg>
                            </span>
                        </div>
                    </li>`;

        if(msgFilesLength > 1) {
            $(".js-msg-files .msg__files__caption").html(`
                <strong>${msgFilesLength} файла</strong>
                <span>${msgFilesSize} KB</span>
            `);
        } else if(input.files.length == 1){
            $(".js-msg-files .msg__files__caption").html(`
                <strong>1 файл</strong>
                <span>${msgFilesSize} KB</span>
            `);
        }
        
        $(".js-msg-files .msg__files__list").append(html);
    }
    //delete Msg file
    $(".js-msg-files .msg__files__list").on("click", ".fdelete", function(){
        const input = document.querySelector("#js-msg-file-inp");
        const dt = new DataTransfer();
        const files = input.files;
        console.log(1);

        for (let i = 0; i < files.length; i++) {
            if (files[i].name !== $(this).attr("data-name"))
                dt.items.add(files[i]);
        }
        
        input.files = dt.files;

        //console.log(msgFilesSize);

        msgFilesSize -= parseInt($(this).attr("data-size"));
        $(this).closest(".msg__files__item").remove();    

        msgFilesLength = $(".js-msg-files .msg__files__item").length;

        if(msgFilesLength != 0) {
            $(".js-msg-files .msg__files__caption").html(`
                <strong>${msgFilesLength} ${msgFilesLength > 1 ? 'файла' : 'файл'}</strong>
                <span>${msgFilesSize} KB</span>
            `);
        }
        else {
            $(".js-msg-files .msg__files__caption").html("");
        }
    });	
    //call Msg upload
    xupload("#js-msg-file-inp", {
        trigger: "#js-msg-file-btn",
        multi  : true,
        accept : [".png",".jpg",".jpeg",".gif"],
        cb 	   : function(file) { renderMsgFiles(file); }
    });


    //Toggle inboxchat
    $(".inboxchat-item").on("click", ".inboxchat-caption", function(){
        $(this).closest(".inboxchat-item").toggleClass("inboxchat-item--open");
    });


    // Btn disabled
    $("[data-btn-unlock]").on("click", ".checkbox__inp", function(){
        let box = $(this).closest("[data-btn-unlock]");
        let btn = box.data("btn-unlock");

        if( box.find(".checkbox__inp:checked").length ) {
            $(btn).prop("disabled", false);
        } else {
            $(btn).prop("disabled", true);
        }
    });

    $("[data-all-checked]").on("click", function(){
        let box = $(this).data("all-checked");
        let checkboxList = $(box + ' input[type="checkbox"]');
        let flag = $(this).find(".checkbox__inp").prop("checked");

        checkboxList.prop( "checked", flag );
    });

    //Quill editor
    if($(".jseditor").length) {

        const quill = new Quill('.jseditor', {
            //debug: 'info',
            modules: {
              toolbar: {
                container: toolbarOptions,
                handlers: {
                    'redo': redo,
                    'undo': undo
                }
              },
              history: {
                delay: 2000,
                maxStack: 500,
                userOnly: true
              }
            },
            //placeholder: 'Compose an epic...',
            theme: 'snow'          
        });

        function undo(){
            return quill.history.undo();
        }
        function redo(){
            return quill.history.redo();
        }

        
        // document.querySelector(".jseditor .ql-editor")
        // .addEventListener('keypress', function (e) {
        //     let element = this;
        //     e.stopPropagation();
        //     console.log(element.offsetHeight, element.scrollHeight);
        //     // if ((element.offsetHeight < element.scrollHeight)) {
        //     //     e.stopPropagation();
        //     // }
        // });
    }


    // Document outer click
    $(document).on("click", function(e) { 
        const $target = $(e.target);

        // Menu
        if(!$target.closest(".menu-hm").length && $(".menu-hm").is(":visible") && !$target.hasClass("hamburger--hm")) {
            $(".menu-hm").removeClass("menu-hm--open");
        }
        // Inner menu
        if(!$target.closest(".side-menu").length && $(".side-menu").is(":visible") && !$target.hasClass("hamburger--in")) {
            $(".side-menu").removeClass("side-menu--open");
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
            // inner menu
            if($(".side-menu").hasClass("side-menu--open") && $(".side-menu").is(":visible")){
                $(".side-menu").removeClass("side-menu--open");
            }
            // popups
            if($(".popup").is(":visible")){
                popup.close('#' + $(".popup:visible").attr("id") );
            }
        }
    });

});