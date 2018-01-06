$('.navbar-nav a').on('click', function () {
        if (window.innerWidth <= 768) {
            $(".navbar-toggle").click();
        }
    });

$(".modal").on('shown', function() {
    $(this).find("[autofocus]:first").focus();
});