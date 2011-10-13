
/*jslint regexp: false, indent: 4 */
/*global $: false, alert: false, default_conf: false, jQuery: false */

(function ($) {
    $.tools = $.tools || {version: '@VERSION'};
    
    var tool;
    var LABELS = {};
    
    tool = $.tools.recurrenceinput = {
        conf: {
        
            lang: 'en',
            readOnly: false,
            
            // "REMOTE" FIELD
            startField: null,
            ajaxURL: null,
        
            // FORM OVERLAY
            form_overlay: {
                speed: 'fast',
                mask: {
                    color: '#ebecff',
                    loadSpeed: 'fast',
                    closeSpeed: 'fast',
                    opacity: 0.5
                }
            },
        
            // JQUERY TEMPLATE NAMES
            template: {
                form: '#jquery-recurrenceinput-form-tmpl',
                display: '#jquery-recurrenceinput-display-tmpl'
            },
        
            // RECURRENCE TEMPLATES
            rtemplate: {
                daily: {
                    rrule: 'FREQ=DAILY',
                    fields: [
                        'recurrenceinput_daily_interval',
                        'recurrenceinput_range_options'
                    ]
                },
                mondayfriday: {
                    rrule: 'FREQ=WEEKLY;BYDAY=MO,FR',
                    fields: [
                        'recurrenceinput_range_options'
                    ]
                },
                weekdays: {
                    rrule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR',
                    fields: [
                        'recurrenceinput_range_options'
                    ]
                },
                weekly: {
                    rrule: 'FREQ=WEEKLY',
                    fields: [
                        'recurrenceinput_weekly_interval',
                        'recurrenceinput_weekly_weekdays',
                        'recurrenceinput_range_options'
                    ]
                },
                monthly: {
                    rrule: 'FREQ=MONTHLY',
                    fields: [
                        'recurrenceinput_monthly_options',
                        'recurrenceinput_range_options'
                    ]
                },
                yearly: {
                    rrule: 'FREQ=YEARLY',
                    fields: [
                        'recurrenceinput_yearly_options',
                        'recurrenceinput_range_options'
                    ]
                }
            }
        },
        
        localize: function (language, labels) {
            LABELS[language] = labels;        
        },
        
        setTemplates: function (templates, titles) {
            var lang, template;
            tool.conf.rtemplate = templates;
            for (lang in titles) {
                if (titles.hasOwnProperty(lang)) {
                    for (template in titles[lang]) {
                        if (titles[lang].hasOwnProperty(template)) {
                            LABELS[lang].rtemplate[template] = titles[lang][template];
                        }
                    }
                }
            }
        }
        
    };
    
    tool.localize("en", {
        display_label_unactivate: 'Does not repeat',
        display_label_activate: 'Repeats ',
        edit: 'Edit...',
        
        recurrence_type: 'Recurrence type:',

        daily_interval_1: 'Every',
        daily_interval_2: 'days',

        weekly_interval_1: 'Every',
        weekly_interval_2: 'week(s)',
        weekly_weekdays: 'On:',

        monthly_day_of_month_1: 'Day',
        monthly_day_of_month_2: 'of the month',
        monthly_day_of_month_3: ', every',
        monthly_day_of_month_4: 'month(s)',
        monthly_weekday_of_month_1: 'The',
        monthly_weekday_of_month_2: '',
        monthly_weekday_of_month_3: ', every',
        monthly_weekday_of_month_4: 'month(s)',

        yearly_day_of_month_1: 'Every',
        yearly_day_of_month_2: '',
        yearly_day_of_month_3: '',
        yearly_weekday_of_month_1: 'The',
        yearly_weekday_of_month_2: '',
        yearly_weekday_of_month_3: 'of',
        yearly_weekday_of_month_4: '',
        
        range_label: 'End recurrance:',
        range_no_end_label: 'No end',
        range_by_occurrences_label_1: 'Ending after',
        range_by_occurrences_label_2: 'occurrence(s)',
        range_by_end_date_label: 'Until ',

        cancel_button_label: 'Cancel',        
        save_button_label: 'Save',

        order_indexes: ['First', 'Second', 'Third', 'Fourth', 'Last'],
        months: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'],
        weekdays: [
            'Monday', 'Tuesday', 'Wednesday', 'Thursday',
            'Friday', 'Saturday', 'Sunday'],
            
        long_date_format: 'mmmm dd, yyyy',
        short_date_format: 'mm/dd/yyyy',
            
        no_template_match: 'Warning: This event uses recurrence features not ' +
                           'supported by this widget. Saving the recurrence ' +
                           'may change the recurrence in unintended ways.',
                           
        rtemplate: {
            daily: 'Daily',
            mondayfriday: 'Mondays and Fridays',
            weekdays: 'Weekdays',
            weekly: 'Weekly',
            monthly: 'Monthly',
            yearly: 'Yearly'
        }
    });


    var OCCURRENCE_TMPL = '<div class="recurrenceinput_occurrences"><hr/>\
        {{each occurrences}}\
            <div class="occurrence>\
                <span class="date ${occurrences[$index].type}">\
                    ${occurrences[$index].formatted_date}\
                </span>\
                <span class="action">\
                    {{if occurrences[$index].type === "rrule"}}\
                        <a date="${occurrences[$index].date}" href="#"\
                           class="${occurrences[$index].type}" >\
                            Exclude\
                        </a>\
                    {{/if}}\
                    {{if occurrences[$index].type === "exdate"}}\
                        <a date="${occurrences[$index].date}" href="#"\
                           class="${occurrences[$index].type}" >\
                            Include\
                        </a>\
                    {{/if}}\
                    {{if occurrences[$index].type === "exdate"}}\
                        <a date="${occurrences[$index].date}" href="#"\
                           class="${occurrences[$index].type}" >\
                            Remove\
                        </a>\
                    {{/if}}\
                </span>\
            </div>\
        {{/each}}\
        <div class="batching">\
            {{each batch.batches}}\
                {{if $index === batch.current_batch}}<span class="current">{{/if}}\
                    <a href="#" start="${batch.batches[$index][0]}">[${batch.batches[$index][0]} - ${batch.batches[$index][1]}]</a>\
                {{if $index === batch.current_batch}}</span>{{/if}}\
            {{/each}}\
        </div></div>';
    
    $.template('occurrence_tmpl', OCCURRENCE_TMPL)
    
    /**
     * Parsing RFC5545 from widget
     */
    function widget_save_to_rfc5545(form, conf) {
        var value = form.find('select[name=recurrenceinput_rtemplate]').val();
        var rtemplate = conf.rtemplate[value];
        var result = rtemplate.rrule;
        var human = conf.i18n.rtemplate[value];
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
        
        return {result: 'RRULE:' + result, description: human};
    }

    
    function parseIcal(icaldata) {
        var lines = new Array();
        var result = new Object();
        var line = '';
        var nextline, pos;
        
        lines = icaldata.split('\n');
        lines.reverse();
        while (lines.length != 0) {
            nextline = lines.pop();
            if (nextline.charAt(0) === ' ' | nextline.charAt(0) === '\t') {
                // Line continuation:
                line = line + nextline;
            } else {
                // New line; the current one is finished.
                if (line !== '') {
                    pos = line.indexOf(':');
                    result[line.substring(0, pos)] = line.substring(pos + 1)
                }
                line = nextline;
            }
        }
        // And push the last line:
        pos = line.indexOf(':');
        result[line.substring(0, pos)] = line.substring(pos + 1)
        return result;
    }
    
    function widget_load_from_rfc5545(form, conf, icaldata) {
        var unsupported_features = false;
        var i, matches, match, match_index, rtemplate, d, input, index;
        var selector, selectors, field, radiobutton, start, end;
        var interval, byday, bymonth, bymonthday, bysetpos, count, until;
        var day, month, year, weekday, ical;

        ical = parseIcal(icaldata);
        
        matches = /INTERVAL=([0-9]+);?/.exec(ical.RRULE);
        if (matches) {
            interval = matches[1];
        } else {
            interval = '1';
        }
    
        matches = /BYDAY=([^;]+);?/.exec(ical.RRULE);
        if (matches) {
            byday = matches[1];
        } else {
            byday = '';
        }
        
        matches = /BYMONTHDAY=([^;]+);?/.exec(ical.RRULE);
        if (matches) {
            bymonthday = matches[1].split(",");
        } else {
            bymonthday = null;
        }
    
        matches = /BYMONTH=([^;]+);?/.exec(ical.RRULE);
        if (matches) {
            bymonth = matches[1].split(",");
        } else {
            bymonth = null;
        }
    
        matches = /BYSETPOS=([^;]+);?/.exec(ical.RRULE);
        if (matches) {
            bysetpos = matches[1];
        } else {
            bysetpos = null;
        }
        
        matches = /COUNT=([0-9]+);?/.exec(ical.RRULE);
        if (matches) {
            count = matches[1];
        } else {
            count = null;
        }
        
        matches = /UNTIL=([0-9T]+);?/.exec(ical.RRULE);
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
                if (ical.RRULE.indexOf(rtemplate.rrule) === 0) {
                    if (ical.RRULE.length > match.length) {
                        // This is the best match so far
                        match = ical.RRULE;
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
                var monthly_type = 'DAY_OF_MONTH'; // Default to using BYMONTHDAY
                
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
    
    /**
     * RecurrenceInput - form, display and tools for recurrenceinput widget
     */
    function RecurrenceInput(conf, textarea) {

        var self = this;
        var form, display, overlay_conf;

        // Extend conf with non-configurable data used by templates.
        $.extend(conf, {
            order_indexes: ['+1', '+2', '+3', '+4', '-1'],
            weekdays: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']
        });
        
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

        function loadOccurrences(start_date, rfc5545, start) {
            var date;
            
            if (conf.ajaxURL === null) {
                return;
            }
            
            occurrence_div = form.find('.recurrenceinput_occurrences');
            occurrence_div.hide();
            
            
            $.ajax({
                url: conf.ajaxURL,
                async: true,
                type: 'post',
                dataType: 'json',
                data: {year: start_date.getFullYear(),
                       month: start_date.getMonth()+1, // Sending January as 0? I think not.
                       day: start_date.getDate(),
                       rrule: rfc5545,
                       format: conf.i18n.long_date_format,
                       start: start},
                success: function (data, status, jqXHR) {
                    result = $.tmpl('occurrence_tmpl', data);
                    occurrence_div = form.find('.recurrenceinput_occurrences');
                    occurrence_div.replaceWith(result);
                    form.find('.recurrenceinput_occurrences .batching a').click(
                        function (event) {
                            event.preventDefault();
                            loadOccurrences(start_date, rfc5545, this.attributes.start.value);
                            //alert(this.attributes.start.value);
                        }
                    );
                    // Show the new div
                    form.find('.recurrenceinput_occurrences').show();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert(textStatus);
                }
            })        
        }
        // Loading (populating) display and form widget with
        // passed RFC5545 string (data)
        function loadData(rfc5545) {
            var selector, format, start_field, start_date, dayindex, day;

            // Find the default byday and bymonthday from the start date, if any:
            if (conf.startField) {
                // Se if it is a field already
                start_field = $(conf.startField);
                if (!start_field.length) {
                    // Otherwise, we assume it's an id:
                    start_field = $('input[id=' + conf.startField + ']');
                }
                
                // Now we have a field, see if it is a dateinput field:
                start_date = start_field.data('dateinput');
                if (start_date === null) {
                    //No, it wasn't, just try to interpret it with Date()
                    start_date = start_field.val();
                } else {
                    // Yes it was, get the date:
                    start_date = start_date.getValue();
                }
                start_date = new Date(start_date);
            }
            
            if (!isNaN(start_date)) {
                // If the date is a real date, set the defaults in the form
                form.find('select[name=recurrenceinput_monthly_day_of_month_day]').val(start_date.getDate());
                dayindex = conf.order_indexes[Math.floor((start_date.getDate() - 1) / 7)];
                day = conf.weekdays[start_date.getDay() - 1];
                form.find('select[name=recurrenceinput_monthly_weekday_of_month_index]').val(dayindex);
                form.find('select[name=recurrenceinput_monthly_weekday_of_month]').val(day);

                form.find('select[name=recurrenceinput_yearly_day_of_month]').val(start_date.getMonth() + 1);
                form.find('select[name=recurrenceinput_yearly_day_of_month_index]').val(start_date.getDate());                    
                form.find('select[name=recurrenceinput_yearly_weekday_of_month_index]').val(dayindex);
                form.find('select[name=recurrenceinput_yearly_weekday_of_month_day]').val(day);
                form.find('select[name=recurrenceinput_yearly_weekday_of_month_month]').val(start_date.getMonth() + 1);
                
                // Now when we have a start date, we can also do an ajax call to calculate occurrences:
                loadOccurrences(start_date, rfc5545, 0);
                                
            }            
            
            if (rfc5545) {
                widget_load_from_rfc5545(form, conf, rfc5545);
                // check checkbox
                display.find('input[name=recurrenceinput_checkbox]')
                    .attr('checked', true);
            }
            
            selector = form.find('select[name=recurrenceinput_rtemplate]');
            display_fields(selector);            
        }
        
        function recurrenceOn() {
            var RFC5545 = widget_save_to_rfc5545(form, conf);
            var label = display.find('label[class=recurrenceinput_display]');
            label.text(conf.i18n.display_label_activate + ' ' + RFC5545.description);
            textarea.val(RFC5545.result);
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

        if (textarea.val()) {
            widget_load_from_rfc5545(form, conf, textarea.val())
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
                // Load the form to set up the right fields to show, etc.
                loadData(textarea.val());
                e.preventDefault();
                form.overlay().load();
            }
        );

        // When selecting template, update what fieldsets are visible.
        form.find('select[name=recurrenceinput_rtemplate]').change(
            function (e) {
                display_fields($(this));
            }
        );

        // When focus goes to a drop-down, select the relevant radiobutton.
        form.find('select').change(
            function (e) {
                $(this).parent().find('> input').click().change();
            }
        );
        
        /*
          Save and cancel methods:
        */
        form.find('.recurrenceinput_cancel_button').click(cancel);
        form.find('.recurrenceinput_save_button').click(save);
        
        /*
         * Public API of RecurrenceInput
         */
         
        $.extend(self, {
            display: display,
            form: form,
            loadData: loadData //Used by tests.
        });

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
        var config = $.extend({}, tool.conf);
        $.extend(config, conf);
        $.extend(config, {i18n: LABELS[config.lang], name: this.attr('name')});

        // our recurrenceinput widget instance
        var recurrenceinput = new RecurrenceInput(config, this);
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
