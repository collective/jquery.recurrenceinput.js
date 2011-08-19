(function($) {
    
    /**
     * RecurrenceInput - form, display and tools for recurrenceinput widget
     */
    function RecurrenceInput(conf, textarea) {

        var self = this;
        var textarea = textarea;

        /* 
          Load the templates
        */

        // The widget
        $.ajax({
            url: $(conf.template.display)[0].src,
            async: false,
            success: function (data) {
                conf.template.display = data;
            },
            error: function (request, status, error) {
                alert(error.message + ": " + error.filename);
            },
        });
        var display = $(conf.template.display).tmpl(conf);

        // The overlay = form popup
        $.ajax({
            url: $(conf.template.form)[0].src,
            async: false,
            success: function (data) {
                conf.template.form = data;
            },
            error: function (request, status, error) {
                alert(error.message + ": " + error.filename);
            },
        });
        var form = $(conf.template.form).tmpl(conf);
        // Make an overlay
        overlay_conf = $.extend(conf.form_overlay, {});
        // Hide it
        form.hide().overlay(overlay_conf); 

        /* 
          Do all the GUI stuff:
        */
        
        // The date dropdown should have selectors.
        display.find('input[name='+conf.field.range_by_end_date_calendar_name+']').dateinput({
            selectors: true,
        });

        // When you click on the checkbox, recurrence should toggle on/off.
        display.find('input[name='+conf.field.checkbox_name+']').click(toggleRecurrence);

        // Show form overlay when you click on the "Edit..." link
        display.find('a[name='+conf.field.edit_name+']').click(
            function(e) {
                e.preventDefault();
                loadData(textarea.val());
                selector = form.find('select[name='+conf.field.rtemplate_name+']')
                display_fields(selector);
                form.overlay().load();
        });

        
        // The recurrence type dropdown should show certain fields depending
        // on selection:
        
        function display_fields(selector) {
            // First hide all the fields
            form.find('.recurrenceinput_field').hide();
            // Then show the ones that should be shown.
            value = selector.val();
            if (value) {
                rtemplate = conf.rtemplate[value]
                for (i in rtemplate.fields) {
                    form.find('#'+rtemplate.fields[i]).show();
                };
            };
        };
        
        form.find('select[name='+conf.field.rtemplate_name+']').change(
            function(e) {
                display_fields($(this));
            }
        );
        

        ////  make labels clickable (XXX: Seriously? You need JS for that?)
        //function clickableLabel() {
            //$(this).parent().find('> input').click().change();
        //}
        //form.find('ul.'+conf.klass.freq+' label').click(clickableLabel);
        //display.find('label').click(clickableLabel);

        //// frequency options
        //form.find('input[name='+conf.field.freq_name+']')
            //.change(function(e) {
                //form.find('div.'+conf.klass.freq_options+' > div').hide();
                //form.find($(this).attr('ref')).show()
                    //.addClass(conf.klass.freq_option_active);
        //});


        function recurrenceOn() {
            RFC2554 = widget_save_to_rfc2445(form, conf);
            textarea.val(RFC2554);
        };

        function recurrenceOff() {
            textarea.val('');
        };

        function toggleRecurrence(e) {
            var checkbox = display.find('input[name='+conf.field.checkbox_name+']');
            if (checkbox.is(':checked')) {
                recurrenceOn();
            } else {
                display.find('div[class='+conf.klass.range+']').hide();
                recurrenceOff();
            }
        };
        toggleRecurrence();

        function save(event) {
            event.preventDefault();
            // close overlay
            form.overlay().close();
            // check checkbox
            display.find('input[name='+conf.field.checkbox_name+']')
                    .attr('checked', true);
            recurrenceOn();
        }


        function cancel(event) {
            event.preventDefault();
            // close overlay
            form.overlay().close();
            // Reload the old data
            loadData(textarea.val());
        }

        /**
         * Loading (populating) display and form widget with
         * passed RFC2554 string (data)
         */
        function loadData(rfc2445) {
            if (rfc2445) {
                widget_load_from_rfc2445(form, rfc2445);
                // check checkbox
                display.find('input[name='+conf.field.checkbox_name+']')
                    .attr('checked', true);
                recurrenceOn();
            } else {
                selector = form.find('select[name='+conf.field.rtemplate_name+']');
                //alert('we should load default values. FREQ')
            }
        }


        /*
         * Public API of RecurrenceInput
         */
        $.extend(self, {
            display: display,
            form: form,
            cancel: cancel,
            save: save,
            loadData: loadData,
        });

        form.find('.'+conf.klass.save_button).click(save);
        form.find('.'+conf.klass.cancel_button).click(cancel);
    }


    /*
     * jQuery plugin implementation
     */
    $.fn.recurrenceinput = function(conf) {
        if (this.data('recurrenceinput')) { return this; } // plugin already installed
        // "compile" configuration for widget
        var conf = $.extend(default_conf, conf)

        this.each(function() { // apply this for every textarea
            var textarea = $(this);
            if (textarea[0].type == 'textarea') {
                // our recurrenceinput widget instance
                var recurrenceinput = new RecurrenceInput(conf, textarea);
                // hide textarea and place display_widget after textarea
                recurrenceinput.form.appendTo('body');
                textarea.after(recurrenceinput.display);
                // hide the textarea
                //textarea.hide(); Commented while developing
            };
        });
    };

})(jQuery);
