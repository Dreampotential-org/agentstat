
			 // type customization

		    $("input[type=radio]").click(function (){
		    	var a = $(this).val();
		    	$(".type-value").text (a);
		    	$(".check-type").slideUp();
		    });


		    function three () {

		    $(".p-left ul li").click (function (){
		    	var d =$(this).text ();
		    	$("#one-left-in").val(d);
		    });

		    $(".p-right ul li").click (function (){
		    	var e =$(this).text ();
		    	$("#one-right-in").val(e);
		    	$(".price-amount").slideUp();
		    });

		};

		three();


		
		