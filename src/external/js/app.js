(function($, window, undefined){

    FastClick.attach(document.body);

    /** Tapestry Completed */

    $('body').bind('tapestry.completed', function(){

        APP.init()
    });


    /**
     * Initializes your JS
     */


    var APP = {

        init: function(){


            $('.ui-accordion').accordion();

            $('.ui-tabs, [data-component="ui-tabs"]').tabs();

            $('[data-toggle]').dropdown();

            //$('.tapestry-menu-side').scrollspy();

            var $menu = $('.tapestry-menu-side a')
        }
    }


})(jQuery, window)
