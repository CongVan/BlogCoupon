$('#tabPost').on('click', function () {
    if (!$(this).hasClass("active")) {
        $(this).addClass('active');
    } else {
        $(this).removeClass("active");
    }
    return;
});
$('#tabCoupon').on('click', function () {
    if (!$(this).hasClass("active")) {
        $(this).addClass('active');
    } else {
        $(this).removeClass("active");
    }
});