
/* Functions                                        
--------------------------------------------------------*/
/* wow.js */
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
      define(['module', 'exports'], factory);
    } else if (typeof exports !== "undefined") {
      factory(module, exports);
    } else {
      var mod = {
        exports: {}
      };
      factory(mod, mod.exports);
      global.WOW = mod.exports;
    }
  })(this, function (module, exports) {
    'use strict';
  
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
  
    var _class, _temp;
  
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
  
    var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
  
      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();
  
    function isIn(needle, haystack) {
      return haystack.indexOf(needle) >= 0;
    }
  
    function extend(custom, defaults) {
      for (var key in defaults) {
        if (custom[key] == null) {
          var value = defaults[key];
          custom[key] = value;
        }
      }
      return custom;
    }
  
    function isMobile(agent) {
      return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent)
      );
    }
  
    function createEvent(event) {
      var bubble = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      var cancel = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
      var detail = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
  
      var customEvent = void 0;
      if (document.createEvent != null) {
        // W3C DOM
        customEvent = document.createEvent('CustomEvent');
        customEvent.initCustomEvent(event, bubble, cancel, detail);
      } else if (document.createEventObject != null) {
        // IE DOM < 9
        customEvent = document.createEventObject();
        customEvent.eventType = event;
      } else {
        customEvent.eventName = event;
      }
  
      return customEvent;
    }
  
    function emitEvent(elem, event) {
      if (elem.dispatchEvent != null) {
        // W3C DOM
        elem.dispatchEvent(event);
      } else if (event in (elem != null)) {
        elem[event]();
      } else if ('on' + event in (elem != null)) {
        elem['on' + event]();
      }
    }
  
    function addEvent(elem, event, fn) {
      if (elem.addEventListener != null) {
        // W3C DOM
        elem.addEventListener(event, fn, false);
      } else if (elem.attachEvent != null) {
        // IE DOM
        elem.attachEvent('on' + event, fn);
      } else {
        // fallback
        elem[event] = fn;
      }
    }
  
    function removeEvent(elem, event, fn) {
      if (elem.removeEventListener != null) {
        // W3C DOM
        elem.removeEventListener(event, fn, false);
      } else if (elem.detachEvent != null) {
        // IE DOM
        elem.detachEvent('on' + event, fn);
      } else {
        // fallback
        delete elem[event];
      }
    }
  
    function getInnerHeight() {
      if ('innerHeight' in window) {
        return window.innerHeight;
      }
  
      return document.documentElement.clientHeight;
    }
  
    // Minimalistic WeakMap shim, just in case.
    var WeakMap = window.WeakMap || window.MozWeakMap || function () {
      function WeakMap() {
        _classCallCheck(this, WeakMap);
  
        this.keys = [];
        this.values = [];
      }
  
      _createClass(WeakMap, [{
        key: 'get',
        value: function get(key) {
          for (var i = 0; i < this.keys.length; i++) {
            var item = this.keys[i];
            if (item === key) {
              return this.values[i];
            }
          }
          return undefined;
        }
      }, {
        key: 'set',
        value: function set(key, value) {
          for (var i = 0; i < this.keys.length; i++) {
            var item = this.keys[i];
            if (item === key) {
              this.values[i] = value;
              return this;
            }
          }
          this.keys.push(key);
          this.values.push(value);
          return this;
        }
      }]);
  
      return WeakMap;
    }();
  
    // Dummy MutationObserver, to avoid raising exceptions.
    var MutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver || (_temp = _class = function () {
      function MutationObserver() {
        _classCallCheck(this, MutationObserver);
  
        if (typeof console !== 'undefined' && console !== null) {
          console.warn('MutationObserver is not supported by your browser.');
          console.warn('WOW.js cannot detect dom mutations, please call .sync() after loading new content.');
        }
      }
  
      _createClass(MutationObserver, [{
        key: 'observe',
        value: function observe() {}
      }]);
  
      return MutationObserver;
    }(), _class.notSupported = true, _temp);
  
    // getComputedStyle shim, from http://stackoverflow.com/a/21797294
    var getComputedStyle = window.getComputedStyle || function getComputedStyle(el) {
      var getComputedStyleRX = /(\-([a-z]){1})/g;
      return {
        getPropertyValue: function getPropertyValue(prop) {
          if (prop === 'float') {
            prop = 'styleFloat';
          }
          if (getComputedStyleRX.test(prop)) {
            prop.replace(getComputedStyleRX, function (_, _char) {
              return _char.toUpperCase();
            });
          }
          var currentStyle = el.currentStyle;
  
          return (currentStyle != null ? currentStyle[prop] : void 0) || null;
        }
      };
    };
  
    var WOW = function () {
      function WOW() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  
        _classCallCheck(this, WOW);
  
        this.defaults = {
          boxClass: 'wow',
          animateClass: 'animated',
          offset: 0,
          mobile: true,
          live: true,
          callback: null,
          scrollContainer: null,
          resetAnimation: true
        };
  
        this.animate = function animateFactory() {
          if ('requestAnimationFrame' in window) {
            return function (callback) {
              return window.requestAnimationFrame(callback);
            };
          }
          return function (callback) {
            return callback();
          };
        }();
  
        this.vendors = ['moz', 'webkit'];
  
        this.start = this.start.bind(this);
        this.resetAnimation = this.resetAnimation.bind(this);
        this.scrollHandler = this.scrollHandler.bind(this);
        this.scrollCallback = this.scrollCallback.bind(this);
        this.scrolled = true;
        this.config = extend(options, this.defaults);
        if (options.scrollContainer != null) {
          this.config.scrollContainer = document.querySelector(options.scrollContainer);
        }
        // Map of elements to animation names:
        this.animationNameCache = new WeakMap();
        this.wowEvent = createEvent(this.config.boxClass);
      }
  
      _createClass(WOW, [{
        key: 'init',
        value: function init() {
          this.element = window.document.documentElement;
          if (isIn(document.readyState, ['interactive', 'complete'])) {
            this.start();
          } else {
            addEvent(document, 'DOMContentLoaded', this.start);
          }
          this.finished = [];
        }
      }, {
        key: 'start',
        value: function start() {
          var _this = this;
  
          this.stopped = false;
          this.boxes = [].slice.call(this.element.querySelectorAll('.' + this.config.boxClass));
          this.all = this.boxes.slice(0);
          if (this.boxes.length) {
            if (this.disabled()) {
              this.resetStyle();
            } else {
              for (var i = 0; i < this.boxes.length; i++) {
                var box = this.boxes[i];
                this.applyStyle(box, true);
              }
            }
          }
          if (!this.disabled()) {
            addEvent(this.config.scrollContainer || window, 'scroll', this.scrollHandler);
            addEvent(window, 'resize', this.scrollHandler);
            this.interval = setInterval(this.scrollCallback, 50);
          }
          if (this.config.live) {
            var mut = new MutationObserver(function (records) {
              for (var j = 0; j < records.length; j++) {
                var record = records[j];
                for (var k = 0; k < record.addedNodes.length; k++) {
                  var node = record.addedNodes[k];
                  _this.doSync(node);
                }
              }
              return undefined;
            });
            mut.observe(document.body, {
              childList: true,
              subtree: true
            });
          }
        }
      }, {
        key: 'stop',
        value: function stop() {
          this.stopped = true;
          removeEvent(this.config.scrollContainer || window, 'scroll', this.scrollHandler);
          removeEvent(window, 'resize', this.scrollHandler);
          if (this.interval != null) {
            clearInterval(this.interval);
          }
        }
      }, {
        key: 'sync',
        value: function sync() {
          if (MutationObserver.notSupported) {
            this.doSync(this.element);
          }
        }
      }, {
        key: 'doSync',
        value: function doSync(element) {
          if (typeof element === 'undefined' || element === null) {
            element = this.element;
          }
          if (element.nodeType !== 1) {
            return;
          }
          element = element.parentNode || element;
          var iterable = element.querySelectorAll('.' + this.config.boxClass);
          for (var i = 0; i < iterable.length; i++) {
            var box = iterable[i];
            if (!isIn(box, this.all)) {
              this.boxes.push(box);
              this.all.push(box);
              if (this.stopped || this.disabled()) {
                this.resetStyle();
              } else {
                this.applyStyle(box, true);
              }
              this.scrolled = true;
            }
          }
        }
      }, {
        key: 'show',
        value: function show(box) {
          this.applyStyle(box);
          box.className = box.className + ' ' + this.config.animateClass;
          if (this.config.callback != null) {
            this.config.callback(box);
          }
          emitEvent(box, this.wowEvent);
  
          if (this.config.resetAnimation) {
            addEvent(box, 'animationend', this.resetAnimation);
            addEvent(box, 'oanimationend', this.resetAnimation);
            addEvent(box, 'webkitAnimationEnd', this.resetAnimation);
            addEvent(box, 'MSAnimationEnd', this.resetAnimation);
          }
  
          return box;
        }
      }, {
        key: 'applyStyle',
        value: function applyStyle(box, hidden) {
          var _this2 = this;
  
          var duration = box.getAttribute('data-wow-duration');
          var delay = box.getAttribute('data-wow-delay');
          var iteration = box.getAttribute('data-wow-iteration');
  
          return this.animate(function () {
            return _this2.customStyle(box, hidden, duration, delay, iteration);
          });
        }
      }, {
        key: 'resetStyle',
        value: function resetStyle() {
          for (var i = 0; i < this.boxes.length; i++) {
            var box = this.boxes[i];
            box.style.visibility = 'visible';
          }
          return undefined;
        }
      }, {
        key: 'resetAnimation',
        value: function resetAnimation(event) {
          if (event.type.toLowerCase().indexOf('animationend') >= 0) {
            var target = event.target || event.srcElement;
            target.className = target.className.replace(this.config.animateClass, '').trim();
          }
        }
      }, {
        key: 'customStyle',
        value: function customStyle(box, hidden, duration, delay, iteration) {
          if (hidden) {
            this.cacheAnimationName(box);
          }
          box.style.visibility = hidden ? 'hidden' : 'visible';
  
          if (duration) {
            this.vendorSet(box.style, { animationDuration: duration });
          }
          if (delay) {
            this.vendorSet(box.style, { animationDelay: delay });
          }
          if (iteration) {
            this.vendorSet(box.style, { animationIterationCount: iteration });
          }
          this.vendorSet(box.style, { animationName: hidden ? 'none' : this.cachedAnimationName(box) });
  
          return box;
        }
      }, {
        key: 'vendorSet',
        value: function vendorSet(elem, properties) {
          for (var name in properties) {
            if (properties.hasOwnProperty(name)) {
              var value = properties[name];
              elem['' + name] = value;
              for (var i = 0; i < this.vendors.length; i++) {
                var vendor = this.vendors[i];
                elem['' + vendor + name.charAt(0).toUpperCase() + name.substr(1)] = value;
              }
            }
          }
        }
      }, {
        key: 'vendorCSS',
        value: function vendorCSS(elem, property) {
          var style = getComputedStyle(elem);
          var result = style.getPropertyCSSValue(property);
          for (var i = 0; i < this.vendors.length; i++) {
            var vendor = this.vendors[i];
            result = result || style.getPropertyCSSValue('-' + vendor + '-' + property);
          }
          return result;
        }
      }, {
        key: 'animationName',
        value: function animationName(box) {
          var aName = void 0;
          try {
            aName = this.vendorCSS(box, 'animation-name').cssText;
          } catch (error) {
            // Opera, fall back to plain property value
            aName = getComputedStyle(box).getPropertyValue('animation-name');
          }
  
          if (aName === 'none') {
            return ''; // SVG/Firefox, unable to get animation name?
          }
  
          return aName;
        }
      }, {
        key: 'cacheAnimationName',
        value: function cacheAnimationName(box) {
          // https://bugzilla.mozilla.org/show_bug.cgi?id=921834
          // box.dataset is not supported for SVG elements in Firefox
          return this.animationNameCache.set(box, this.animationName(box));
        }
      }, {
        key: 'cachedAnimationName',
        value: function cachedAnimationName(box) {
          return this.animationNameCache.get(box);
        }
      }, {
        key: 'scrollHandler',
        value: function scrollHandler() {
          this.scrolled = true;
        }
      }, {
        key: 'scrollCallback',
        value: function scrollCallback() {
          if (this.scrolled) {
            this.scrolled = false;
            var results = [];
            for (var i = 0; i < this.boxes.length; i++) {
              var box = this.boxes[i];
              if (box) {
                if (this.isVisible(box)) {
                  this.show(box);
                  continue;
                }
                results.push(box);
              }
            }
            this.boxes = results;
            if (!this.boxes.length && !this.config.live) {
              this.stop();
            }
          }
        }
      }, {
        key: 'offsetTop',
        value: function offsetTop(element) {
          // SVG elements don't have an offsetTop in Firefox.
          // This will use their nearest parent that has an offsetTop.
          // Also, using ('offsetTop' of element) causes an exception in Firefox.
          while (element.offsetTop === undefined) {
            element = element.parentNode;
          }
          var top = element.offsetTop;
          while (element.offsetParent) {
            element = element.offsetParent;
            top += element.offsetTop;
          }
          return top;
        }
      }, {
        key: 'isVisible',
        value: function isVisible(box) {
          var offset = box.getAttribute('data-wow-offset') || this.config.offset;
          var viewTop = this.config.scrollContainer && this.config.scrollContainer.scrollTop || window.pageYOffset;
          var viewBottom = viewTop + Math.min(this.element.clientHeight, getInnerHeight()) - offset;
          var top = this.offsetTop(box);
          var bottom = top + box.clientHeight;
  
          return top <= viewBottom && bottom >= viewTop;
        }
      }, {
        key: 'disabled',
        value: function disabled() {
          return !this.config.mobile && isMobile(navigator.userAgent);
        }
      }]);
  
      return WOW;
    }();
  
    exports.default = WOW;
    module.exports = exports['default'];
  });

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

		// Menu close
		if($(".side-menu").is(":visible")) {
			$(".side-menu").removeClass("side-menu--open");
		}   

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

//Upload files
function xupload(selector, options){
	const $input = $(selector);
	const $trigger = $(options.trigger);
	options.cb = options.cb || function(){}
	
	if(options.multi){
		$input.attr("multiple", true);
	}
	
	if(options.accept && Array.isArray(options.accept)){
		$input.attr("accept", options.accept.join(","));
	}
	
	const changeHandler = event => {
		if(!event.target.files.length) return;
		
		const files = Array.from(event.target.files);
				
		files.forEach(file => {
			if(!file.type.match("image")) return;
			
			const reader = new FileReader();
			
			reader.onload = ev => {
				options.cb({name: file.name, result: ev.target.result, size: file.size});
			}
			
			reader.readAsDataURL(file);
		});
	}
	
	$trigger.on("click", () => {
		$input.trigger("click");
	});
	
	$input.on("change", changeHandler);		
}

// Custom select
$(function(){
    var x, i, j, l, ll, selElmnt, a, b, c, s;
    /* Look for any elements with the class "custom-select": */
    x = document.getElementsByClassName("custom-select");
    l = x.length;
    for (i = 0; i < l; i++) {
      selElmnt = x[i].getElementsByTagName("select")[0];
      ll = selElmnt.length;

      if(selElmnt.selectedIndex == 0) {
        selElmnt.options[0].setAttribute("selected", "selected");
      }

      /* For each element, create a new DIV that will act as the selected item: */
      a = document.createElement("DIV");
      s = document.createElement("SPAN");
      a.setAttribute("class", "select-selected");
      s.setAttribute("class", "select-label");
      s.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
      a.appendChild(s);
      x[i].appendChild(a);
      /* For each element, create a new DIV that will contain the option list: */
      b = document.createElement("DIV");
      b.setAttribute("class", "select-items select-hide");
      for (j = 0; j < ll; j++) {
        /* For each option in the original select element,
        create a new DIV that will act as an option item: */
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;

        if(selElmnt.options[j].hasAttribute("selected")){
            c.setAttribute("class", "same-as-selected");
        }

        c.addEventListener("click", function(e) {
            /* When an item is clicked, update the original select box,
            and the selected item: */
            var y, i, k, s, h, sl, yl;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            sl = s.length;
            h = this.parentNode.previousSibling;
            for (i = 0; i < sl; i++) {
              if (s.options[i].innerHTML == this.innerHTML) {
                s.selectedIndex = i;
                h.innerHTML = '<span class="select-label">' + this.innerHTML + "</span>";
                y = this.parentNode.getElementsByClassName("same-as-selected");
                yl = y.length;
                for (k = 0; k < yl; k++) {
                  y[k].removeAttribute("class");
                }
                this.setAttribute("class", "same-as-selected");
                break;
              }
            }
            h.click();
            $(selElmnt).trigger("change");
        });
        b.appendChild(c);
      }
      x[i].appendChild(b);
      a.addEventListener("click", function(e) {
        /* When the select box is clicked, close any other select boxes,
        and open/close the current select box: */
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
      });
    }
    
    function closeAllSelect(elmnt) {
      /* A function that will close all select boxes in the document,
      except the current select box: */
      var x, y, i, xl, yl, arrNo = [];
      x = document.getElementsByClassName("select-items");
      y = document.getElementsByClassName("select-selected");
      xl = x.length;
      yl = y.length;
      for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
          arrNo.push(i)
        } else {
          y[i].classList.remove("select-arrow-active");
        }
      }
      for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
          x[i].classList.add("select-hide");
        }
      }
    }
    
    /* If the user clicks anywhere outside the select box,
    then close all select boxes: */
    document.addEventListener("click", closeAllSelect);
});

/* 
  @package NOTY - Dependency-free notification library 
  @version version: 3.1.4 
  @contributors https://github.com/needim/noty/graphs/contributors 
  @documentation Examples and Documentation - http://needim.github.com/noty 
  @license Licensed under the MIT licenses: http://www.opensource.org/licenses/mit-license.php 
*/

!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("Noty",[],e):"object"==typeof exports?exports.Noty=e():t.Noty=e()}(this,function(){return function(t){function e(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return t[o].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,o){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:o})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=6)}([function(t,e,n){"use strict";function o(t,e,n){var o=void 0;if(!n){for(o in e)if(e.hasOwnProperty(o)&&e[o]===t)return!0}else for(o in e)if(e.hasOwnProperty(o)&&e[o]===t)return!0;return!1}function i(t){t=t||window.event,void 0!==t.stopPropagation?t.stopPropagation():t.cancelBubble=!0}function r(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e="noty_"+t+"_";return e+="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var e=16*Math.random()|0;return("x"===t?e:3&e|8).toString(16)})}function s(t){var e=t.offsetHeight,n=window.getComputedStyle(t);return e+=parseInt(n.marginTop)+parseInt(n.marginBottom)}function u(t,e,n){var o=arguments.length>3&&void 0!==arguments[3]&&arguments[3];e=e.split(" ");for(var i=0;i<e.length;i++)document.addEventListener?t.addEventListener(e[i],n,o):document.attachEvent&&t.attachEvent("on"+e[i],n)}function a(t,e){return("string"==typeof t?t:f(t)).indexOf(" "+e+" ")>=0}function c(t,e){var n=f(t),o=n+e;a(n,e)||(t.className=o.substring(1))}function l(t,e){var n=f(t),o=void 0;a(t,e)&&(o=n.replace(" "+e+" "," "),t.className=o.substring(1,o.length-1))}function d(t){t.parentNode&&t.parentNode.removeChild(t)}function f(t){return(" "+(t&&t.className||"")+" ").replace(/\s+/gi," ")}function h(){function t(){b.PageHidden=document[s],o()}function e(){b.PageHidden=!0,o()}function n(){b.PageHidden=!1,o()}function o(){b.PageHidden?i():r()}function i(){setTimeout(function(){Object.keys(b.Store).forEach(function(t){b.Store.hasOwnProperty(t)&&b.Store[t].options.visibilityControl&&b.Store[t].stop()})},100)}function r(){setTimeout(function(){Object.keys(b.Store).forEach(function(t){b.Store.hasOwnProperty(t)&&b.Store[t].options.visibilityControl&&b.Store[t].resume()}),b.queueRenderAll()},100)}var s=void 0,a=void 0;void 0!==document.hidden?(s="hidden",a="visibilitychange"):void 0!==document.msHidden?(s="msHidden",a="msvisibilitychange"):void 0!==document.webkitHidden&&(s="webkitHidden",a="webkitvisibilitychange"),a&&u(document,a,t),u(window,"blur",e),u(window,"focus",n)}function p(t){if(t.hasSound){var e=document.createElement("audio");t.options.sounds.sources.forEach(function(t){var n=document.createElement("source");n.src=t,n.type="audio/"+m(t),e.appendChild(n)}),t.barDom?t.barDom.appendChild(e):document.querySelector("body").appendChild(e),e.volume=t.options.sounds.volume,t.soundPlayed||(e.play(),t.soundPlayed=!0),e.onended=function(){d(e)}}}function m(t){return t.match(/\.([^.]+)$/)[1]}Object.defineProperty(e,"__esModule",{value:!0}),e.css=e.deepExtend=e.animationEndEvents=void 0;var v="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};e.inArray=o,e.stopPropagation=i,e.generateID=r,e.outerHeight=s,e.addListener=u,e.hasClass=a,e.addClass=c,e.removeClass=l,e.remove=d,e.classList=f,e.visibilityChangeFlow=h,e.createAudioElements=p;var y=n(1),b=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(y);e.animationEndEvents="webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",e.deepExtend=function t(e){e=e||{};for(var n=1;n<arguments.length;n++){var o=arguments[n];if(o)for(var i in o)o.hasOwnProperty(i)&&(Array.isArray(o[i])?e[i]=o[i]:"object"===v(o[i])&&null!==o[i]?e[i]=t(e[i],o[i]):e[i]=o[i])}return e},e.css=function(){function t(t){return t.replace(/^-ms-/,"ms-").replace(/-([\da-z])/gi,function(t,e){return e.toUpperCase()})}function e(t){var e=document.body.style;if(t in e)return t;for(var n=i.length,o=t.charAt(0).toUpperCase()+t.slice(1),r=void 0;n--;)if((r=i[n]+o)in e)return r;return t}function n(n){return n=t(n),r[n]||(r[n]=e(n))}function o(t,e,o){e=n(e),t.style[e]=o}var i=["Webkit","O","Moz","ms"],r={};return function(t,e){var n=arguments,i=void 0,r=void 0;if(2===n.length)for(i in e)e.hasOwnProperty(i)&&void 0!==(r=e[i])&&e.hasOwnProperty(i)&&o(t,i,r);else o(t,n[1],n[2])}}()},function(t,e,n){"use strict";function o(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"global",e=0,n=x;return E.hasOwnProperty(t)&&(n=E[t].maxVisible,Object.keys(P).forEach(function(n){P[n].options.queue!==t||P[n].closed||e++})),{current:e,maxVisible:n}}function i(t){E.hasOwnProperty(t.options.queue)||(E[t.options.queue]={maxVisible:x,queue:[]}),E[t.options.queue].queue.push(t)}function r(t){if(E.hasOwnProperty(t.options.queue)){var e=[];Object.keys(E[t.options.queue].queue).forEach(function(n){E[t.options.queue].queue[n].id!==t.id&&e.push(E[t.options.queue].queue[n])}),E[t.options.queue].queue=e}}function s(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"global";if(E.hasOwnProperty(t)){var e=E[t].queue.shift();e&&e.show()}}function u(){Object.keys(E).forEach(function(t){s(t)})}function a(t){var e=k.generateID("ghost"),n=document.createElement("div");n.setAttribute("id",e),k.css(n,{height:k.outerHeight(t.barDom)+"px"}),t.barDom.insertAdjacentHTML("afterend",n.outerHTML),k.remove(t.barDom),n=document.getElementById(e),k.addClass(n,"noty_fix_effects_height"),k.addListener(n,k.animationEndEvents,function(){k.remove(n)})}function c(t){m(t);var e='<div class="noty_body">'+t.options.text+"</div>"+d(t)+'<div class="noty_progressbar"></div>';t.barDom=document.createElement("div"),t.barDom.setAttribute("id",t.id),k.addClass(t.barDom,"noty_bar noty_type__"+t.options.type+" noty_theme__"+t.options.theme),t.barDom.innerHTML=e,b(t,"onTemplate")}function l(t){return!(!t.options.buttons||!Object.keys(t.options.buttons).length)}function d(t){if(l(t)){var e=document.createElement("div");return k.addClass(e,"noty_buttons"),Object.keys(t.options.buttons).forEach(function(n){e.appendChild(t.options.buttons[n].dom)}),t.options.buttons.forEach(function(t){e.appendChild(t.dom)}),e.outerHTML}return""}function f(t){t.options.modal&&(0===C&&p(),e.DocModalCount=C+=1)}function h(t){if(t.options.modal&&C>0&&(e.DocModalCount=C-=1,C<=0)){var n=document.querySelector(".noty_modal");n&&(k.removeClass(n,"noty_modal_open"),k.addClass(n,"noty_modal_close"),k.addListener(n,k.animationEndEvents,function(){k.remove(n)}))}}function p(){var t=document.querySelector("body"),e=document.createElement("div");k.addClass(e,"noty_modal"),t.insertBefore(e,t.firstChild),k.addClass(e,"noty_modal_open"),k.addListener(e,k.animationEndEvents,function(){k.removeClass(e,"noty_modal_open")})}function m(t){if(t.options.container)return void(t.layoutDom=document.querySelector(t.options.container));var e="noty_layout__"+t.options.layout;t.layoutDom=document.querySelector("div#"+e),t.layoutDom||(t.layoutDom=document.createElement("div"),t.layoutDom.setAttribute("id",e),t.layoutDom.setAttribute("role","alert"),t.layoutDom.setAttribute("aria-live","polite"),k.addClass(t.layoutDom,"noty_layout"),document.querySelector("body").appendChild(t.layoutDom))}function v(t){t.options.timeout&&(t.options.progressBar&&t.progressDom&&k.css(t.progressDom,{transition:"width "+t.options.timeout+"ms linear",width:"0%"}),clearTimeout(t.closeTimer),t.closeTimer=setTimeout(function(){t.close()},t.options.timeout))}function y(t){t.options.timeout&&t.closeTimer&&(clearTimeout(t.closeTimer),t.closeTimer=-1,t.options.progressBar&&t.progressDom&&k.css(t.progressDom,{transition:"width 0ms linear",width:"100%"}))}function b(t,e){t.listeners.hasOwnProperty(e)&&t.listeners[e].forEach(function(e){"function"==typeof e&&e.apply(t)})}function w(t){b(t,"afterShow"),v(t),k.addListener(t.barDom,"mouseenter",function(){y(t)}),k.addListener(t.barDom,"mouseleave",function(){v(t)})}function g(t){delete P[t.id],t.closing=!1,b(t,"afterClose"),k.remove(t.barDom),0!==t.layoutDom.querySelectorAll(".noty_bar").length||t.options.container||k.remove(t.layoutDom),(k.inArray("docVisible",t.options.titleCount.conditions)||k.inArray("docHidden",t.options.titleCount.conditions))&&D.decrement(),s(t.options.queue)}Object.defineProperty(e,"__esModule",{value:!0}),e.Defaults=e.Store=e.Queues=e.DefaultMaxVisible=e.docTitle=e.DocModalCount=e.PageHidden=void 0,e.getQueueCounts=o,e.addToQueue=i,e.removeFromQueue=r,e.queueRender=s,e.queueRenderAll=u,e.ghostFix=a,e.build=c,e.hasButtons=l,e.handleModal=f,e.handleModalClose=h,e.queueClose=v,e.dequeueClose=y,e.fire=b,e.openFlow=w,e.closeFlow=g;var _=n(0),k=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(_),C=(e.PageHidden=!1,e.DocModalCount=0),S={originalTitle:null,count:0,changed:!1,timer:-1},D=e.docTitle={increment:function(){S.count++,D._update()},decrement:function(){if(--S.count<=0)return void D._clear();D._update()},_update:function(){var t=document.title;S.changed?document.title="("+S.count+") "+S.originalTitle:(S.originalTitle=t,document.title="("+S.count+") "+t,S.changed=!0)},_clear:function(){S.changed&&(S.count=0,document.title=S.originalTitle,S.changed=!1)}},x=e.DefaultMaxVisible=5,E=e.Queues={global:{maxVisible:x,queue:[]}},P=e.Store={};e.Defaults={type:"alert",layout:"topRight",theme:"mint",text:"",timeout:!1,progressBar:!0,closeWith:["click"],animation:{open:"noty_effects_open",close:"noty_effects_close"},id:!1,force:!1,killer:!1,queue:"global",container:!1,buttons:[],callbacks:{beforeShow:null,onShow:null,afterShow:null,onClose:null,afterClose:null,onClick:null,onHover:null,onTemplate:null},sounds:{sources:[],volume:1,conditions:[]},titleCount:{conditions:[]},modal:!1,visibilityControl:!1}},function(t,e,n){"use strict";function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0}),e.NotyButton=void 0;var i=n(0),r=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(i);e.NotyButton=function t(e,n,i){var s=this,u=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};return o(this,t),this.dom=document.createElement("button"),this.dom.innerHTML=e,this.id=u.id=u.id||r.generateID("button"),this.cb=i,Object.keys(u).forEach(function(t){s.dom.setAttribute(t,u[t])}),r.addClass(this.dom,n||"noty_btn"),this}},function(t,e,n){"use strict";function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}();e.Push=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"/service-worker.js";return o(this,t),this.subData={},this.workerPath=e,this.listeners={onPermissionGranted:[],onPermissionDenied:[],onSubscriptionSuccess:[],onSubscriptionCancel:[],onWorkerError:[],onWorkerSuccess:[],onWorkerNotSupported:[]},this}return i(t,[{key:"on",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){};return"function"==typeof e&&this.listeners.hasOwnProperty(t)&&this.listeners[t].push(e),this}},{key:"fire",value:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];this.listeners.hasOwnProperty(t)&&this.listeners[t].forEach(function(t){"function"==typeof t&&t.apply(e,n)})}},{key:"create",value:function(){console.log("NOT IMPLEMENTED YET")}},{key:"isSupported",value:function(){var t=!1;try{t=window.Notification||window.webkitNotifications||navigator.mozNotification||window.external&&void 0!==window.external.msIsSiteMode()}catch(t){}return t}},{key:"getPermissionStatus",value:function(){var t="default";if(window.Notification&&window.Notification.permissionLevel)t=window.Notification.permissionLevel;else if(window.webkitNotifications&&window.webkitNotifications.checkPermission)switch(window.webkitNotifications.checkPermission()){case 1:t="default";break;case 0:t="granted";break;default:t="denied"}else window.Notification&&window.Notification.permission?t=window.Notification.permission:navigator.mozNotification?t="granted":window.external&&void 0!==window.external.msIsSiteMode()&&(t=window.external.msIsSiteMode()?"granted":"default");return t.toString().toLowerCase()}},{key:"getEndpoint",value:function(t){var e=t.endpoint,n=t.subscriptionId;return n&&-1===e.indexOf(n)&&(e+="/"+n),e}},{key:"isSWRegistered",value:function(){try{return"activated"===navigator.serviceWorker.controller.state}catch(t){return!1}}},{key:"unregisterWorker",value:function(){var t=this;"serviceWorker"in navigator&&navigator.serviceWorker.getRegistrations().then(function(e){var n=!0,o=!1,i=void 0;try{for(var r,s=e[Symbol.iterator]();!(n=(r=s.next()).done);n=!0){r.value.unregister(),t.fire("onSubscriptionCancel")}}catch(t){o=!0,i=t}finally{try{!n&&s.return&&s.return()}finally{if(o)throw i}}})}},{key:"requestSubscription",value:function(){var t=this,e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],n=this,o=this.getPermissionStatus(),i=function(o){"granted"===o?(t.fire("onPermissionGranted"),"serviceWorker"in navigator?navigator.serviceWorker.register(t.workerPath).then(function(){navigator.serviceWorker.ready.then(function(t){n.fire("onWorkerSuccess"),t.pushManager.subscribe({userVisibleOnly:e}).then(function(t){var e=t.getKey("p256dh"),o=t.getKey("auth");n.subData={endpoint:n.getEndpoint(t),p256dh:e?window.btoa(String.fromCharCode.apply(null,new Uint8Array(e))):null,auth:o?window.btoa(String.fromCharCode.apply(null,new Uint8Array(o))):null},n.fire("onSubscriptionSuccess",[n.subData])}).catch(function(t){n.fire("onWorkerError",[t])})})}):n.fire("onWorkerNotSupported")):"denied"===o&&(t.fire("onPermissionDenied"),t.unregisterWorker())};"default"===o?window.Notification&&window.Notification.requestPermission?window.Notification.requestPermission(i):window.webkitNotifications&&window.webkitNotifications.checkPermission&&window.webkitNotifications.requestPermission(i):i(o)}}]),t}()},function(t,e,n){(function(e,o){/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.1.1
 */
!function(e,n){t.exports=n()}(0,function(){"use strict";function t(t){var e=typeof t;return null!==t&&("object"===e||"function"===e)}function i(t){return"function"==typeof t}function r(t){z=t}function s(t){U=t}function u(){return void 0!==R?function(){R(c)}:a()}function a(){var t=setTimeout;return function(){return t(c,1)}}function c(){for(var t=0;t<Q;t+=2){(0,X[t])(X[t+1]),X[t]=void 0,X[t+1]=void 0}Q=0}function l(t,e){var n=arguments,o=this,i=new this.constructor(f);void 0===i[tt]&&A(i);var r=o._state;return r?function(){var t=n[r-1];U(function(){return P(r,i,t,o._result)})}():S(o,i,t,e),i}function d(t){var e=this;if(t&&"object"==typeof t&&t.constructor===e)return t;var n=new e(f);return g(n,t),n}function f(){}function h(){return new TypeError("You cannot resolve a promise with itself")}function p(){return new TypeError("A promises callback cannot return that same promise.")}function m(t){try{return t.then}catch(t){return it.error=t,it}}function v(t,e,n,o){try{t.call(e,n,o)}catch(t){return t}}function y(t,e,n){U(function(t){var o=!1,i=v(n,e,function(n){o||(o=!0,e!==n?g(t,n):k(t,n))},function(e){o||(o=!0,C(t,e))},"Settle: "+(t._label||" unknown promise"));!o&&i&&(o=!0,C(t,i))},t)}function b(t,e){e._state===nt?k(t,e._result):e._state===ot?C(t,e._result):S(e,void 0,function(e){return g(t,e)},function(e){return C(t,e)})}function w(t,e,n){e.constructor===t.constructor&&n===l&&e.constructor.resolve===d?b(t,e):n===it?(C(t,it.error),it.error=null):void 0===n?k(t,e):i(n)?y(t,e,n):k(t,e)}function g(e,n){e===n?C(e,h()):t(n)?w(e,n,m(n)):k(e,n)}function _(t){t._onerror&&t._onerror(t._result),D(t)}function k(t,e){t._state===et&&(t._result=e,t._state=nt,0!==t._subscribers.length&&U(D,t))}function C(t,e){t._state===et&&(t._state=ot,t._result=e,U(_,t))}function S(t,e,n,o){var i=t._subscribers,r=i.length;t._onerror=null,i[r]=e,i[r+nt]=n,i[r+ot]=o,0===r&&t._state&&U(D,t)}function D(t){var e=t._subscribers,n=t._state;if(0!==e.length){for(var o=void 0,i=void 0,r=t._result,s=0;s<e.length;s+=3)o=e[s],i=e[s+n],o?P(n,o,i,r):i(r);t._subscribers.length=0}}function x(){this.error=null}function E(t,e){try{return t(e)}catch(t){return rt.error=t,rt}}function P(t,e,n,o){var r=i(n),s=void 0,u=void 0,a=void 0,c=void 0;if(r){if(s=E(n,o),s===rt?(c=!0,u=s.error,s.error=null):a=!0,e===s)return void C(e,p())}else s=o,a=!0;e._state!==et||(r&&a?g(e,s):c?C(e,u):t===nt?k(e,s):t===ot&&C(e,s))}function T(t,e){try{e(function(e){g(t,e)},function(e){C(t,e)})}catch(e){C(t,e)}}function O(){return st++}function A(t){t[tt]=st++,t._state=void 0,t._result=void 0,t._subscribers=[]}function M(t,e){this._instanceConstructor=t,this.promise=new t(f),this.promise[tt]||A(this.promise),I(e)?(this.length=e.length,this._remaining=e.length,this._result=new Array(this.length),0===this.length?k(this.promise,this._result):(this.length=this.length||0,this._enumerate(e),0===this._remaining&&k(this.promise,this._result))):C(this.promise,q())}function q(){return new Error("Array Methods must be provided an Array")}function j(t){return new M(this,t).promise}function N(t){var e=this;return new e(I(t)?function(n,o){for(var i=t.length,r=0;r<i;r++)e.resolve(t[r]).then(n,o)}:function(t,e){return e(new TypeError("You must pass an array to race."))})}function L(t){var e=this,n=new e(f);return C(n,t),n}function H(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function W(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}function V(t){this[tt]=O(),this._result=this._state=void 0,this._subscribers=[],f!==t&&("function"!=typeof t&&H(),this instanceof V?T(this,t):W())}function B(){var t=void 0;if(void 0!==o)t=o;else if("undefined"!=typeof self)t=self;else try{t=Function("return this")()}catch(t){throw new Error("polyfill failed because global object is unavailable in this environment")}var e=t.Promise;if(e){var n=null;try{n=Object.prototype.toString.call(e.resolve())}catch(t){}if("[object Promise]"===n&&!e.cast)return}t.Promise=V}var F=void 0;F=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)};var I=F,Q=0,R=void 0,z=void 0,U=function(t,e){X[Q]=t,X[Q+1]=e,2===(Q+=2)&&(z?z(c):Z())},Y="undefined"!=typeof window?window:void 0,K=Y||{},G=K.MutationObserver||K.WebKitMutationObserver,$="undefined"==typeof self&&void 0!==e&&"[object process]"==={}.toString.call(e),J="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,X=new Array(1e3),Z=void 0;Z=$?function(){return function(){return e.nextTick(c)}}():G?function(){var t=0,e=new G(c),n=document.createTextNode("");return e.observe(n,{characterData:!0}),function(){n.data=t=++t%2}}():J?function(){var t=new MessageChannel;return t.port1.onmessage=c,function(){return t.port2.postMessage(0)}}():void 0===Y?function(){try{var t=n(9);return R=t.runOnLoop||t.runOnContext,u()}catch(t){return a()}}():a();var tt=Math.random().toString(36).substring(16),et=void 0,nt=1,ot=2,it=new x,rt=new x,st=0;return M.prototype._enumerate=function(t){for(var e=0;this._state===et&&e<t.length;e++)this._eachEntry(t[e],e)},M.prototype._eachEntry=function(t,e){var n=this._instanceConstructor,o=n.resolve;if(o===d){var i=m(t);if(i===l&&t._state!==et)this._settledAt(t._state,e,t._result);else if("function"!=typeof i)this._remaining--,this._result[e]=t;else if(n===V){var r=new n(f);w(r,t,i),this._willSettleAt(r,e)}else this._willSettleAt(new n(function(e){return e(t)}),e)}else this._willSettleAt(o(t),e)},M.prototype._settledAt=function(t,e,n){var o=this.promise;o._state===et&&(this._remaining--,t===ot?C(o,n):this._result[e]=n),0===this._remaining&&k(o,this._result)},M.prototype._willSettleAt=function(t,e){var n=this;S(t,void 0,function(t){return n._settledAt(nt,e,t)},function(t){return n._settledAt(ot,e,t)})},V.all=j,V.race=N,V.resolve=d,V.reject=L,V._setScheduler=r,V._setAsap=s,V._asap=U,V.prototype={constructor:V,then:l,catch:function(t){return this.then(null,t)}},V.polyfill=B,V.Promise=V,V})}).call(e,n(7),n(8))},function(t,e){},function(t,e,n){"use strict";function o(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}();n(5);var s=n(4),u=function(t){return t&&t.__esModule?t:{default:t}}(s),a=n(0),c=o(a),l=n(1),d=o(l),f=n(2),h=n(3),p=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return i(this,t),this.options=c.deepExtend({},d.Defaults,e),this.id=this.options.id||c.generateID("bar"),this.closeTimer=-1,this.barDom=null,this.layoutDom=null,this.progressDom=null,this.showing=!1,this.shown=!1,this.closed=!1,this.closing=!1,this.killable=this.options.timeout||this.options.closeWith.length>0,this.hasSound=this.options.sounds.sources.length>0,this.soundPlayed=!1,this.listeners={beforeShow:[],onShow:[],afterShow:[],onClose:[],afterClose:[],onClick:[],onHover:[],onTemplate:[]},this.promises={show:null,close:null},this.on("beforeShow",this.options.callbacks.beforeShow),this.on("onShow",this.options.callbacks.onShow),this.on("afterShow",this.options.callbacks.afterShow),this.on("onClose",this.options.callbacks.onClose),this.on("afterClose",this.options.callbacks.afterClose),this.on("onClick",this.options.callbacks.onClick),this.on("onHover",this.options.callbacks.onHover),this.on("onTemplate",this.options.callbacks.onTemplate),this}return r(t,[{key:"on",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){};return"function"==typeof e&&this.listeners.hasOwnProperty(t)&&this.listeners[t].push(e),this}},{key:"show",value:function(){var e=this;!0===this.options.killer?t.closeAll():"string"==typeof this.options.killer&&t.closeAll(this.options.killer);var n=d.getQueueCounts(this.options.queue);if(n.current>=n.maxVisible||d.PageHidden&&this.options.visibilityControl)return d.addToQueue(this),d.PageHidden&&this.hasSound&&c.inArray("docHidden",this.options.sounds.conditions)&&c.createAudioElements(this),d.PageHidden&&c.inArray("docHidden",this.options.titleCount.conditions)&&d.docTitle.increment(),this;if(d.Store[this.id]=this,d.fire(this,"beforeShow"),this.showing=!0,this.closing)return this.showing=!1,this;if(d.build(this),d.handleModal(this),this.options.force?this.layoutDom.insertBefore(this.barDom,this.layoutDom.firstChild):this.layoutDom.appendChild(this.barDom),this.hasSound&&!this.soundPlayed&&c.inArray("docVisible",this.options.sounds.conditions)&&c.createAudioElements(this),c.inArray("docVisible",this.options.titleCount.conditions)&&d.docTitle.increment(),this.shown=!0,this.closed=!1,d.hasButtons(this)&&Object.keys(this.options.buttons).forEach(function(t){var n=e.barDom.querySelector("#"+e.options.buttons[t].id);c.addListener(n,"click",function(n){c.stopPropagation(n),e.options.buttons[t].cb()})}),this.progressDom=this.barDom.querySelector(".noty_progressbar"),c.inArray("click",this.options.closeWith)&&(c.addClass(this.barDom,"noty_close_with_click"),c.addListener(this.barDom,"click",function(t){c.stopPropagation(t),d.fire(e,"onClick"),e.close()},!1)),c.addListener(this.barDom,"mouseenter",function(){d.fire(e,"onHover")},!1),this.options.timeout&&c.addClass(this.barDom,"noty_has_timeout"),this.options.progressBar&&c.addClass(this.barDom,"noty_has_progressbar"),c.inArray("button",this.options.closeWith)){c.addClass(this.barDom,"noty_close_with_button");var o=document.createElement("div");c.addClass(o,"noty_close_button"),o.innerHTML="×",this.barDom.appendChild(o),c.addListener(o,"click",function(t){c.stopPropagation(t),e.close()},!1)}return d.fire(this,"onShow"),null===this.options.animation.open?this.promises.show=new u.default(function(t){t()}):"function"==typeof this.options.animation.open?this.promises.show=new u.default(this.options.animation.open.bind(this)):(c.addClass(this.barDom,this.options.animation.open),this.promises.show=new u.default(function(t){c.addListener(e.barDom,c.animationEndEvents,function(){c.removeClass(e.barDom,e.options.animation.open),t()})})),this.promises.show.then(function(){var t=e;setTimeout(function(){d.openFlow(t)},100)}),this}},{key:"stop",value:function(){return d.dequeueClose(this),this}},{key:"resume",value:function(){return d.queueClose(this),this}},{key:"setTimeout",value:function(t){function e(e){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}(function(t){if(this.stop(),this.options.timeout=t,this.barDom){this.options.timeout?c.addClass(this.barDom,"noty_has_timeout"):c.removeClass(this.barDom,"noty_has_timeout");var e=this;setTimeout(function(){e.resume()},100)}return this})},{key:"setText",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return this.barDom&&(this.barDom.querySelector(".noty_body").innerHTML=t),e&&(this.options.text=t),this}},{key:"setType",value:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(this.barDom){c.classList(this.barDom).split(" ").forEach(function(t){"noty_type__"===t.substring(0,11)&&c.removeClass(e.barDom,t)}),c.addClass(this.barDom,"noty_type__"+t)}return n&&(this.options.type=t),this}},{key:"setTheme",value:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(this.barDom){c.classList(this.barDom).split(" ").forEach(function(t){"noty_theme__"===t.substring(0,12)&&c.removeClass(e.barDom,t)}),c.addClass(this.barDom,"noty_theme__"+t)}return n&&(this.options.theme=t),this}},{key:"close",value:function(){var t=this;return this.closed?this:this.shown?(d.fire(this,"onClose"),this.closing=!0,null===this.options.animation.close?this.promises.close=new u.default(function(t){t()}):"function"==typeof this.options.animation.close?this.promises.close=new u.default(this.options.animation.close.bind(this)):(c.addClass(this.barDom,this.options.animation.close),this.promises.close=new u.default(function(e){c.addListener(t.barDom,c.animationEndEvents,function(){t.options.force?c.remove(t.barDom):d.ghostFix(t),e()})})),this.promises.close.then(function(){d.closeFlow(t),d.handleModalClose(t)}),this.closed=!0,this):(d.removeFromQueue(this),this)}}],[{key:"closeAll",value:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return Object.keys(d.Store).forEach(function(e){t?d.Store[e].options.queue===t&&d.Store[e].killable&&d.Store[e].close():d.Store[e].killable&&d.Store[e].close()}),this}},{key:"overrideDefaults",value:function(t){return d.Defaults=c.deepExtend({},d.Defaults,t),this}},{key:"setMaxVisible",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:d.DefaultMaxVisible,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"global";return d.Queues.hasOwnProperty(e)||(d.Queues[e]={maxVisible:t,queue:[]}),d.Queues[e].maxVisible=t,this}},{key:"button",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=arguments[2],o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};return new f.NotyButton(t,e,n,o)}},{key:"version",value:function(){return"3.1.4"}},{key:"Push",value:function(t){return new h.Push(t)}}]),t}();e.default=p,c.visibilityChangeFlow(),t.exports=e.default},function(t,e){function n(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function i(t){if(l===setTimeout)return setTimeout(t,0);if((l===n||!l)&&setTimeout)return l=setTimeout,setTimeout(t,0);try{return l(t,0)}catch(e){try{return l.call(null,t,0)}catch(e){return l.call(this,t,0)}}}function r(t){if(d===clearTimeout)return clearTimeout(t);if((d===o||!d)&&clearTimeout)return d=clearTimeout,clearTimeout(t);try{return d(t)}catch(e){try{return d.call(null,t)}catch(e){return d.call(this,t)}}}function s(){m&&h&&(m=!1,h.length?p=h.concat(p):v=-1,p.length&&u())}function u(){if(!m){var t=i(s);m=!0;for(var e=p.length;e;){for(h=p,p=[];++v<e;)h&&h[v].run();v=-1,e=p.length}h=null,m=!1,r(t)}}function a(t,e){this.fun=t,this.array=e}function c(){}var l,d,f=t.exports={};!function(){try{l="function"==typeof setTimeout?setTimeout:n}catch(t){l=n}try{d="function"==typeof clearTimeout?clearTimeout:o}catch(t){d=o}}();var h,p=[],m=!1,v=-1;f.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];p.push(new a(t,e)),1!==p.length||m||i(u)},a.prototype.run=function(){this.fun.apply(null,this.array)},f.title="browser",f.browser=!0,f.env={},f.argv=[],f.version="",f.versions={},f.on=c,f.addListener=c,f.once=c,f.off=c,f.removeListener=c,f.removeAllListeners=c,f.emit=c,f.prependListener=c,f.prependOnceListener=c,f.listeners=function(t){return[]},f.binding=function(t){throw new Error("process.binding is not supported")},f.cwd=function(){return"/"},f.chdir=function(t){throw new Error("process.chdir is not supported")},f.umask=function(){return 0}},function(t,e){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e){}])});


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

// Noty confirm
const confirmNoty = new Noty({
    text: 'Do you want to continue?',
    theme: 'mint',
    layout: 'center',

    buttons: [
        Noty.button('YES', 'btn btn--black', function () {
            console.log('button 1 clicked');
        }, {id: 'button1', 'data-status': 'ok'}),
    
        Noty.button('NO', 'btn btn--gray', function () {
            console.log('button 2 clicked');
            confirmNoty.close();
        })
    ],

    callbacks: {
        beforeShow: function(){
            let ovr =`<div class="popups-overlay" style="opacity:1;">
                        <a href="./" class="popups-overlay__logo">
                            <img src="assets/img/logo.svg" alt="logo">
                        </a>
                    </div>`;
            if(!$(document.body).find('.popups-overlay').length){
                $(document.body).append(ovr);        
            }
        },
        onClose: function(){
            $(document.body).find('.popups-overlay').remove();
        },
    }

});

 


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
        let checkboxList = $(box + ' .checkbox__inp');
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