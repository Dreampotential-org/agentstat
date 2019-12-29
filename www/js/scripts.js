(function($){
	$(document).ready(function() {	

		// Scroll to Top
		jQuery('.scrolltotop').click(function(){
			jQuery('html').animate({'scrollTop' : '0px'}, 400);
			return false;
		});
		
		jQuery(window).scroll(function(){
			var upto = jQuery(window).scrollTop();
			if(upto > 500) {
				jQuery('.scrolltotop').fadeIn();
			} else {
				jQuery('.scrolltotop').fadeOut();
			}
		});


		$("#y-type").click (function (){
			$(".check-type").slideToggle();
		});

		$("#bau1").click (function (){
			$(".bau1-cotent").slideToggle();
		});

		$(".y-price").click (function (){
			$(".price-amount").slideToggle();
		})

		$(".am-price").click (function (){
			$(".bau-am").slideToggle();
		})


		
		// code for hamberger
		 var forEach=function(t,o,r){if("[object Object]"===Object.prototype.toString.call(t))for(var c in t)Object.prototype.hasOwnProperty.call(t,c)&&o.call(r,t[c],c,t);else for(var e=0,l=t.length;l>e;e++)o.call(r,t[e],e,t)};
		    var hamburgers = document.querySelectorAll(".hamburger");
		    if (hamburgers.length > 0) {
		      forEach(hamburgers, function(hamburger) {
		        hamburger.addEventListener("click", function() {
		          this.classList.toggle("is-active");
		        }, false);
		      });
		    };


		    // owl carusol

		    $('.products-slider').owlCarousel({
           	loop: false,
           	margin: 20,
           	center: false,
           	nav: false,
           	dots: false,
           	autoplay:true,
           	autoplayTimeout:2000,
           	responsiveClass: true,
           	responsiveRefreshRate: true,
           	responsive : {
           		0 : {
           			items:3,
           			margin: 0,
           		},
           		768 : {
           			items:4
           		},
           		960 : {
           			items:5
           		},
           		1200 : {
           			items:5 
           		},
           		1920 : {
           			items:5 
           		}
           	}
           });


		   


		   


		   


		   



		
		
		
		
		
		
		
		
	});
})(jQuery);