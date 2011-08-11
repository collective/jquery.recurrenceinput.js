/**
 * http://garbas.github.com/jquery.recurrenceinput.js
 *
 * Author: Rok Garbas <rok@garbas.si>
 * Since: Sep 2010
 * Date: XX-XX-XXXX
 */
(function($) {

    var today = new Date()
    var basename = 'recurrenceinput';

    /**
     * Configurable values
     */
    var default_conf = {
        // STRING TO BE TRANSLATED
        i18n: {
            display_label_unactivate: 'Repeat...',
            display_label_activate: 'Repeat: ',

            freq_daily: 'Daily',
            freq_weekly: 'Weekly',
            freq_monthly: 'Monthly',
            freq_yearly: 'Yearly',

            daily_interval: 'Every [INPUT] days.',

            weekly_interval: 'Every [INPUT1] week(s) on:',

            monthly_day_of_month: 'Day [INPUT1] of the month, every [INPUT2] month(s).',
            monthly_weekday_of_month: 'The [INPUT1] [INPUT2], every [INPUT3] month(s)',

            yearly_day_of_month: 'Every [INPUT1] [INPUT2]',
            yearly_weekday_of_month: 'The [INPUT1] [INPUT2] of [INPUT3]',
            yearly_weekday_of_month_weekday: 'Weekday',
            yearly_weekday_of_month_weekend_day: 'Weekend Day',

            range_label: 'End recurrance',
            range_no_end_label: 'No end',
            range_by_occurences_label: 'End after [INPUT] occurence(s)',
            range_by_end_date_label: 'End by: ',

            cancel_button_label: 'Cancel',
            save_button_label: 'Save',

            order_indexes: ['First', 'Second', 'Third', 'Fourth', 'Last'],
            months: [
                'Januar', 'Februar', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'],
            weekdays: [
                'Monday', 'Tuesday', 'Wednesday', 'Thursday',
                'Friday', 'Saturday', 'Sunday']
        },

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

        range_by_end_date_calendar: {
            yearRange: [-10, 10],
            selectors: true,
            trigger: true
        },

        order_indexes: ['+1', '+2', '+3', '+4', '-1'],
        weekdays: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'],

        // FIELD VALUES
        field: {
            display_name: basename+'_display',
            display_text: null,
            
            checkbox_name: basename+'_checkbox',

            freq_name: basename+'_freq',
            freq_daily_value: 'DAILY',
            freq_weekly_value: 'WEEKLY',
            freq_monthly_value: 'MONTHLY',
            freq_yearly_value: 'YEARLY',

            daily_interval_name: basename+'_daily_interval',
            daily_interval_value: '1',

            weekly_interval_name: basename+'_weekly_interval',
            weekly_interval_value: '1',
            weekly_weekdays_name: basename+'_weekly_weekdays',

            monthly_type_name: basename+'_monthly_type',
            monthly_day_of_month_value: 'DAY_OF_MONTH',
            monthly_day_of_month_interval_value: '1',
            monthly_day_of_month_interval_name: '_monthly_day_of_month_interval',
            monthly_weekday_of_month_value: 'WEEKDAY_OF_MONTH',
            monthly_weekday_of_month_index_name: basename+'_monthly_weekday_of_month_index',
            monthly_weekday_of_month_name: basename+'_monthly_weekday_of_month',
            monthly_weekday_of_month_interval_name: basename+'_monthly_weekday_of_month_interval',
            monthly_weekday_of_month_interval_value: '1',

            yearly_type_name: basename+'_yearly_type',
            yearly_day_of_month_name: basename+'_yearly_day_of_month',
            yearly_day_of_month_index_name: basename+'_yearly_day_of_month_index',
            yearly_day_of_month_value: 'DAY_OF_MONTH',
            yearly_weekday_of_month_index_name: basename+'_yearly_weekday_of_month_index',
            yearly_weekday_of_month_name: basename+'_yearly_weekday_of_month',
            yearly_weekday_of_month_month_name: basename+'_yearly_weekday_of_month_month',
            yearly_weekday_of_month_value: 'WEEKDAY_OF_MONTH',
            yearly_weekday_of_month_weekday_value: 'WEEKDAY',
            yearly_weekday_of_month_weekend_day_value: 'WEEKEND_DAY',

            range_type_name: basename+'_range_type',
            range_by_end_date_year_name: basename+'_range_by_end_date_year',
            range_by_end_date_month_name: basename+'_range_by_end_date_month',
            range_by_end_date_day_name: basename+'_range_by_end_date_day',
            range_by_end_date_calendar_name: basename+'_range_by_end_date_calendar',
            range_no_end: 'NO_END_DATE',
            range_by_ocurrences: 'BY_OCURRENCES',
            range_by_end_date: 'BY_END_DATE',
            range_by_ocurrences_value: '10',
            range_by_end_date_year_value: today.getFullYear(),
            range_by_end_date_month_value: today.getMonth(),
            range_by_end_date_day_value: today.getDate(),
        },

        // TEMPATE NAMES
        template: {
            form: '#jquery-recurrenceinput-form-tmpl',
            display: '#jquery-recurrenceinput-display-tmpl',
            dateinput: '#collective-z3cform-dateinput-tmpl'
        },

        // CLASS NAMES
        klass: {
            clear: basename+'_clear',

            display: basename+'_display',
            display_text: basename+'_display_text',

            form: basename+'_form',
            freq: basename+'_freq',
            freq_options: basename+'_freq_options',
            freq_option_active: basename+'_freq_option_active',
            freq_daily: basename+'_freq_daily',
            freq_weekly: basename+'_freq_weekly',
            freq_monthly: basename+'_freq_monthly',
            freq_yearly: basename+'_freq_yearly',

            weekly_interval: basename+'_weekly_interval',
            weekly_weekdays: basename+'_weekly_weekdays',

            range: basename+'_range',
            range_type: basename+'_range_type',
            range_by_ocurrences: basename+'_range_by_ocurrences',
            range_by_end_date: basename+'_range_by_end_date',

            cancel_button: basename+'_cancel_button',
            save_button: basename+'_save_button'
        }
    };

    /**
     * Loading (populating) widget from RFC2554 string
     */
    function load_from_rfc2445(el, data, conf) {
        var matches = /^FREQ=(DAILY|WEEKLY|MONTHLY|YEARLY)/.exec(data);
        var frequency = matches[1];
        var able_to_parse = false;

        interval = null;
        matches = /INTERVAL=([0-9]+);?/.exec(data);
        if (matches) {
            interval = matches[1];
        }

        byday = null;
        matches = /BYDAY=([^;]+);?/.exec(data);
        if (matches) {
            byday = matches[1];
        }

        bymonthday = null;
        matches = /BYMONTHDAY=([^;]+);?/.exec(data);
        if (matches) {
            bymonthday = matches[1].split(',');
        }

        bymonth = null;
        matches = /BYMONTH=([^;]+);?/.exec(data);
        if (matches) {
            bymonth = matches[1].split(',');
        }

        bysetpos = null;
        matches = /BYSETPOS=([^;]+);?/.exec(data);
        if (matches) {
            bysetpos = matches[1];
        }

        switch (frequency) {
            case 'DAILY':
            case 'WEEKLY':
            case 'MONTHLY':
            case 'YEARLY':
                $('input[name='+conf.classname_freq+']', el).val([frequency]);
                $('input[value='+frequency+']', el).change();
            break;
        }

        switch (frequency) {
            case 'DAILY':
                if (interval) {
                    $('input[name='+conf.classname_daily_type+']', el).val(['DAILY']);
                    $('input[name='+conf.classname_daily_interval+']', el).val(interval);
                    able_to_parse = true;
                }
                break;
            case 'WEEKLY':
                if (interval) {
                    $('input[name='+conf.classname_weekly_interval+']', el).val(interval);
                    able_to_parse = true;
                }
                else {
                    $('input[name='+conf.classname_weekly_interval+']', el).val('1');
                }
                if (byday) { 
                    // TODO: if this is weekdays and interval=null, select DAILY#weekdays?
                    $('input[name='+conf.classname_weekly_weekdays+']', el).val(byday.split(','));
                    able_to_parse = true;
                }
                break;
            case 'MONTHLY':
                if (bymonthday && interval) { // Day X of the month, every Y months
                    $('input[name='+conf.classname_monthly_type+']', el).val(['DAY_OF_MONTH']);
                    $('select[name='+conf.classname_monthly_dayofmonth_day+']', el).val(bymonthday);
                    $('input[name='+conf.classname_monthly_dayofmonth_interval+']', el).val(interval);
                    able_to_parse = true;
                }
                else if (byday && bysetpos && interval) {
                    $('select[name='+conf.classname_monthly_weekdayofmonth_index+']', el).val(bysetpos);
                    $('input[name='+conf.classname_monthly_weekdayofmonth_interval+']', el).val(interval);
                    if (byday === 'MO,TU,WE,TH,FR') {
                        $('select[name='+conf.classname_monthly_weekdayofmonth+']', el).val('WEEKDAY');
                        able_to_parse = true;
                    }
                    else if (byday === 'SA,SU') {
                        $('select[name='+conf.classname_monthly_weekdayofmonth+']', el).val('WEEKEND_DAY');
                        able_to_parse = true;
                    }
                }
                else if (byday && interval) { // The Nth X of the month, every Y months
                    $('input[name='+conf.classname_monthly_type+']', el).val(['WEEKDAY_OF_MONTH']);
                    $('input[name='+conf.classname_monthly_weekdayofmonth_interval+']', el).val(interval);
                    matches = /^(-?[0-9]+)([A-Z]{1,2}$)/.exec(byday); // we expect this to be -1TH
                    if (!matches || matches.length != 3) {
                        break; // don't understand the format
                    }
                    $('select[name='+conf.classname_monthly_weekdayofmonth_index+']', el).val(matches[1]);
                    $('select[name='+conf.classname_monthly_weekdayofmonth+']', el).val(matches[2]);
                    able_to_parse = true;
                }
                break;
            case 'YEARLY':
                if (bymonth && bymonthday) { // Every [January] [1]
                    $('input[name='+conf.classname_yearly_type+']', el).val(['DAY_OF_MONTH']);
                    $('select[name='+conf.classname_yearly_dayofmonth_month+']', el).val(bymonth);
                    $('select[name='+conf.classname_yearly_dayofmonth_day+']', el).val(bymonthday);
                    able_to_parse = true;
                }
                else if (byday && bysetpos && bymonth) {
                    $('select[name='+conf.classname_yearly_weekdayofmonth_months+']', el).val(bymonth);
                    $('select[name='+conf.classname_yearly_weekdayofmonth_index+']', el).val(bysetpos);
                    if (byday === 'MO,TU,WE,TH,FR') {
                        $('select[name='+conf.classname_yearly_weekdayofmonth_day+']', el).val('WEEKDAY');
                        able_to_parse = true;
                    }
                    else if (byday === 'SA,SU') {
                        $('select[name='+conf.classname_yearly_weekdayofmonth_day+']', el).val('WEEKEND_DAY');
                        able_to_parse = true;
                    }
                }
                else if (bymonth && byday) {
                    $('input[name='+conf.classname_yearly_type+']', el).val(['WEEKDAY_OF_MONTH']);
                    $('select[name='+conf.classname_yearly_weekdayofmonth_months+']', el).val(bymonth);
                    matches = /^(-?[0-9]+)([A-Z]{1,2})$/.exec(byday); // we expect this to be -1TH
                    if (matches && matches.length == 3) {
                        $('select[name='+conf.classname_yearly_weekdayofmonth_index+']', el).val(matches[1]);
                        $('select[name='+conf.classname_yearly_weekdayofmonth_day+']', el).val(matches[2]);
                        able_to_parse = true;
                    }
                }
                break;
        }

        count = null;
        matches = /COUNT=([^;]+);?/.exec(data);
        if (matches) {
            count = matches[1];
        }

        until = null;
        matches = /UNTIL=([^;]+);?/.exec(data);
        if (matches) {
            until = matches[1];
        }

        // RANGE
        if (count) {
            $('input[name='+conf.classname_range_type+']', el).val(['BY_OCURRENCES']);
            $('input[name='+conf.classname_range_by_ocurrences+']', el).val(count);
        }
        else if (until) {
            $('input[name='+conf.classname_range_type+']', el).val(['BY_END_DATE']);
            until = new Date(until.slice(0,4), until.slice(4,6), until.slice(6,8));
            $('input[name='+conf.classname_range+'_year]', el).val(until.getFullYear());
            $('select[name='+conf.classname_range+'_month]', el).val(until.getMonth());
            $('input[name='+conf.classname_range+'_day]', el).val(until.getDate());
        }
        else {
            $('input[name='+conf.classname_range_type+']', el).val(['NO_END_DATE']);
        }

        if (!able_to_parse) {
            // TODO: Probably want to throw and exception here
            //alert('Cannot parse! ' + data);
        }
    }

    /**
     * Parsing RFC2554 from widget
     */
    function saverule_to_rfc2445(el, conf) {
        var result = '';
        var frequency = $('input[name='+conf.classname_freq+']:checked', el).val();
        switch (frequency) {
            case 'DAILY':
                result = 'FREQ=DAILY';
                result += ';INTERVAL=' + $('input[name='+conf.classname_daily_interval+']', el).val();;
                break;
            case 'WEEKLY':
                result = 'FREQ=WEEKLY';
                result += ';INTERVAL=' + $('input[name='+conf.classname_weekly_interval+']', el).val();
                days = [];
                $('input[name='+conf.classname_weekly_weekdays+']:checked', el).each(function() {
                    days[days.length] = $(this).val();
                });
                if (days.length) {
                    result += ';BYDAY=' + days;
                }
                break;
            case 'MONTHLY':
                result = 'FREQ=MONTHLY';
                monthly_type = $('input[name='+conf.classname_monthly_type+']:checked', el).val();
                switch (monthly_type) {
                    case 'DAY_OF_MONTH':
                        day = $('select[name='+conf.classname_monthly_dayofmonth_day+']', el).val();
                        interval = $('input[name='+conf.classname_monthly_dayofmonth_interval+']', el).val();
                        result += ';BYMONTHDAY=' + day;
                        result += ';INTERVAL=' + interval;
                        break;
                    case 'WEEKDAY_OF_MONTH':
                        var index = $('select[name='+conf.classname_monthly_weekdayofmonth_index+']', el).val();
                        var day = $('select[name='+conf.classname_monthly_weekdayofmonth+']', el).val();
                        var interval = $('input[name='+conf.classname_monthly_weekdayofmonth_interval+']', el).val();
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
                        result += ';INTERVAL=' + interval;
                        break;
                }
                break;
            case 'YEARLY':
                result = 'FREQ=YEARLY';
                yearly_type = $('input[name='+conf.classname_yearly_type+']:checked', el).val();
                switch (yearly_type) {
                    case 'DAY_OF_MONTH':
                        var month = $('select[name='+conf.classname_yearly_dayofmonth_month+']', el).val();
                        var day = $('select[name='+conf.classname_yearly_dayofmonth_day+']', el).val();
                        result += ';BYMONTH=' + month;
                        result += ';BYMONTHDAY=' + day;
                        break;
                    case 'WEEKDAY_OF_MONTH':
                        var index = $('select[name='+conf.classname_yearly_weekdayofmonth_index+']', el).val();
                        var day = $('select[name='+conf.classname_yearly_weekdayofmonth_day+']', el).val();
                        var month = $('select[name='+conf.classname_yearly_weekdayofmonth_months+']', el).val();
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
        }

        var range_type = $('input[name='+conf.classname_range_type+']:checked', el).val();
        switch (range_type) {
            case 'BY_OCURRENCES':
                result += ';COUNT=' + $('input[name='+conf.classname_range_by_ocurrences+']').val();
                break;
            case 'BY_END_DATE':
                var year = $('input[name='+conf.classname_range+'_year]').val();
                var month = $('select[name='+conf.classname_range+'_month]').val();
                var day = $('input[name='+conf.classname_range+'_day]').val();
                if (month < 10) {
                    month = '0' + month;
                }
                if (day < 10) {
                    day = '0' + day;
                }
                result += ';UNTIL='+year+month+day+'T000000';
                break;
        }

        return result
    }

    /**
     * RecurrenceInput - form, display and tools for recurrenceinput widget
     */
    function RecurrenceInput(conf) {

        var self = this;
        $.ajax({
            url: $(conf.template.display)[0].src,
            async: false,
            success: function (data) {
                conf.template.display = data;
            }
        });
        
        $.ajax({
            url: $(conf.template.form)[0].src,
            async: false,
            success: function (data) {
                conf.template.form = data;
            }
        });
                
        $.ajax({
            url: $(conf.template.dateinput)[0].src,
            async: false,
            success: function (data) {
                conf.template.dateinput = data;
            }
        });
        
        var display = $(conf.template.display).tmpl(conf);                      // display part of the widget
        var form = $(conf.template.form).tmpl(conf);                            // recurrance form (will be displayed in overlay

        function clickableLabel() {                                             //  and on click select radion button
            $(this).parent().find('> input').click().change();
        }
        form.find('ul.'+conf.klass.freq+' label').click(clickableLabel);
        display.find('label').click(clickableLabel);


        overlay_conf = $.extend(conf.form_overlay, {                            // on close of overlay we make sure display checbox is unchecked
            onClose: function(e) {
                display.find('> input').attr('checked', false); 
            }
        });
        form.hide().overlay(overlay_conf);                                      // create ovelay from forcreate ovelay from form


        display.find('input[name='+conf.field.display_name+']')                 // show form overlay on change of display radio box 
            .change(function(e) {
                if ($(this).is(':checked')) {
                    form.overlay().load();
                }
        });


        form.find('input[name='+conf.field.freq_name+']')                       // frequency options 
            .change(function(e) {
                form.find('div.'+conf.klass.freq_options+' > div').hide();
                form.find($(this).attr('ref')).show()
                    .addClass(conf.klass.freq_option_active);
        });

        form.find('input[name='+conf.field.range_by_end_date_calendar_name+']') // activate Datetime input for c.z3cform.datetimewidget like widget
            .dateinput($.extend(conf.range_by_end_date_calendar, {
                value: new Date(
                    conf.field.range_by_end_date_year_value,
                    conf.field.range_by_end_date_month_value,
                    conf.field.range_by_end_date_day_value
                ),
                change: function() {
                    var value = this.getValue('yyyy-m-d').split('-');
                    var el = this.getInput().parent();
                    el.find('input=[name='+conf.field.range_by_end_date_year_name+']').val(value[0]);                   // populate calendar fields
                    el.find('select=[name='+conf.field.range_by_end_date_month_name+']').val(value[1]);
                    el.find('input=[name='+conf.field.range_by_end_date_day_name+']').val(value[2]);
                },
                onShow: function () {
                    var trigger_offset = $(this).next().offset();
                    $(this).data('dateinput').getCalendar()                     // position calendar dateinput widget
                        .offset({
                            top: trigger_offset.top+33,
                            left: trigger_offset.left
                        });
                },
            }));


        /**
         * Saving data selected in form and returning RFC2554 string
         */
        function save(data) {
            form.overlay().close();                                             // close overlay

            alert('saverule_to_rfc2445 should be moved here!');                 // FIXME:

                                                                                // TODO: only do below when save button is pressed
            display.find('input[name='+field.display_name+']')                  // mark radio butto as 
                   .attr('checked', false);

            return RFC2554
        }


        /**
         * Loading (populating) display and form widget with
         * passed RFC2554 string (data)
         */
        function load(data) {
            if (data) {
                alert('load_from_rfc2445 should be moved here!');               // FIXME:
            } else {
                alert('we should load default values. FREQ')
            }
        }


        /*
         * Public API of RecurrenceInput
         */
        $.extend(self, {
            display: display,
            form: form, 
            load: load,
            save: save
        });

    }



    /*
     * jQuery plugin implementation
     */
    $.fn.recurrenceinput = function(conf) {
        if (this.data('recurrenceinput')) { return this; }                      // plugin already installed
        var conf = $.extend(default_conf, conf)                                 // "compile" configuration for widget
        this.each(function() {                                                  // apply this for every textarea
            var textarea = $(this);
            if (textarea[0].type == 'textarea') {
                var recurrenceinput = new RecurrenceInput(conf);                // our recurrenceinput widget instance
                recurrenceinput.form.appendTo('body');                          // hide textarea and place display_widget after textarea
                recurrenceinput.load(textarea.val());                           // load data provided by textarea
                //recurrenceinput.form.appendTo('body');                          // FIXME: is this actually needed? ... place widget at the bottom (its overlay anyway)
                textarea.closest('form').submit(function(e) {                   //
                    e.preventDefault();
                    textarea.val(recurrenceinput.save());
                });
                textarea.hide();
                textarea.after(recurrenceinput.display);                 // hide textarea and place display_widget after textarea
            };
        });
    };

})(jQuery);
