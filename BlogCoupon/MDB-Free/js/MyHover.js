//$('.nav-item ').hover(function () {
//    //$(this).hasClass('dropdown', function () {
//    //    alert('123');
//    //});
//    $('#navbarDropdownMenuLink').attr('aria-expanded', true);
//    if ($(this).hasClass('dropdown') && $(this).hasClass('open') == false) {
//        $(this).addClass('open');
//        $('#menuhover1').addClass('show');
//    } else {
//        $(this).removeClass('open');
//        if ($('#menuhover1').hasClass('show')) {
//            $('#menuhover1').removeClass('show');
//        } else {
//            $('#menuhover1').addClass('show');
//        }
//    }
//    //$(this).addClass('open');
//    //$(this).find('.dropdown-menu').addClass('show');
    
//});

//$('.nav-item ').on('click',function () {
//    //$(this).hasClass('dropdown', function () {
//    //    alert('123');
//    //});
//    $('#navbarDropdownMenuLink').attr('aria-expanded', true);
//    if ($(this).hasClass('dropdown') && $(this).hasClass('open') == false) {
//        $(this).addClass('open');
//        $('#menuhover1').addClass('show');
//    } else {
//        $(this).removeClass('open');
//        if ($('#menuhover1').hasClass('show')) {
//            $('#menuhover1').removeClass('show');
//        } else {
//            $('#menuhover1').addClass('show');
//        }
//    }
//    //$(this).addClass('open');
//    //$(this).find('.dropdown-menu').addClass('show');

//});
$.fn.isVisible = function () {
    // Current distance from the top of the page
    var windowScrollTopView = $(window).scrollTop();

    // Current distance from the top of the page, plus the height of the window
    var windowBottomView = windowScrollTopView + $(window).height() +300;

    // Element distance from top
    var elemTop = $(this).offset().top;

    // Element distance from top, plus the height of the element
    var elemBottom = elemTop + $(this).height();

    return ((elemBottom <= windowBottomView) && (elemTop >= windowScrollTopView));
}


//$(document).ready(function () {
//    $(window).scroll(function () {
//        if ($("#fotterStop").isVisible()) {
//            $("#UtiPost").hide();
//        } else {
//            $("#UtiPost").show();
//        }
//    });
//});
$(window).scroll(function () {
    if ($(this).scrollTop() > 400) {
        $('#nav-fix-top').addClass('fixed-top');
        $('#UtiPost').show();
        
        //$('.fx').fadeIn();
        //$('.aria-contact').fadeIn();
    } else {
        $('#nav-fix-top').removeClass('fixed-top');
        $('#UtiPost').hide();
    }
    //if ($("#fotterStop").isVisible()) {
    //    $("#UtiPost").hide();
    //} else {
    //    $("#UtiPost").show();
    //}
    //if ($('body').height() <= ($(window).height() + $(window).scrollTop()+200)) {
    //    $('#UtiPost').hide();
    //}
    
});