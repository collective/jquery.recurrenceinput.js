
/*jslint regexp: false, indent: 4 */
/*global $: false, alert: false, default_conf: false, jQuery: false */

/**
 * Parsing RFC2554 from widget
 */
function widget_save_to_rfc2445(form, conf) {
    var value = form.find('select[name=recurrenceinput_rtemplate]').val();
    var rtemplate = conf.rtemplate[value];
    var result = rtemplate.rrule;
    var human = rtemplate.title;
    var field, input, weekdays, i18nweekdays, i, j, index;
    var day, month, interval, yearly_type, occurrences, date;
    
    for (i = 0; i < rtemplate.fields.length; i++) {
        field = form.find('#' + rtemplate.fields[i]);
        
        switch (field.attr('id')) {
        
        case 'recurrenceinput_daily_interval':
            // TODO: Assert that this is a number.
            input = field.find('input[name=recurrenceinput_daily_interval]');
            result += ';INTERVAL=' + input.val();
            human = conf.i18n.daily_interval_1 + ' ' + input.val() + ' ' + conf.i18n.daily_interval_2;
            break;
            
        case 'recurrenceinput_weekly_interval':
            // TODO: Assert that this is a number.
            input = field.find('input[name=recurrenceinput_weekly_interval]');
            result += ';INTERVAL=' + input.val();
            human = conf.i18n.weekly_interval_1 + ' ' + input.val() + ' ' + conf.i18n.weekly_interval_2;
            break;
            
        case 'recurrenceinput_weekly_weekdays':
            weekdays = '';
            i18nweekdays = '';
            for (j = 0; j < conf.weekdays.length; j++) {
                input = field.find('input[name=recurrenceinput_weekly_weekdays_' + conf.weekdays[j] + ']');
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
            
        case 'recurrenceinput_monthly_options':
            var monthly_type = $('input[name=recurrenceinput_monthly_type]:checked', form).val();
            switch (monthly_type) {
            
            case 'DAY_OF_MONTH':
                day = $('select[name=recurrenceinput_monthly_day_of_month_day]', form).val();
                interval = $('input[name=recurrenceinput_monthly_day_of_month_interval]', form).val();
                result += ';BYMONTHDAY=' + day;
                result += ';INTERVAL=' + interval;                        
                human += ', ' + conf.i18n.monthly_day_of_month_1 + ' ' + day + ' ' + conf.i18n.monthly_day_of_month_2;
                if (interval !== 1) {
                    human += conf.i18n.monthly_day_of_month_3 + ' ' + interval + ' ' + conf.i18n.monthly_day_of_month_4;
                }
                break;
            case 'WEEKDAY_OF_MONTH':
                index = $('select[name=recurrenceinput_monthly_weekday_of_month_index]', form).val();
                day = $('select[name=recurrenceinput_monthly_weekday_of_month]', form).val();
                interval = $('input[name=recurrenceinput_monthly_weekday_of_month_interval]', form).val();
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
            
        case 'recurrenceinput_yearly_options':
            yearly_type = $('input[name=recurrenceinput_yearly_type]:checked', form).val();
            switch (yearly_type) {
            
            case 'DAY_OF_MONTH':
                month = $('select[name=recurrenceinput_yearly_day_of_month]', form).val();
                day = $('select[name=recurrenceinput_yearly_day_of_month_index]', form).val();
                result += ';BYMONTH=' + month;
                result += ';BYMONTHDAY=' + day;
                human += ', ' + conf.i18n.months[month - 1] + ' ' + day;
                break;
            case 'WEEKDAY_OF_MONTH':
                index = $('select[name=recurrenceinput_yearly_weekday_of_month_index]', form).val();
                day = $('select[name=recurrenceinput_yearly_weekday_of_month_day]', form).val();
                month = $('select[name=recurrenceinput_yearly_weekday_of_month_month]', form).val();
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
            
        case 'recurrenceinput_range_options':
            var range_type = form.find('input[name=recurrenceinput_range_type]:checked').val();
            switch (range_type) {
            
            case 'BY_OCCURRENCES':
                occurrences = form.find('input[name=recurrenceinput_range_by_occurrences_value]').val();
                result += ';COUNT=' + occurrences;
                human += ', ' + conf.i18n.range_by_occurrences_label_1;
                human += ' ' + occurrences;
                human += ' ' + conf.i18n.range_by_occurrences_label_2;
                break;
            case 'BY_END_DATE':
                field = form.find('input[name=recurrenceinput_range_by_end_date_calendar]');
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
        selector = form.find('select[name=recurrenceinput_rtemplate]').val(match_index);
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
        
        case 'recurrenceinput_daily_interval':
            field.find('input[name=recurrenceinput_daily_interval]').val(interval);
            break;
            
        case 'recurrenceinput_weekly_interval':
            field.find('input[name=recurrenceinput_weekly_interval]').val(interval);
            break;
            
        case 'recurrenceinput_weekly_weekdays':
            for (d = 0; d < conf.weekdays.length; d++) {
                day = conf.weekdays[d];
                input = field.find('input[name=recurrenceinput_weekly_weekdays_' + day + ']');
                input.attr('checked', byday.indexOf(day) !== -1);
            }
            break;
            
        case 'recurrenceinput_monthly_options':
            var monthly_type ='DAY_OF_MONTH'; // Default to using BYMONTHDAY
            
            if (bymonthday) {
                monthly_type = 'DAY_OF_MONTH';
                if (bymonthday.indexOf(',') !== -1) {
                    // No support for multiple days in one month
                    unsupported_features = true;
                    // Just keep the first
                    bymonthday = bymonthday.split(",")[0];
                }
                field.find('select[name=recurrenceinput_monthly_day_of_month_day]').val(bymonthday);
                field.find('input[name=recurrenceinput_monthly_day_of_month_interval]').val(interval);
            }

            if (byday) {
                monthly_type = 'WEEKDAY_OF_MONTH';
                
                if (byday.indexOf(',') !== -1) {
                    // No support for multiple days in one month
                    unsupported_features = true;
                    byday = byday.split(",")[0];
                }
                index = byday.slice(0, -2);
                weekday = byday.slice(-2);
                field.find('select[name=recurrenceinput_monthly_weekday_of_month_index]').val(index);
                field.find('select[name=recurrenceinput_monthly_weekday_of_month]').val(weekday);
                field.find('input[name=recurrenceinput_monthly_weekday_of_month_interval]').val(interval);
            }
            
            selectors = field.find('input[name=recurrenceinput_monthly_type]');
            for (index = 0; index < selectors.length; index++) {
                radiobutton = selectors[index];
                $(radiobutton).attr('checked', radiobutton.value === monthly_type);
            }
            break;

        case 'recurrenceinput_yearly_options':
            var yearly_type = 'DAY_OF_MONTH'; // Default to using BYMONTHDAY
            
            if (bymonthday) {
                yearly_type = 'DAY_OF_MONTH';
                if (bymonthday.indexOf(',') !== -1) {
                    // No support for multiple days in one month
                    unsupported_features = true;
                    bymonthday = bymonthday.split(",")[0];
                }
                field.find('select[name=recurrenceinput_yearly_day_of_month]').val(bymonth);                    
                field.find('select[name=recurrenceinput_yearly_day_of_month_index]').val(bymonthday);                    
            }

            if (byday) {
                yearly_type = 'WEEKDAY_OF_MONTH';
                
                if (byday.indexOf(',') !== -1) {
                    // No support for multiple days in one month
                    unsupported_features = true;
                    byday = byday.split(",")[0];
                }
                index = byday.slice(0, -2);
                weekday = byday.slice(-2);
                field.find('select[name=recurrenceinput_yearly_weekday_of_month_index]').val(index);
                field.find('select[name=recurrenceinput_yearly_weekday_of_month_day]').val(weekday);
                field.find('select[name=recurrenceinput_yearly_weekday_of_month_month]').val(bymonth);
            }
            
            selectors = field.find('input[name=recurrenceinput_yearly_type]');
            for (index = 0; index < selectors.length; index++) {
                radiobutton = selectors[index];
                $(radiobutton).attr('checked', radiobutton.value === yearly_type);
            }
            break;
            
        case 'recurrenceinput_range_options':
            var range_type = 'NO_END_DATE';
            
            if (count) {
                range_type = 'BY_OCCURRENCES';
                field.find('input[name=recurrenceinput_range_by_occurrences_value]').val(count);
            }
            
            if (until) {
                range_type = 'BY_END_DATE';
                input = field.find('input[name=recurrenceinput_range_by_end_date_calendar]');
                year = until.slice(0, 4);
                month = until.slice(4, 6);
                if (month[0] === '0') {
                    month = month[1]; //parseInt fails on leading zeroes. 
                }
                month = parseInt(month, 10) - 1;
                day = until.slice(6, 8);
                input.data('dateinput').setValue(year, month, day);
            }
            
            selectors = field.find('input[name=recurrenceinput_range_type]');
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
                display.find('input[name=recurrenceinput_checkbox]')
                    .attr('checked', true);
            }
            
            selector = form.find('select[name=recurrenceinput_rtemplate]');
            display_fields(selector);            
        }
        
        function recurrenceOn() {
            var RFC2554 = widget_save_to_rfc2445(form, conf);
            var label = display.find('label[class=recurrenceinput_display]');
            label.text(conf.i18n.display_label_activate + ' ' + RFC2554.description);
            textarea.val(RFC2554.result);
        }

        function recurrenceOff() {
            var label = display.find('label[class=recurrenceinput_display]');
            label.text(conf.i18n.display_label_unactivate);
            textarea.val('');
        }

        function toggleRecurrence(e) {
            var checkbox = display.find('input[name=recurrenceinput_checkbox]');
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
            display.find('input[name=recurrenceinput_checkbox]')
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
        if ($.template.recurrenceinput_display === undefined) {
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
            $(conf.template.display).template('recurrenceinput_display');
        }
        display = $.tmpl('recurrenceinput_display', conf);

        // The overlay = form popup
        if ($.template.recurrenceinput_form === undefined) {
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
            $(conf.template.form).template('recurrenceinput_form');
        }
        form = $.tmpl('recurrenceinput_form', conf);
        // Make an overlay
        overlay_conf = $.extend(conf.form_overlay, {});
        // Hide it
        form.overlay().hide();
        
        // Make the date input into a calendar dateinput()
        form.find('input[name=recurrenceinput_range_by_end_date_calendar]').dateinput({
            selectors: true,
            format: conf.i18n.short_date_format
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
        display.find('input[name=recurrenceinput_checkbox]').click(toggleRecurrence);

        // Show form overlay when you click on the "Edit..." link
        display.find('a[name=recurrenceinput_edit]').click(
            function (e) {
                e.preventDefault();
                form.overlay().load();
            }
        );

                
        form.find('select[name=recurrenceinput_rtemplate]').change(
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
            loadData: loadData
        });

        form.find('.recurrenceinput_cancel_button').click(cancel);
        form.find('.recurrenceinput_save_button').click(save);
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
                'input[name=recurrenceinput_checkbox]'
            ).attr('checked', true);
        }
        
        // hide the textarea
        this.hide();
        
        // save the data for next call
        this.data('recurrenceinput', recurrenceinput);
        return recurrenceinput;
    };

}(jQuery));
