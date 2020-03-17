
			 // type customization
			$("#btnDone").click(function (){
				// var a = $(this).val();
				// $(".type-value").text (a);
				$(".check-type").slideUp();
		    });

		    $(".index-check-type input[type=radio]").click(function (){
		    	var a = $(this).val();
		    	$(".type-value").text (a);
				$(".check-type").slideUp();
			});
			$(".index-address-type ul li").click(function (){
			
				var a = $(this).text();
		    	$(".address-value").html (a+" <i class='fas fa-caret-down'></i>");
				$(".address-type").slideUp();
			});
			$(".index-address-map-type ul li").click(function (){
			
				var a = $(this).attr('value');
		    	$(".address-map-value").html (a+" <i class='fas fa-caret-down'></i>");
				$(".address-map-type").slideUp();
			});

			$("#statesData").on('click','li',function (){
		    	var a = $(this).text();
		    	$(".state-map-value").html (a+" <i class='fas fa-caret-down'></i>");
				$(".ser-state-map-type").slideUp();
			});

			$("#allstate").on('click','li', function (){
				var a = $(this).text();
		    	$(".state-value").html (a+" <i class='fas fa-caret-down'></i>");
				$(".ser-state-type").slideUp();
			});
			
			

		    $("input[type=radio]").click(function (){
		    	var aa = $(this).val();
		    	// $(".type-value").text (aa);
				$(".check-type").slideUp();
		    });
			
			$(".index-address-type ul li").click(function (){
		    	var aa = $(this).val();
				// $(".address-value").text (aa);
				$(".address-type").slideUp();
				
				$(".ser-state-type").slideUp();
			});
			$(".index-address-map-type ul li").click(function (){
		    	var aa = $(this).val();
				// $(".address-value").text (aa);
				$(".address-map-type").slideUp();
				
				$(".ser-state-map-type").slideUp();
		    });
		    $(".bau1-cotent input[type=radio]").click(function (){
		    	var b = $(this).val();
		    	$(".bau-in").text (b);
		    	$(".bau1-cotent").slideUp();
		    });



		    function three () {

		    $(".p-left ul li").click (function (){
		    	var d =$(this).text ();
		    	$("#one-left-in").val(d);
		    });

		    // $(".p-right ul li").click (function (){
			// 	var e =$(this).text ();
			// 	//alert(e)
			// 	console.log(e);
		    // 	$("#one-right-in").val(e);
		    // 	$(".price-amount").slideUp();
		    // });

		};

		three();


		 function four () {

		    $(".bau-am .p-left ul li").click (function (){
		    	var dd =$(this).text ();
		    	$(".bau-am #one-left-in").val(dd);
		    });

		    $(".bau-am .p-right ul li").click (function (){
		    	var ee =$(this).text ();
		    	$(".bau-am #one-right-in").val(ee);
		    	$(".bau-am").slideUp();
		    });

		};

		four();


		
		