$(".selected-item").click(function() {
    $(this).toggleClass("select_onclick");
    $(this).siblings(".option-wrap").toggleClass("active");
});

$('input[type="radio"]').on("click", function() {
    var selectedOption = $(this).parents('.option').clone();
    console.log(selectedOption);
    $(this).parents().siblings('.selected-item').html(selectedOption);
    $(this).parents().removeClass("active");
    $(this).parents().siblings('.selected-item').removeClass("select_onclick");
});