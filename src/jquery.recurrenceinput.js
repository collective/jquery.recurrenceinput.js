
/*jslint regexp: false, indent: 4 */
/*global $: false, alert: false, default_conf: false, jQuery: false */

/**
 * Parsing RFC2554 from widget
 */
function widget_save_to_rfc2445(form, conf) {
    var value = form.find('select[name=' + conf.field.rtemplate_name + ']').val();
    var rtemplate = conf.rtemplate[value];
    var result = rtemplate.rrule;
    var human = rtemplate.title;
    var field, input, weekdays, i18nweekdays, i, j, index;
    var day, month, interval, yearly_type, occurrences, date;
    
    for (i = 0; i < rtemplate.fields.length; i++) {
        field = form.find('#' + rtemplate.fields[i]);
        
        switch (field.attr('id')) {
        
        case conf.field.daily_interval_name:
            // TODO: Assert that this is a number.
            input = field.find('input[name=' + conf.field.daily_interval_name + ']');
            result += ';INTERVAL=' + input.val();
            human = conf.i18n.daily_interval_1 + ' ' + input.val() + ' ' + conf.i18n.daily_interval_2;
            break;
            
        case conf.field.weekly_interval_name:
            // TODO: Assert that this is a number.
            input = field.find('input[name=' + conf.field.weekly_interval_name + ']');
            result += ';INTERVAL=' + input.val();
            human = conf.i18n.weekly_interval_1 + ' ' + input.val() + ' ' + conf.i18n.weekly_interval_2;
            break;
            
        case conf.field.weekly_weekdays_name:
            weekdays = '';
            i18nweekdays = '';
            for (j = 0; j < conf.weekdays.length; j++) {
                input = field.find('input[name=' + conf.field.weekly_weekdays_name + '_' + conf.weekdays[j] + ']');
                if (input.is(':checked')) {
                    if (weekdays) {
                        weekdays += ',';
                        i18nweekdays += ', ';
                    }
                    weekdays += conf.weekdays[j];
                    i18nweekdays += conf.i18n.weekdays[j];
                }
            }
            if (weekdays) {
                result += ';BYDAY=' + weekdays;
                human += ' ' + conf.i18n.weekly_weekdays + ' ' + i18nweekdays;
            }
            break;
            
        case conf.field.monthly_options_name:
            var monthly_type = $('input[name=' + conf.field.monthly_type_name + ']:checked', form).val();
            switch (monthly_type) {
            
            case 'DAY_OF_MONTH':
                day = $('select[name=' + conf.field.monthly_day_of_month_day_name + ']', form).val();
                interval = $('input[name=' + conf.field.monthly_day_of_month_interval_name + ']', form).val();
                result += ';BYMONTHDAY=' + day;
                result += ';INTERVAL=' + interval;                        
                human += ', ' + conf.i18n.monthly_day_of_month_1 + ' ' + day + ' ' + conf.i18n.monthly_day_of_month_2;
                if (interval !== 1) {
                    human += conf.i18n.monthly_day_of_month_3 + ' ' + interval + ' ' + conf.i18n.monthly_day_of_month_4;
                }
                break;
            case 'WEEKDAY_OF_MONTH':
                index = $('select[name=' + conf.field.monthly_weekday_of_month_index_name + ']', form).val();
                day = $('select[name=' + conf.field.monthly_weekday_of_month_name + ']', form).val();
                interval = $('input[name=' + conf.field.monthly_weekday_of_month_interval_name + ']', form).val();
                if ($.inArray(day, ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']) > -1) {
                    result += ';BYDAY=' + index + day;
                    human += ', ' + conf.i18n.monthly_weekday_of_month_1 + ' ';
                    human += ' ' + conf.i18n.order_indexes[conf.order_indexes.indexOf(index)];
                    human += ' ' + conf.i18n.monthly_weekday_of_month_2;
                    human += ' ' + conf.i18n.weekdays[conf.weekdays.indexOf(day)];
                }
                result += ';INTERVAL=' + interval;
                if (interval !== 1) {
                    human += ' ' + conf.i18n.monthly_weekday_of_month_3 + ' ' + interval + ' ' + conf.i18n.monthly_weekday_of_month_4;
                }
                break;
            }
            break;
            
        case conf.field.yearly_options_name:
            yearly_type = $('input[name=' + conf.field.yearly_type_name + ']:checked', form).val();
            switch (yearly_type) {
            
            case 'DAY_OF_MONTH':
                month = $('select[name=' + conf.field.yearly_day_of_month_month_name + ']', form).val();
                day = $('select[name=' + conf.field.yearly_day_of_month_index_name + ']', form).val();
                result += ';BYMONTH=' + month;
                result += ';BYMONTHDAY=' + day;
                human += ', ' + conf.i18n.months[month - 1] + ' ' + day;
                break;
            case 'WEEKDAY_OF_MONTH':
                index = $('select[name=' + conf.field.yearly_weekday_of_month_index_name + ']', form).val();
                day = $('select[name=' + conf.field.yearly_weekday_of_month_day_name + ']', form).val();
                month = $('select[name=' + conf.field.yearly_weekday_of_month_month_name + ']', form).val();
                result += ';BYMONTH=' + month;
                if ($.inArray(day, ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']) > -1) {
                    result += ';BYDAY=' + index + day;
                    human += ', ' + conf.i18n.yearly_weekday_of_month_1;
                    human += ' ' + conf.i18n.order_indexes[conf.order_indexes.indexOf(index)];
                    human += ' ' + conf.i18n.yearly_weekday_of_month_2;
                    human += ' ' + conf.i18n.weekdays[conf.weekdays.indexOf(day)];
                    human += ' ' + conf.i18n.yearly_weekday_of_month_3;
                    human += ' ' + conf.i18n.months[month - 1];
                    human += ' ' + conf.i18n.yearly_weekday_of_month_4;
                }
                break;
            }
            break;
            
        case conf.field.range_options_name:
            var range_type = form.find('input[name=' + conf.field.range_type_name + ']:checked', form).val();
            switch (range_type) {
            
            case 'BY_OCURRENCES':
                occurrences = form.find('input[name=' + conf.field.range_by_ocurrences_value_name + ']').val();
                result += ';COUNT=' + occurrences;
                human += ', ' + conf.i18n.range_by_occurences_label_1;
                human += ' ' + occurrences;
                human += ' ' + conf.i18n.range_by_occurences_label_2;
                break;
            case 'BY_END_DATE':
                field = form.find('input[name=' + conf.field.range_by_end_date_calendar_name + ']');
                date = field.data('dateinput').getValue('yyyymmdd');
                result += ';UNTIL=' + date + 'T000000';
                human += ', ' + conf.i18n.range_by_end_date_label;
                human += ' ' + field.data('dateinput').getValue(conf.i18n.long_date_format);
                break;
            }
            break;
        }
    }
    
    return {result: result, description: human};
}


function widget_load_from_rfc2445(form, conf, rrule) {
    var unsupported_features = false;
    var i, matches, match, match_index, rtemplate, d, input, index;
    var selector, selectors, field, radiobutton;
    var interval, byday, bymonth, bymonthday, bysetpos, count, until, weekday;
    var day, month, year;

    matches = /INTERVAL=([0-9]+);?/.exec(rrule);
    if (matches) {
        interval = matches[1];
    } else {
        interval = '1';
    }

    matches = /BYDAY=([^;]+);?/.exec(rrule);
    if (matches) {
        byday = matches[1];
    } else {
        byday = '';
    }
    
    matches = /BYMONTHDAY=([^;]+);?/.exec(rrule);
    if (matches) {
        bymonthday = matches[1].split(",");
    } else {
        bymonthday = null;
    }

    matches = /BYMONTH=([^;]+);?/.exec(rrule);
    if (matches) {
        bymonth = matches[1].split(",");
    } else {
        bymonth = null;
    }

    matches = /BYSETPOS=([^;]+);?/.exec(rrule);
    if (matches) {
        bysetpos = matches[1];
    } else {
        bysetpos = null;
    }
    
    matches = /COUNT=([0-9]+);?/.exec(rrule);
    if (matches) {
        count = matches[1];
    } else {
        count = null;
    }
    
    matches = /UNTIL=([0-9T]+);?/.exec(rrule);
    if (matches) {
        until = matches[1];
    } else {
        until = null;
    }
    
    // Find the best rule:
    match = '';
    match_index = null;
    for (i in conf.rtemplate) {
        if (conf.rtemplate.hasOwnProperty(i)) {
            rtemplate = conf.rtemplate[i];
            if (rrule.indexOf(rtemplate.rrule) === 0) {
                if (rrule.length > match.length) {
                    // This is the best match so far
                    match = rrule;
                    match_index = i;
                }
            }  
        }
    }
    
    if (match) {
        rtemplate = conf.rtemplate[match_index];
        // Set the selector:
        selector = form.find('select[name=' + conf.field.rtemplate_name + ']').val(match_index);
    } else {
        for (rtemplate in conf.rtemplate) {
            if (conf.rtemplate.hasOwnProperty(rtemplate)) {
                rtemplate = conf.rtemplate[rtemplate];
                break;
            }
        }
        unsupported_features = true;
    }
    
    for (i = 0; i < rtemplate.fields.length; i++) {
        field = form.find('#' + rtemplate.fields[i]);
        switch (field.attr('id')) {
        
        case conf.field.daily_interval_name:
            field.find('input[name=' + conf.field.daily_interval_name + ']').val(interval);
            break;
            
        case conf.field.weekly_interval_name:
            field.find('input[name=' + conf.field.weekly_interval_name + ']').val(interval);
            break;
            
        case conf.field.weekly_weekdays_name:
            for (d = 0; d < conf.weekdays.length; d++) {
                day = conf.weekdays[d];
                input = field.find('input[name=' + conf.field.weekly_weekdays_name + '_' + day + ']');
                input.attr('checked', byday.indexOf(day) !== -1);
            }
            break;
            
        case conf.field.monthly_options_name:
            var monthly_type = conf.field.monthly_day_of_month_value; // Default to using BYMONTHDAY
            
            if (bymonthday) {
                monthly_type = conf.field.monthly_day_of_month_value;
                if (bymonthday.indexOf(',') !== -1) {
                    // No support for multiple days in one month
                    unsupported_features = true;
                    // Just keep the first
                    bymonthday = bymonthday.split(",")[0];
                }
                field.find('select[name=' + conf.field.monthly_day_of_month_day_name + ']').val(bymonthday);
                field.find('input[name=' + conf.field.monthly_day_of_month_interval_name + ']').val(interval);
            }

            if (byday) {
                monthly_type = conf.field.monthly_weekday_of_month_value;
                
                if (byday.indexOf(',') !== -1) {
                    // No support for multiple days in one month
                    unsupported_features = true;
                    byday = byday.split(",")[0];
                }
                index = byday.slice(0, -2);
                weekday = byday.slice(-2);
                field.find('select[name=' + conf.field.monthly_weekday_of_month_index_name + ']').val(index);
                field.find('select[name=' + conf.field.monthly_weekday_of_month_name + ']').val(weekday);
                field.find('input[name=' + conf.field.monthly_weekday_of_month_interval_name + ']').val(interval);
            }
            
            selectors = field.find('input[name=' + conf.field.monthly_type_name + ']');
            for (index = 0; index < selectors.length; index++) {
                radiobutton = selectors[index];
                $(radiobutton).attr('checked', radiobutton.value === monthly_type);
            }
            break;

        case conf.field.yearly_options_name:
            var yearly_type = conf.field.yearly_day_of_month_value; // Default to using BYMONTHDAY
            
            if (bymonthday) {
                yearly_type = conf.field.yearly_day_of_month_value;
                if (bymonthday.indexOf(',') !== -1) {
                    // No support for multiple days in one month
                    unsupported_features = true;
                    bymonthday = bymonthday.split(",")[0];
                }
                field.find('select[name=' + conf.field.yearly_day_of_month_month_name + ']').val(bymonth);                    
                field.find('select[name=' + conf.field.yearly_day_of_month_index_name + ']').val(bymonthday);                    
            }

            if (byday) {
                yearly_type = conf.field.yearly_weekday_of_month_value;
                
                if (byday.indexOf(',') !== -1) {
                    // No support for multiple days in one month
                    unsupported_features = true;
                    byday = byday.split(",")[0];
                }
                index = byday.slice(0, -2);
                weekday = byday.slice(-2);
                field.find('select[name=' + conf.field.yearly_weekday_of_month_index_name + ']').val(index);
                field.find('select[name=' + conf.field.yearly_weekday_of_month_day_name + ']').val(weekday);
                field.find('select[name=' + conf.field.yearly_weekday_of_month_month_name + ']').val(bymonth);
            }
            
            selectors = field.find('input[name=' + conf.field.yearly_type_name + ']');
            for (index = 0; index < selectors.length; index++) {
                radiobutton = selectors[index];
                $(radiobutton).attr('checked', radiobutton.value === yearly_type);
            }
            break;
            
        case conf.field.range_options_name:
            var range_type = conf.field.range_no_end;
            
            if (count) {
                range_type = conf.field.range_by_ocurrences;
                field.find('input[name=' + conf.field.range_by_ocurrences_value_name + ']').val(count);
            }
            
            if (until) {
                range_type = conf.field.range_by_end_date;
                input = field.find('input[name=' + conf.field.range_by_end_date_calendar_name + ']');
                year = until.slice(0, 4);
                month = until.slice(4, 6);
                if (month[0] === '0') {
                    month = month[1]; //parseInt fails on leading zeroes. 
                }
                month = parseInt(month, 10) - 1;
                day = until.slice(6, 8);
                input.data('dateinput').setValue(year, month, day);
            }
            
            selectors = field.find('input[name=' + conf.field.range_type_name + ']');
            for (index = 0; index <  selectors.length; index++) {
                radiobutton = selectors[index];
                $(radiobutton).attr('checked', radiobutton.value === range_type);
            }
            break;
        }
    }
    
    if (unsupported_features) {
        alert(conf.i18n.no_template_match);
    }

}

(function ($) {
    
    /**
     * RecurrenceInput - form, display and tools for recurrenceinput widget
     */
    function RecurrenceInput(conf, textarea) {

        var self = this;
        var form, display, overlay_conf;

        // The recurrence type dropdown should show certain fields depending
        // on selection:        
        function display_fields(selector) {
            var i;
            // First hide all the fields
            form.find('.recurrenceinput_field').hide();
            // Then show the ones that should be shown.
            var value = selector.val();
            if (value) {
                var rtemplate = conf.rtemplate[value];
                for (i = 0; i < rtemplate.fields.length; i++) {
                    form.find('#' + rtemplate.fields[i]).show();
                }
            }
        }
        
        // Loading (populating) display and form widget with
        // passed RFC2554 string (data)
        function loadData(rfc2445) {
            var selector;
            
            if (rfc2445) {
                widget_load_from_rfc2445(form, conf, rfc2445);
                // check checkbox
                display.find('input[name=' + conf.field.checkbox_name + ']')
                    .attr('checked', true);
            }
            
            selector = form.find('select[name=' + conf.field.rtemplate_name + ']');
            display_fields(selector);            
        }
        
        function recurrenceOn() {
            var RFC2554 = widget_save_to_rfc2445(form, conf);
            var label = display.find('label[class=' + conf.klass.display_label + ']');
            label.text(conf.i18n.display_label_activate + ' ' + RFC2554.description);
            textarea.val(RFC2554.result);
        }

        function recurrenceOff() {
            var label = display.find('label[class=' + conf.klass.display_label + ']');
            label.text(conf.i18n.display_label_unactivate);
            textarea.val('');
        }

        function toggleRecurrence(e) {
            var checkbox = display.find('input[name=' + conf.field.checkbox_name + ']');
            if (checkbox.is(':checked')) {
                recurrenceOn();
            } else {
                recurrenceOff();
            }
        }

        function save(event) {
            event.preventDefault();
            // close overlay
            form.overlay().close();
            // check checkbox
            display.find('input[name=' + conf.field.checkbox_name + ']')
                .attr('checked', true);
            recurrenceOn();
        }


        function cancel(event) {
            event.preventDefault();
            // close overlay
            form.overlay().close();
        }

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
            }
        });
        display = $(conf.template.display).tmpl(conf);

        // The overlay = form popup
        $.ajax({
            url: $(conf.template.form)[0].src,
            async: false,
            success: function (data) {
                conf.template.form = data;
            },
            error: function (request, status, error) {
                alert(error.message + ": " + error.filename);
            }
        });
        form = $(conf.template.form).tmpl(conf);
        // Make an overlay
        overlay_conf = $.extend(conf.form_overlay, {});
        // Hide it
        form.overlay().hide();
        
        // Make the date input into a calendar dateinput()
        form.find('input[name=' + conf.field.range_by_end_date_calendar_name + ']').dateinput({
            selectors: true,
            format: conf.i18n.short_date_format,
        });

        // Load the form.
        loadData(textarea.val());
        if (textarea.val()) {
            recurrenceOn();
        }

        /* 
          Do all the GUI stuff:
        */
        
        // When you click on the checkbox, recurrence should toggle on/off.
        display.find('input[name=' + conf.field.checkbox_name + ']').click(toggleRecurrence);

        // Show form overlay when you click on the "Edit..." link
        display.find('a[name=' + conf.field.edit_name + ']').click(
            function (e) {
                e.preventDefault();
                form.overlay().load();
            }
        );

                
        form.find('select[name=' + conf.field.rtemplate_name + ']').change(
            function (e) {
                display_fields($(this));
            }
        );
        

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

        form.find('.' + conf.klass.save_button).click(save);
        form.find('.' + conf.klass.cancel_button).click(cancel);
    }


    /*
     * jQuery plugin implementation
     */
    $.fn.recurrenceinput = function (conf) {
        if (this.data('recurrenceinput')) {
            // plugin already installed
            return this.data('recurrenceinput'); 
        }
        // "compile" configuration for widget
        conf = $.extend(default_conf, conf);

        // our recurrenceinput widget instance
        var recurrenceinput = new RecurrenceInput(conf, this);
        // hide textarea and place display_widget after textarea
        recurrenceinput.form.appendTo('body');
        this.after(recurrenceinput.display);
        
        if (this.val()) {
            recurrenceinput.display.find(
                'input[name=' + conf.field.checkbox_name + ']'
            ).attr('checked', true);
        }
        
        // hide the textarea
        this.hide();
        
        // save the data for next call
        this.data('recurrenceinput', recurrenceinput);
        return recurrenceinput;
    };

}(jQuery));
