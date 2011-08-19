/**
 * http://garbas.github.com/jquery.recurrenceinput.js
 *
 * Author: Rok Garbas <rok@garbas.si>
 * Since: Sep 2010
 * Date: XX-XX-XXXX
 */
(function($) {

    /**
     * RecurrenceInput - form, display and tools for recurrenceinput widget
     */
    function RecurrenceInput(conf, textarea) {

        var self = this;
        var textarea = textarea;
        
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

        // The display part of the widget
        var display = $(conf.template.display).tmpl(conf);
        // recurrance form in an overlay
        var form = $(conf.template.form).tmpl(conf);
        overlay_conf = $.extend(conf.form_overlay, {});
        form.hide().overlay(overlay_conf);

        display.find('input[name='+conf.field.range_by_end_date_calendar_name+']').dateinput({
            selectors: true,
        });

        function recurrenceOn() {
            display.find('div[class='+conf.klass.range+']').show();
            RFC2554 = widget_save_to_rfc2445(form, conf);
            textarea.val(RFC2554);
        };

        function recurrenceOff() {
            display.find('div[class='+conf.klass.range+']').hide();
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

        display.find('input[name='+conf.field.checkbox_name+']').click(toggleRecurrence);

        // show form overlay on change of display radio box 
        display.find('a[name='+conf.field.edit_name+']')
            .click(function(e) {
                e.preventDefault();
                loadData(textarea.val());
                form.overlay().load();
        });


        //  make labels clickable (XXX: Seriously? You need JS for that?)
        function clickableLabel() {
            $(this).parent().find('> input').click().change();
        }
        form.find('ul.'+conf.klass.freq+' label').click(clickableLabel);
        display.find('label').click(clickableLabel);

        // frequency options
        form.find('input[name='+conf.field.freq_name+']')
            .change(function(e) {
                form.find('div.'+conf.klass.freq_options+' > div').hide();
                form.find($(this).attr('ref')).show()
                    .addClass(conf.klass.freq_option_active);
        });


        /**
         * Saving data selected in form and returning RFC2554 string
         */
        function save(event) {
            event.preventDefault();
            // close overlay
            form.overlay().close();
            // check checkbox
            display.find('input[name='+conf.field.checkbox_name+']')
                    .attr('checked', true);
            recurrenceOn();
        }


        function load(event) {
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
            } //else {
                //alert('we should load default values. FREQ')
            //}
        }


        /*
         * Public API of RecurrenceInput
         */
        $.extend(self, {
            display: display,
            form: form,
            load: load,
            loadData: loadData,
            save: save
        });

        form.find('.'+conf.klass.save_button).click(save);
        form.find('.'+conf.klass.cancel_button).click(load);
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
                // load data provided by textarea
                recurrenceinput.loadData(textarea.val());
                // hide the textarea
                //textarea.hide(); Commented while developing
            };
        });
    };

})(jQuery);
