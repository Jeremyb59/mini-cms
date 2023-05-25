$(function() {
    var demoHeaderBox;

    if ($('#javascript-header-demo-box').length !== 0) {
    	demoHeaderBox = $('#javascript-header-demo-box');
    	demoHeaderBox
    		.hide()
    		.text('Hello from JavaScript! This line has been added by public/js/application.js')
    		.css('color', 'green')
    		.fadeIn('slow');
    }
    
    if ($('#javascript-ajax-button').length !== 0) {
        $('#javascript-ajax-button').on('click', function(){
            $.ajax(url + "/songs/ajaxGetStats")
                .done(function(result) {
                    $('#javascript-ajax-result-box').html(result);
                })
                .fail(function() {})
                .always(function() {});
        });
    }
});
