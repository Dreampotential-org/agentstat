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
			$(".p-left").show();
			$(".p-right").hide();

			$(".price-amount").slideToggle();

		})

		$(".am-price").click (function (){
			$(".bau-am").slideToggle();
		})


		$(document).on('click', '.p-left ul li',function (){

			min = $(this).find('span').text();

			if($("#one-right-in").val() < min);
			$("#one-right-in").val('');
			
			
			$('.p-right ul').empty();
			let val=(min / 25)+1;
			let priceList='';
			for(let i=0 ; i<10 ; i++){
				let maxPrice = val * 25;
				val++;
				priceList += '<li>$'+maxPrice+'K</li>'
			}
			$('.p-right ul').append(priceList);

			$(".p-left").hide();
			$("#one-right-in").focus();
			$(".p-right").show();
		
		});


		$(document).on('click', '.p-right ul li',function (){
			max = $(this).text();
			$("#one-right-in").val(max);
			$(".p-right").hide();
			if($('#one-left-in').val() == '')
			$(".p-left").show();
			// else
			// $(".price-amount").slideUp();
		});

		$(document).on('click','#donBtn',function(){

			$(".price-amount").slideUp();
		// 	if($('#one-left-in').val() == '')
		// 	$("#one-left-in").focus();
		// 	else if($('#one-right-in').val() == '')
		// 	$("#one-right-in").focus();
		// 	else
		// 	$(".price-amount").slideUp();

        // //  redirectResults(global_results)

		})

		$(document).on('click', '#pt-amount #one-left-in',function (){
			//alert("pt-amount")
			$(".p-right").hide();
			$(".p-left").show();
		});

		$(document).on('click', '#pt-amount #one-right-in',function (){
			$(".p-left").hide();
			$(".p-right").show();
		});

		
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
            /*
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
            */
		
	});


})(jQuery);
