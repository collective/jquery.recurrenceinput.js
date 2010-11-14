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
        base_id: basename,

        i18n: {
            display_label_unactivate: 'Repeat...',
            display_label_activate: 'Repeat: ',

            freq_daily: 'Daily',
            freq_weekly: 'Weekly',
            freq_monthly: 'Monthly',
            freq_yearly: 'Yearly',

            months: [
                'Januar', 'Februar', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'],
            weekdays: [
                'Monday', 'Tuesday', 'Wednesday', 'Thursday',
                'Friday', 'Saturday', 'Sunday']
        },

        // FIELD VALUES
        field: {
            display_name: basename+'_display',
            display_text: null,

            freq_daily: 'DAILY',
            freq_weekly: 'WEEKLY',
            freq_monthly: 'MONTHLY',
            freq_yearly: 'YEARLY',

            freq_daily_name: basename+'_freq_daily',
            freq_weekly_name: basename+'_freq_weekly',
            freq_monthly_name: basename+'_freq_monthly',
            freq_yearly_name: basename+'_freq_yearly',

            end_by_date_year: today.getFullYear(),
            end_by_date_month: today.getMonth(),
            end_by_date_day: today.getDate(),

            weekdays: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']
        },

        // TEMPATE NAMES
        template: {
            widget: '#jquery-recurrenceinput-display-tmpl',
            form: '#jquery-recurrenceinput-form-tmpl',
            rule: '#jquery-recurrenceinput-rule-tmpl',
            date: '#collective-z3cform-dateinput-tmpl'
        },

        // CLASS NAMES
        class: {
            main: basename,

            display: basename+'_display',
            display_text: basename+'_display_text',

            form: basename+'_form',
            freq: basename+'_freq',
            freq_options: basename+'_freq_options',
            freq_daily: basename+'_freq_daily',
            freq_weekly: basename+'_freq_weekly',
            freq_monthly: basename+'_freq_monthly',
            freq_yearly: basename+'_freq_yearly',

            daily_interval: basename+'_daily_interval',

            weekly_interval: basename+'_weekly_interval',
            weekly_weekdays: basename+'_weekly_weekdays',

            monthly_type: basename+'_monthly_type',
            monthly_dayofmonth_day: basename+'_monthly_dayofmonth_day',
            monthly_dayofmonth_interval: basename+'_monthly_dayofmonth_interval',
            monthly_weekdayofmonth_index: basename+'_monthly_weekdayofmonth_index',
            monthly_weekdayofmonth: basename+'_monthly_weekdayofmonth',
            monthly_weekdayofmonth_interval: basename+'_monthly_weekdayofmonth_interval',

            yearly_type: basename+'_yearly_type',
            yearly_dayofmonth_month: basename+'_yearly_dayofmonth_month',
            yearly_dayofmonth_day: basename+'_yearly_dayofmonth_day',
            yearly_weekdayofmonth_index: basename+'_yearly_weekdayofmonth_index',
            yearly_weekdayofmonth_day: basename+'_yearly_weekdayofmonth_day',
            yearly_weekdayofmonth_months: basename+'_yearly_weekdayofmonth_months',

            range: basename+'_range',
            range_type: basename+'_range_type',
            range_by_ocurrences: basename+'_range_by_ocurrences',
            range_by_end_date: basename+'_range_by_end_date',

            z3cform_dateinput: basename+'_z3cform_dateinput'
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
     * RecurrenceInput widget
     *   |-> build form and display widget
     */
    function RecurrenceInput(conf) {

        var self = this;
        var display = $(conf.template.widget).tmpl(conf);                       // display part of the widget
        var form = $(conf.template.form).tmpl(conf);                            // recurrance form (will be displayed in overlay


        function labelClicable() {                                              // TODO: check if this could be solved with $.closest
            $(this).parent().find('input[type=radio]').click().change();        //  and on click select radion button
        }
        form.find('ul.'+conf.class.freq+' label').click(labelClickable);
        display.find('label').click(labelClickable);


        form.find('input[name='+conf.classname_freq+']').change(function(e) {   // TODO: should be done with CSS
            form.find('div.'+conf.classname_freq_options+' > div').hide();
            parent_list = $(this).closest('ul');
            font_size = parent_list.css('font-size').replace('px', '').replace('em','');
            form.find('div.'+conf.classname_freq+'_' + $(this).val().toLowerCase())
                .css('margin-left', + (parent_list.width() + 2*font_size)).show();
        });


        form.find('input[name='+field.end_by_date_name+']').dateinput({         // activate Datetime input for c.z3cform.datetimewidget like widget
            value: new Date(
                conf.field.end_by_date_year,
                conf.field.end_by_date_month,
                conf.field.end_by_date_day
            ),
            change: function() {
                var value = this.getValue('yyyy-m-d').split('-');
                var el = this.getInput().parent();                              // TODO: check if this could be solved with $.closest
                el.find('input=[name$=_year]').val(value[0]);                   // populate calendar fields
                el.find('select=[name$=_month]').val(value[1]);
                el.find('input=[name$=_day]').val(value[2]);
            },
            onShow: function () {
                var trigger_offset = $(this).next().offset();
                $(this).data('dateinput').getCalendar().offset({                // position calendar dateinput widget
                    top: trigger_offset.top+33,
                    left: trigger_offset.left
                });
            },
            yearRange: [-10, 10],                                               // TODO: this should be configurable
            selectors: true,
            trigger: true
        });


       form.overlay({                                                           // create ovelay from forcreate ovelay from form
           mask: {                                                              // TODO: this needs to be configurable
               color: '#ebecff',
               loadSpeed: 'fast',
               closeSpeed: 'fast',
               opacity: 0.5
           },
           speed: 'fast',
       });


        widget.find('input[name='+conf.display_name+']').change(function(e) {  // show form overlay on change of display radio box 
            if ($(this).is(':checked')) { form.overlay().load(); }
        });


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
                recurrenceinput.load(textarea.val());                           // load data provided by textarea
                //recurrenceinput.form.appendTo('body');                          // FIXME: is this actually needed? ... place widget at the bottom (its overlay anyway)
                textarea.closest('form').submit(function(e) {                   //
                    e.preventDefault();
                    textarea.val(recurrenceinput.save());
                });
                textarea.hide().after(recurrenceinput.display);                 // hide textarea and place display_widget after textarea
            };
        });
    };

})(jQuery);
