/**
 * http://garbas.github.com/jquery.recurrenceinput.js
 *
 * Author: Rok Garbas <rok@garbas.si>
 * Since: Sep 2010
 * Date: XX-XX-XXXX
 */
(function($) {

    /**
     * Configurable values
     */
    var basename = 'recurrenceinput';
    var default_conf = {
        classname: basename,
        classname_activate: basename+'_activate',
        classname_form: basename+'_form',
        classname_freq: basename+'_freq',
        classname_freq_options: basename+'_freq_options',

        classname_freq_monthly: basename+'_freq_monthly',
        classname_freq_yearly: basename+'_freq_yearly',

        classname_freq_daily: basename+'_freq_daily',
        classname_daily_interval: basename+'_daily_interval',

        classname_freq_weekly: basename+'_freq_weekly',
        classname_weekly_interval: basename+'_weekly_interval',
        classname_weekly_weekdays: basename+'_weekly_weekdays',

        classname_monthly_type: basename+'_monthly_type',
        classname_monthly_dayofmonth_day: basename+'_monthly_dayofmonth_day',
        classname_monthly_dayofmonth_interval: basename+'_monthly_dayofmonth_interval',
        classname_monthly_weekdayofmonth_index: basename+'_monthly_weekdayofmonth_index',
        classname_monthly_weekdayofmonth: basename+'_monthly_weekdayofmonth',
        classname_monthly_weekdayofmonth_interval: basename+'_monthly_weekdayofmonth_interval',

        classname_yearly_type: basename+'_yearly_type',
        classname_yearly_dayofmonth_month: basename+'_yearly_dayofmonth_month',
        classname_yearly_dayofmonth_day: basename+'_yearly_dayofmonth_day',
        classname_yearly_weekdayofweek_index: basename+'_yearly_weekdayofmonth_index',
        classname_yearly_weekdayofweek_day: basename+'_yearly_weekdayofmonth_day',
        classname_yearly_weekdayofweek_months: basename+'_yearly_weekdayofmonth_months',

        classname_range: basename+'_range',
        classname_range_start: basename+'_range_start',
        classname_range_end: basename+'_range_end',
        classname_range_end_type: basename+'_range_end_type',
        classname_range_end_by_ocurrences: basename+'_range_end_by_ocurrences',
        classname_range_end_by_end_date: basename+'_range_end_by_end_date',

        classname_z3cform_dateinput: basename+'_z3cform_dateinput',

        template: {
            widget: '#jquery-recurrenceinput-widget-tmpl',
            form: '#jquery-recurrenceinput-form-tmpl',
            rule: '#jquery-recurrenceinput-rule-tmpl',
            date: '#collective-z3cform-dateinput-tmpl' },

        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

        weekdays: [
            {id: 'MO', title: 'Monday'},
            {id: 'TU', title: 'Tuesday'},
            {id: 'WE', title: 'Wednesday'},
            {id: 'TH', title: 'Thursday'},
            {id: 'FR', title: 'Friday'},
            {id: 'SA', title: 'Saturday'},
            {id: 'SU', title: 'Sunday'}]
    };

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
            bymonthday = matches[1].split(",");
        }

        bymonth = null;
        matches = /BYMONTH=([^;]+);?/.exec(data);
        if (matches) {
            bymonth = matches[1].split(",");
        }

        bysetpos = null;
        matches = /BYSETPOS=([^;]+);?/.exec(data);
        if (matches) {
            bysetpos = matches[1];
        }

        switch (frequency) {
            case "DAILY":
            case "WEEKLY":
            case "MONTHLY":
            case "YEARLY":
                $("input[name="+conf.classname_freq+"]", el).val([frequency]);
                $("input[value="+frequency+"]", el).change();
            break;
        }

        switch (frequency) {
            case "DAILY":
                if (interval) {
                    $("input[name="+conf.classname_daily_type+"]", el).val(["DAILY"]);
                    $("input[name="+conf.classname_daily_interval+"]", el).val(interval);
                    able_to_parse = true;
                }
                break;
            case "WEEKLY":
                if (interval) {
                    $("input[name="+conf.classname_weekly_interval+"]", el).val(interval);
                    able_to_parse = true;
                }
                else {
                    $("input[name="+conf.classname_weekly_interval+"]", el).val("1");
                }
                if (byday) { 
                    // TODO: if this is weekdays and interval=null, select DAILY#weekdays?
                    $("input[name="+conf.classname_weekly_weekdays+"]", el).val(byday.split(","));
                    able_to_parse = true;
                }
                break;
            case "MONTHLY":
                if (bymonthday && interval) { // Day X of the month, every Y months
                    $("input[name="+conf.classname_monthly_type+"]", el).val(['DAY_OF_MONTH']);
                    $("select[name="+conf.classname_monthly_dayofmonth_day+"]", el).val(bymonthday);
                    $("input[name="+conf.classname_monthly_dayofmonth_interval+"]", el).val(interval);
                    able_to_parse = true;
                }
                else if (byday && bysetpos && interval) {
                    $("select[name="+conf.classname_monthly_weekdayofmonth_index+"]", el).val(bysetpos);
                    $("input[name="+conf.classname_monthly_weekdayofmonth_interval+"]", el).val(interval);
                    if (byday === "MO,TU,WE,TH,FR") {
                        $("select[name="+conf.classname_monthly_weekdayofmonth+"]", el).val("WEEKDAY");
                        able_to_parse = true;
                    }
                    else if (byday === "SA,SU") {
                        $("select[name="+conf.classname_monthly_weekdayofmonth+"]", el).val("WEEKEND_DAY");
                        able_to_parse = true;
                    }
                }
                else if (byday && interval) { // The Nth X of the month, every Y months
                    $("input[name="+conf.classname_monthly_type+"]", el).val(['WEEKDAY_OF_MONTH']);
                    $("input[name="+conf.classname_monthly_weekdayofmonth_interval+"]", el).val(interval);
                    matches = /^(-?[0-9]+)([A-Z]{1,2}$)/.exec(byday); // we expect this to be -1TH
                    if (!matches || matches.length != 3) {
                        break; // don't understand the format
                    }
                    $("select[name="+conf.classname_monthly_weekdayofmonth_index+"]", el).val(matches[1]);
                    $("select[name="+conf.classname_monthly_weekdayofmonth+"]", el).val(matches[2]);
                    able_to_parse = true;
                }
                break;
            case "YEARLY":
                if (bymonth && bymonthday) { // Every [January] [1]
                    $("input[name="+conf.classname_yearly_type+"]", el).val(['DAY_OF_MONTH']);
                    $("select[name="+conf.classname_yearly_dayofmonth_month+"]", el).val(bymonth);
                    $("select[name="+conf.classname_yearly_dayofmonth_day+"]", el).val(bymonthday);
                    able_to_parse = true;
                }
                else if (byday && bysetpos && bymonth) {
                    $("select[name="+conf.classname_yearly_weekdayofmonth_months+"]", el).val(bymonth);
                    $("select[name="+conf.classname_yearly_weekdayofmonth_index+"]", el).val(bysetpos);
                    if (byday === "MO,TU,WE,TH,FR") {
                        $("select[name="+conf.classname_yearly_weekdayofmonth_day+"]", el).val("WEEKDAY");
                        able_to_parse = true;
                    }
                    else if (byday === "SA,SU") {
                        $("select[name="+conf.classname_yearly_weekdayofmonth_day+"]", el).val("WEEKEND_DAY");
                        able_to_parse = true;
                    }
                }
                else if (bymonth && byday) {
                    $("input[name="+conf.classname_yearly_type+"]", el).val(['WEEKDAY_OF_MONTH']);
                    $("select[name="+conf.classname_yearly_weekdayofmonth_months+"]", el).val(bymonth);
                    matches = /^(-?[0-9]+)([A-Z]{1,2})$/.exec(byday); // we expect this to be -1TH
                    if (matches && matches.length == 3) {
                        $("select[name="+conf.classname_yearly_weekdayofmonth_index+"]", el).val(matches[1]);
                        $("select[name="+conf.classname_yearly_weekdayofmonth_day+"]", el).val(matches[2]);
                        able_to_parse = true;
                    }
                }
                break;
        }

        if (!able_to_parse) {
            // TODO: Probably want to throw and exception here
            //alert("Cannot parse! " + data);
        }
    }

    /**
     * RecurrenceInput widget
         *  - hide textarea
         *  - build form with all actions/events
         *  - add checkbox repeat button (with action)
     */

    function RecurrenceInput (textarea, conf) {

        var self = this;
        var today = new Date()

        /**
         * By default all date input fields will point to today
         * if needed otherwise it should be possible to configure them
         */
        conf.dateDay = today.getDay();
        conf.dateMonth = today.getMonth();
        conf.dateYear = today.getFullYear();
        // TODO: calculate default date for each of date fields
        //       take date* as default value


        // hide textarea 
        //textarea.hide();
        
        // widget form
        var form = $(conf.template.form).tmpl(conf);
        form.hide().appendTo('body');
        form.find('ul.'+conf.classname_freq+' label').click(function() {
            var input = $(this).parent().find('input');
            input.click();
            input.change();
        });
        form.find('input[name='+conf.classname_freq+']').change(function(e) {
            form.find('div.'+conf.classname_freq_options+' > div').hide();
            parent_list = $(this).closest("ul");
            font_size = parent_list.css('font-size').replace('px', '').replace('em','');
            form.find('div.'+conf.classname_freq+'_' + $(this).val().toLowerCase())
                .css('margin-left', + (parent_list.width() + 2*font_size)).show();
        });
        form.find('input[class=dateinput_calendar]')
            .dateinput({
                value: new Date(conf.dateYear, conf.dateMonth, conf.dateDay),
                change: function() {
                    var value = this.getValue("yyyy-m-d").split("-");
                    this.getInput().parent().find('input=[name$=_year]').val(value[0]);
                    this.getInput().parent().find('select=[name$=_month]').val(value[1]);
                    this.getInput().parent().find('input=[name$=_day]').val(value[2]); },
                onClose: function () {
                    },
                selectors: true,
                trigger: true,
                yearRange: [-10, 10] })
            .unbind('change')
            .bind('onShow', function (event) {
                var trigger_offset = $(this).next().offset();
                $(this).data('dateinput').getCalendar().offset(
                    {top: trigger_offset.top+33, left: trigger_offset.left}
                    );
            });

        $('form', form).submit(function(e) {
                e.preventDefault();
                // TODO need to check "Save" was selected.

                // Write the rfc2445 code which has been set in the widget to the text area
                textarea.val(parse_rule(form));
                
                form.overlay().close();
            });

        // add checkbox repeat button (with action)
        var widget = $(conf.template.widget).tmpl(conf);
        widget.find('.'+conf.classname_form).hide();
        widget.find('label').click(function() {
            var input = $(this).parent().find('input');
            input.click();
            input.change();
        });
        widget.find('input[name='+conf.classname_activate+']')
                .change(function(e) {
                    var widget_label = widget.find('.'+conf.classname_activate+' > label');
                    var widget_form = widget.find('.'+conf.classname_form);

                    if ($(this).is(':checked')) {
                        // First parse rfc2445 from text area to form
                        var initial_data = textarea.val();
                        if (initial_data) {
                            load_from_rfc2445(form, initial_data, conf);
                        }

                        widget_label.hide();
                        if (widget_form) {
                            widget_form.show();
                        } else {
                            widget_form = widget.find('.'+conf.classname_form);
                        }

                        if (form.data().overlay) {
                            form.overlay().load();
                        } else {
                            form.overlay({
                                mask: {
                                    color: '#ebecff',
                                    loadSpeed: 'fast',
                                    closeSpeed: 'fast',
                                    opacity: 0.5,
                                    onClose: function (e) {
                                        widget_label.show();
                                        widget_form.hide();
                                        widget.find('input[name='+conf.classname_activate+']')
                                                .attr('checked', false);
                                    }
                                },
                                speed: 'fast',
                                load: true
                            });
                        }

                    } else {
                        widget_label.show();
                        widget_form.hide();
                    }
                });
       
        /*
         * Parsing RFC2554 from widget
         */

        // method for parsing rules (rrule and exrule)
        function parse_rule(el) {
            var str_ = '';
            frequency = el.find('input[name=recurrenceinput_freq]:checked').val();
            var result = "NO RULE FOUND"
            switch (frequency) {
            case "DAILY":
                result = parse_daily(el);
                break;
            case "WEEKLY":
                result = parse_weekly(el);
                break;
            case "MONTHLY":
                result = parse_monthly(el);
                break;
            case "YEARLY":
                result = parse_yearly(el);
                break;
            }
            
            return result
        }

        function parse_daily(el) {
            result = 'FREQ=DAILY'

            daily_type = $('input[name=recurrenceinput_daily_type]:checked', el).val();

            switch (daily_type) {
            case "DAILY":
                var interval = $('input[name=recurrenceinput_daily_interval]', el).val();
                result += ";INTERVAL=" + interval;
                break;
            case "WEEKDAYS":

                days = []
                $('input[name=recurrenceinput_daily_weekdays]:checked', el).each(function() {
                        days[days.length] = $(this).val();
                    });
                result = "FREQ=WEEKLY;BYDAY=" + days;
                break;
            }

            return result
        }

        function parse_weekly(el) {
            result = "FREQ=WEEKLY"

            interval = $('input[name=recurrenceinput_weekly_interval]', el).val();
            result += ";INTERVAL=" + interval

            days = []
            $('input[name=recurrenceinput_weekly_weekdays]:checked', el).each(function() {
                    days[days.length] = $(this).val();
                });

            if (days.length) {
                result += ";BYDAY=" + days
            }

            return result;
        }

        function parse_monthly(el) {
            result = "FREQ=MONTHLY";

            monthly_type = $('input[name=recurrenceinput_monthly_type]:checked', el).val();

            switch (monthly_type) {
            case "DAY_OF_MONTH":
                day = $("select[name=recurrenceinput_monthly_dayofmonth_day]", el).val();
                interval = $("input[name=recurrenceinput_monthly_dayofmonth_interval]", el).val();

                result += ";BYMONTHDAY=" + day;
                result += ";INTERVAL=" + interval;
                break;
            case "WEEKDAY_OF_MONTH":
                var index = $("select[name=recurrenceinput_monthly_weekdayofmonth_index]", el).val();
                var day = $("select[name=recurrenceinput_monthly_weekdayofmonth]", el).val();
                var interval = $("input[name=recurrenceinput_monthly_weekdayofmonth_interval]", el).val();

                if ($.inArray(day, ['MO','TU','WE','TH','FR','SA','SU']) > -1) {
                    result += ";BYDAY=" + index + day;
                }
                else if (day == "DAY") {
                    result += ";BYDAY=" + index;
                }
                else if (day == "WEEKDAY") {
                    result += ";BYDAY=MO,TU,WE,TH,FR;BYSETPOS=" + index;
                }
                else if (day == "WEEKEND_DAY") {
                    result += ";BYDAY=SA,SU;BYSETPOS=" + index;
                }

                result += ";INTERVAL=" + interval;
                break;
            }

            return result;
        }

        function parse_yearly(el) {
            result = "FREQ=YEARLY"

            yearly_type = $("input[name=recurrenceinput_yearly_type]:checked", el).val();
            
            switch (yearly_type) {
            case "DAY_OF_MONTH":
                var month = $("select[name=recurrenceinput_yearly_dayofmonth_month]", el).val();
                var day = $("select[name=recurrenceinput_yearly_dayofmonth_day]", el).val();

                result += ";BYMONTH=" + month;
                result += ";BYMONTHDAY=" + day;
                break;
            case "WEEKDAY_OF_MONTH":
                var index = $("select[name=recurrenceinput_yearly_weekdayofmonth_index]", el).val();
                var day = $("select[name=recurrenceinput_yearly_weekdayofmonth_day]", el).val();
                var month = $("select[name=recurrenceinput_yearly_weekdayofmonth_months]", el).val();

                result += ";BYMONTH=" + month;

                if ($.inArray(day, ['MO','TU','WE','TH','FR','SA','SU']) > -1) {
                    result += ";BYDAY=" + index + day;
                }
                else if (day == "DAY") {
                    result += ";BYDAY=" + index;
                }
                else if (day == "WEEKDAY") {
                    result += ";BYDAY=MO,TU,WE,TH,FR;BYSETPOS=" + index;
                }
                else if (day == "WEEKEND_DAY") {
                    result += ";BYDAY=SA,SU;BYSETPOS=" + index;
                }
                break;
            }

            return result;
        }


        // function for parsing dates (rdate and exdate)
        function parse_date(el) {
            var day = $("input[name=recurrenceinput_date_day]", el).val();
            var month = $("select[name=recurrenceinput_date_month]", el).val();
            var year = $("input[name=recurrenceinput_date_year]", el).val();

            f_day = parseInt(day) < 10 ? "0" + day : day;
            f_month = parseInt(month) < 10 ? "0" + month : month;

            var formatted = year + f_month + f_day;

            return formatted;
        }



        /*
         * Public API of RecurrenceInput
         */

        $.extend(self, {
            widget: widget,/*
            parse_rrule: function (el) { return 'RRULE:'+parse_rule(el) },
            parse_exrule: function (el) { return 'EXRULE:'+parse_rule(el) },
            parse_rdate: function (el) { return 'RDATE:'+parse_date(el) },
            parse_exdate: function (el) { return 'EXDATE:'+parse_date(el) },
            add_rule: function(rule_class, rule) { return add_rule(rule_class, rule) },
            add_date: function(date_class, rule) { return add_date(date_class, rule) },*/
        });

    }



    /*
     * jQuery plugin implementation
     */

    $.fn.recurrenceinput = function(conf) {

        // already installed
        if (this.data("recurrenceinput")) { return this; } 

        // apply this for every textarea we can match
        this.each(function() {
            if (this.tagName == 'TEXTAREA') {

                var textarea = $(this);
                var form = $(textarea.closest("form")[0]);
                var recurrenceinput = new RecurrenceInput(
                        textarea, $.extend(true, {}, default_conf, conf));

                // Populate data from existing relations
                if (textarea.val() != '') {
                    rules = textarea.val().split('\n');
                    for (i = 0; i < rules.length; i++) {
                        rule = rules[i];
                        if (rule.search("^RRULE") >= 0) {
                            recurrenceinput.add_rule('rrule', rule.substring(6));
                        }
                        else if (rule.search("^RDATE") >= 0) {
                            recurrenceinput.add_date('rdate', rule.substring(6));
                        }
                        else if (rule.search("^EXRULE") >= 0) {
                            recurrenceinput.add_rule('exrule', rule.substring(7));
                        }
                        else if (rule.search("^EXDATE") >= 0) {
                            recurrenceinput.add_date('exdate', rule.substring(7));
                        }
                    }
                }

                // on form submit we write to textarea
                form.submit(function(e) {
                    e.preventDefault();

                    // create string for rule widget
                    var ruleset_str = '';
                    var f = function(pf, el) {
                        ruleset_str += pf($(el)) + "\n";
                    }
                    var widgets = recurrenceinput.widget;
                    $('div.recurrenceinput-rrule li.rule', widgets).each( function() { 
                            f(recurrenceinput.parse_rrule, this) 
                        });
                    $('div.recurrenceinput-exrule li.rule', widgets).each(function() { 
                            f(recurrenceinput.parse_exrule, this) 
                        });
                    $('div.recurrenceinput-rdate li.rule', widgets).each( function() { 
                            f(recurrenceinput.parse_rdate, this)
                        });
                    $('div.recurrenceinput-exdate li.rule', widgets).each(function() {
                            f(recurrenceinput.parse_exdate, this)
                        })

                    // insert string generated form above to textarea
                    textarea.val(ruleset_str);

                    // remove widget
                    recurrenceinput.widget.remove();
                });

                // insert recurrance widget right after textarea 
                textarea.after(recurrenceinput.widget)
            };
        });
    };

})(jQuery);
