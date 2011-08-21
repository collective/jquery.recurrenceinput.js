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
        form.find('input[name='+conf.field.range_by_end_date_calendar_name+']').dateinput({
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
        }

        /**
         * Loading (populating) display and form widget with
         * passed RFC2554 string (data)
         */
        function loadData(rfc2445) {
            if (rfc2445) {
                widget_load_from_rfc2445(form, conf, rfc2445);
                // check checkbox
                display.find('input[name='+conf.field.checkbox_name+']')
                    .attr('checked', true);
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
                
                if (textarea.val()) {
                    recurrenceinput.display.find(
                        'input[name='+conf.field.checkbox_name+']')
                        .attr('checked', true);
                }
                
                // hide the textarea
                //textarea.hide(); Commented while developing
            };
        });
    };

})(jQuery);



/**
 * Parsing RFC2554 from widget
 */
function widget_save_to_rfc2445(form, conf) {
    var result = '';
    selector = form.find('select[name='+conf.field.rtemplate_name+']').val();
    rtemplate = conf.rtemplate[value];
    result = rtemplate.rrule;
    
    for (i in rtemplate.fields) {
        field = form.find('#'+rtemplate.fields[i]);
        
        switch (field.attr('id')) {
        
            case conf.field.daily_interval_name:
                // TODO: Assert that this is a number.
                input = field.find('input[name='+conf.field.daily_interval_name+']')
                result += ';INTERVAL=' + input.val();
                break;
                
            case conf.field.weekly_interval_name:
                // TODO: Assert that this is a number.
                input = field.find('input[name='+conf.field.weekly_interval_name+']')
                result += ';INTERVAL=' + input.val();
                break;
                
            case conf.field.weekly_weekdays_name:
                weekdays = ''
                for (i in conf.weekdays) {
                    input = field.find('input[name='+conf.field.weekly_weekdays_name+'_'+conf.weekdays[i]+']');
                    if (input.is(':checked')) {
                        if (weekdays) {
                            weekdays += ','
                        }
                        weekdays += conf.weekdays[i]
                    }
                }
                if (weekdays) {
                    result += ';BYDAY=' + weekdays
                }
                break;
                
            case conf.field.monthly_options_name:
                monthly_type = $('input[name='+conf.field.monthly_type_name+']:checked', form).val();
                switch (monthly_type) {
                    case 'DAY_OF_MONTH':
                        day = $('select[name='+conf.field.monthly_day_of_month_day_name+']', form).val();
                        interval = $('input[name='+conf.field.monthly_day_of_month_interval_name+']', form).val();
                        result += ';BYMONTHDAY=' + day;
                        result += ';INTERVAL=' + interval;
                        break;
                    case 'WEEKDAY_OF_MONTH':
                        index = $('select[name='+conf.field.monthly_weekday_of_month_index_name+']', form).val();
                        day = $('select[name='+conf.field.monthly_weekday_of_month_name+']', form).val();
                        interval = $('input[name='+conf.field.monthly_weekday_of_month_interval_name+']', form).val();
                        if ($.inArray(day, ['MO','TU','WE','TH','FR','SA','SU']) > -1) {
                            result += ';BYDAY=' + index + day;
                        }
                        else if (day == 'WEEKDAY') {
                            result += ';BYDAY=MO,TU,WE,TH,FR;BYSETPOS=' + index;
                        }
                        else if (day == 'WEEKEND_DAY') {
                            result += ';BYDAY=SA,SU;BYSETPOS=' + index;
                        }
                        result += ';INTERVAL=' + interval;
                        break;
                }
                break;
                
            case conf.field.yearly_options_name:
                yearly_type = $('input[name='+conf.field.yearly_type_name+']:checked', form).val();
                switch (yearly_type) {
                    case 'DAY_OF_MONTH':
                        var month = $('select[name='+conf.field.yearly_day_of_month_month_name+']', form).val();
                        var day = $('select[name='+conf.field.yearly_day_of_month_index_name+']', form).val();
                        result += ';BYMONTH=' + month;
                        result += ';BYMONTHDAY=' + day;
                        break;
                    case 'WEEKDAY_OF_MONTH':
                        var index = $('select[name='+conf.field.yearly_weekday_of_month_index_name+']', form).val();
                        var day = $('select[name='+conf.field.yearly_weekday_of_month_day_name+']', form).val();
                        var month = $('select[name='+conf.field.yearly_weekday_of_month_month_name+']', form).val();
                        result += ';BYMONTH=' + month;
                        if ($.inArray(day, ['MO','TU','WE','TH','FR','SA','SU']) > -1) {
                            result += ';BYDAY=' + index + day;
                        }
                        else if (day == 'DAY') {
                            result += ';BYDAY=' + index;
                        }
                        else if (day == 'WEEKDAY') {
                            result += ';BYDAY=MO,TU,WE,TH,FR;BYSETPOS=' + index;
                        }
                        else if (day == 'WEEKEND_DAY') {
                            result += ';BYDAY=SA,SU;BYSETPOS=' + index;
                        }
                        break;
                }
                break;
                
            case conf.field.range_options_name:
                var range_type = $('input[name='+conf.field.range_type_name+']:checked', form).val();
                switch (range_type) {
                    case 'BY_OCURRENCES':
                        result += ';COUNT=' + $('input[name='+conf.field.range_by_ocurrences_value_name+']').val();
                        break;
                    case 'BY_END_DATE':
                        field = $('input[name='+conf.field.range_by_end_date_calendar_name+']')
                        date = field.data('dateinput').getValue('yyyymmdd');
                        result += ';UNTIL='+date+'T000000';
                        break;
                }
        };
    };
    
    return result
}


function widget_load_from_rfc2445(form, conf, rrule) {
    var result = '';
    
    // Find the best rule:
    match = '';
    match_index = null;
    for (i in conf.rtemplate) {
        rtemplate = conf.rtemplate[i];
        if (rrule.indexOf(rtemplate.rrule) === 0) {
            if (rrule.length > match.length){
                // This is the best match so far
                match = rrule;
                match_index = i;
            }
        }
    }
    
    if (match) {
        rtemplate = conf.rtemplate[match_index];
        // Set the selector:
        selector = form.find('select[name='+conf.field.rtemplate_name+']').val(match_index);
    } else {
        rtemplate = conf.rtemplate[0];
        alert(conf.i18n.no_template_match);
    }
    
    for (i in rtemplate.fields) {
        field = form.find('#'+rtemplate.fields[i]);
        
        switch (field.attr('id')) {
        
            case conf.field.daily_interval_name:
                input = field.find('input[name='+conf.field.daily_interval_name+']')
                matches = /INTERVAL=([0-9]+);?/.exec(rrule);
                if (matches) {
                    input.val(matches[1]);
                }
                break;
            case conf.field.weekly_interval_name:
                input = field.find('input[name='+conf.field.weekly_interval_name+']')
                matches = /INTERVAL=([0-9]+);?/.exec(rrule);
                if (matches) {
                    input.val(matches[1]);
                }
                break;
            case conf.field.weekly_weekdays_name:
                matches = /BYDAY=([^;]+);?/.exec(rrule);
                if (matches) {
                    days = matches[1];
                } else {
                    days = '';
                }
                for (d in conf.weekdays) {
                    day = conf.weekdays[d];
                    input = field.find('input[name='+conf.field.weekly_weekdays_name+'_'+day+']');
                    input.attr('checked', matches[1].indexOf(day) !== -1);
                }
                break;
        }
    }
}