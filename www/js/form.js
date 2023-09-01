function init_form_js() {

    $('input[type="file"]').fileinput({
        multipleText: '{0} files',
        showMultipleNames: true,
    });

    $('#more').click(function () {
        $('.more-content').slideDown();
    });

    $('#fwe').click(function () {
        $('.more-content').slideUp();
    });

    $('#cross').click(function () {
        $('#lnumber').removeAttr('placeholder')
    });
    $(document).ready(function () {
        $('.main-menu-part ul li a').click(function () {
            $('.main-menu-part li a').removeClass("activeLine");
            $(this).addClass("activeLine");
        });
    });

    (function ($) {
        $('[data-toggle="tooltip"]').tooltip();
    })(jQuery);

    $('.trigger-more').click(function () {
        if ($(this).hasClass('collapsed')) {
            $(this).text('Fewer');
        } else {
            $(this).text('More');
        }

    });

    $("#textbox").hide();
    $("#buyer_rebate").click(function () {

        console.log($('#buyer_rebate').val())

        if ($(this).val() == '7') {
            $("#textbox").show();
        } else {
            $("#textbox").hide();
        }
    });

    $(function () {
        $("#review-date").datepicker({
            format: 'yyyy-mm-dd',
            endDate: new Date()
        });
    });

    var str = document.getElementById("screen_name").innerHTML;
    var res = str.replace("-", " ");
    document.getElementById("screen_name").innerHTML = res;

    var options = {
        max_value: 5,
        step_size: 0.5,
    }
    $(".rating").rate(options);


		jQuery('#agent-tabs.tabset > li >a:not(:first)').addClass('inactive');
		// jQuery('#agent-tabs.tabset > li >a:first').addClass('active');
		jQuery('.agent-tab-item').hide();
		// jQuery('.agent-tab-item:first').show();
		jQuery('#agent-tabs.tabset > li >a').click(function(e){
			e.preventDefault();
			var tab = jQuery(this).attr('href');
			if(jQuery(this).hasClass('inactive')){
					jQuery('#agent-tabs.tabset >li >a').addClass('inactive').removeClass('active');
					jQuery(this).removeClass('inactive').addClass('active');
					jQuery('.agent-tab-item').hide();
					jQuery(tab).fadeIn();
			}
			jQuery(tab).find("input:first").focus();
		});
		$('.nextbtn').click(function(){
			$('.tabset > .active').next('li').find('a').trigger('click');
			$('.tabset > .active').next('li').addClass('active');
			$('.tabset > .active').prev('li').removeClass('active');
		});
		$('.backbtn').click(function(){
			$('.tabset > .active').prev('li').find('a').trigger('click');
			$('.tabset > .active').prev('li').addClass('active');
			$('.tabset > .active').next('li').removeClass('active');
		});

        jQuery('.accordion-opener').next().css('display', 'block');
        if(jQuery(window).width() < 1024) {
            jQuery('.accordion-opener').next().css('display', 'none');
            jQuery(".accordion-opener").unbind("click");
            jQuery(".accordion-opener").bind("click", function () {
                jQuery('.accordion-opener').next().slideUp();
                jQuery('.accordion-opener').removeClass('active');
                if (jQuery(this).next().is(':visible') == false) {
                    jQuery(this).addClass('active');
                    jQuery(this).next().slideDown();
                }
            });
        }

}
window.addEventListener("DOMContentLoaded", init_form_js, false);
