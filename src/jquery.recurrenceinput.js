/**
 * http://garbas.github.com/jquery.recurrenceinput.js
 *
 * Author: Rok Garbas <rok@garbas.si>
 * Since: Sep 2010
 * Date: XX-XX-XXXX
 */
(function($) {

    /**
     * TODO:
     *  - options for each freq
     *  - start date, end date and number of recurrences for each rule
     *  - add c.datetimewidget like widget with dateinput calendar 
     *  - reuse start date from other fields
     *
     */
    var default_conf = {
        'widget-tmpl': '#jquery-recurrenceinput-widget-tmpl',
        'rule-tmpl': '#jquery-recurrenceinput-rule-tmpl',
        'date-tmpl': '#jquery-recurrenceinput-date-tmpl'
    };

    // private

    function Recurrenceinput (textarea, conf) {

        var self = this;
        var widget = $(conf['widget-tmpl']).tmpl();

        /*
         * Initial steps to activate widget
         */

        // add actions to widget buttons
        widget.find('p.button > a')
            .unbind('click')
            .click(function (e) {
                e.preventDefault();

                var class_name = $(this).attr('class');
                if (class_name == 'button-add-rrule') { add_rule('rrule') }
                else if (class_name == 'button-add-exrule') { add_rule('exrule') }
                else if (class_name == 'button-add-rdate') { add_date('rdate') }
                else if (class_name == 'button-add-exdate') { add_date('exdate') }
            });


        function add_date(date_class, data) {

            // 2010-02-01
            dateDay = '1'
            dateMonth = '2'
            dateYear = '2010'

            var rule = $(conf['date-tmpl']).tmpl(
                { 'months': 'Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec'.split('|'),
                  'dateDay': dateDay, 'dateMonth': dateMonth, 'dateYear': dateYear })
            rule.addClass(date_class);

            // remove rule action
            $('a.remove', rule).unbind("click").click(function () {
                $(this).closest("li.rule").slideUp("fast", function() { $(this).remove() });
            });

            // activate dateinput calendar
            rule.find('input[name=date-calendar]')
                    .dateinput({
                        value: new Date(dateYear, dateMonth, dateDay),
                        change: function() {
                            var value = this.getValue("yyyy-mm-dd").split("-");
                            rule.find('input[name=date-year]').val(value[0]);
                            rule.find('input[name=date-month]').val(value[1]);
                            rule.find('input[name=date-day]').val(value[2]); },
                        selectors: true,
                        trigger: true,
                        yearRange: [-10, 10] })
                    .unbind('change')
                    .bind('onShow', function (event) {
                        var trigger_offset = $(this).next().offset();
                        $(this).data('dateinput').getCalendar().offset(
                            {top: trigger_offset.top+20, left: trigger_offset.left}
                        );
                    })

            // append rule to ruleset
            rule.hide();
            $('.recurrenceinput-' + date_class + " ul.ruleset", widget).append(rule);
            rule.slideDown("fast");
        }


        function add_rule(rule_class, data) {
            var rule = $("#jquery-recurrenceinput-rule-tmpl" ).tmpl();
            rule.addClass(rule_class);

            // hide options for frequencies
            $('.freq-options > div', rule).hide();

            // make label of freq option active for selection
            rule.find('.freq label').unbind("click").click(function () {
                var input = $(this).parent().find('input[name=freq]');
                input.click(); 
                input.change();
            });

            // select 
            rule.find('.freq input[name=freq]').removeClass("active");
            rule.find('.freq input[name=freq]').unbind("change").change(function() {
                var el = $(this);
                
                rule.find('.freq input[name=freq]').removeClass("active");
                rule.find('.freq-options > div').hide();

                el.addClass('active');

                parent_list = el.closest("ul");
                font_size = parent_list.css('font-size').replace('px', '').replace('em','');

                rule.find('.freq-options div.' + el.val().toLowerCase())
                        .css('margin-left', + (parent_list.width() + 2*font_size))
                        .show();
            });

            // remove rule action
            rule.find('a.remove').unbind("click").click(function () {
                    $(this).closest("li.rule").slideUp("fast", function() { $(this).remove() });
            });

            // append rrule to ruleset
            rule.hide();
            $('.recurrenceinput-' + rule_class + " ul.ruleset", widget).append(rule);
            rule.slideDown("fast");
        }



        /*
         * Parsing RFC2554 from widget
         */

        // method for parsing rules (rrule and exrule)
        function parse_rule(el) {
            var str_ = '';
            frequency = el.find('input.freq.active').val();
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

            daily_type = $('input[name=recurrence_daily_type]:checked', el).val();

            switch (daily_type) {
            case "DAILY":
                interval = $('input[name=recurrence_daily_interval]', el).val();
                result += ";INTERVAL=" + interval;
                break;
            case "WEEKDAYS":
                result = "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR"
                break;
            }

            return result
        }

        function parse_weekly(el) {
            result = "FREQ=WEEKLY"

            interval = $('input[name=recurrence_weekly_interval_number]', el).val();
            result += ";INTERVAL=" + interval

            days = []
            $('input[name^=recurrence_weekly_days_]:checked', el).each(function() {
                    days[days.length] = $(this).val();
                });

            if (days.length) {
                result += ";BYDAY=" + days
            }

            return result;
        }

        function parse_monthly(el) {
            result = "FREQ=MONTHLY";

            monthly_type = $('input[name=recurrence_monthly_type]:checked', el).val();

            switch (monthly_type) {
            case "dayofmonth":
                day = $("select[name=recurrence_monthly_dayofmonth_day]", el).val();
                interval = $("input[name=recurrence_monthly_dayofmonth_interval]", el).val();

                result += ";BYMONTHDAY=" + day;
                result += ";INTERVAL=" + interval;
                break;
            case "dayofweek":
                var index = $("select[name=recurrence_monthly_dayofweek_index]", el).val();
                var day = $("select[name=recurrence_monthly_dayofweek_day]", el).val();
                var interval = $("input[name=recurrence_monthly_dayofweek_interval]", el).val();

                if ($.inArray(day, ['MO','TU','WE','TH','FR','SA','SU']) > -1) {
                    result += ";BYDAY=" + index + day;
                }
                else if (day == "DAY") {
                    result += ";BYDAY=" + index;
                }
                else if (day == "WEEKDAY") {
                    alert("Cannot see how to support WEEKDAY in RFC2445");
                }
                else if (day == "WEEKEND_DAY") {
                    alert("Cannot see how to support WEEKEND_DAY in RFC2445");
                }

                result += ";INTERVAL=" + interval;
                break;
            }

            return result;
        }

        function parse_yearly(el) {
            result = "FREQ=YEARLY"

            yearly_type = $("input[name=recurrence_yearly_type]:checked", el).val();
            
            switch (yearly_type) {
            case "dayofmonth":
                var month = $("select[name=recurrence_yearly_dayofmonth_month]", el).val();
                var day = $("select[name=recurrence_yearly_dayofmonth_day]", el).val();

                result += ";BYMONTH=" + month;
                result += ";BYMONTHDAY=" + day;
                break;
            case "dayofweek":
                var index = $("select[name=recurrence_yearly_dayofweek_index]", el).val();
                var day = $("select[name=recurrence_yearly_dayofweek_day]", el).val();
                var month = $("select[name=recurrence_yearly_dayofweek_month]", el).val();

                result += ";BYMONTH=" + month;

                if ($.inArray(day, ['MO','TU','WE','TH','FR','SA','SU']) > -1) {
                    result += ";BYDAY=" + index + day;
                }
                else if (day == "DAY") {
                    result += ";BYDAY=" + index;
                }
                else if (day == "WEEKDAY") {
                    alert("Cannot see how to support WEEKDAY in RFC2445");
                }
                else if (day == "WEEKEND_DAY") {
                    alert("Cannot see how to support WEEKEND_DAY in RFC2445");
                }
                break;
            }

            return result;
        }


        // function for parsing dates (rdate and exdate)
        function parse_date(el) {
            var day = $("input[name=recurrence_date_day]", el).val();
            var month = $("select[name=recurrence_date_month]", el).val();
            var year = $("input[name=recurrence_date_year]", el).val();

            f_day = parseInt(day) < 10 ? "0" + day : day;
            f_month = parseInt(month) < 10 ? "0" + month : month;

            var formatted = year + f_month + f_day;

            return formatted;
        }



        /*
         * Public API of Recurrenceinput
         */

        $.extend(self, {
            widget: widget,
            initial_structure: function () { add_rule('rrule') },
            parse_rrule: function (el) { return 'RRULE:'+parse_rule(el) },
            parse_exrule: function (el) { return 'EXRULE:'+parse_rule(el) },
            parse_rdate: function (el) { return 'RDATE:'+parse_date(el) },
            parse_exdate: function (el) { return 'EXDATE:'+parse_date(el) }
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
                var form = textarea.closest("form");
                var recurrenceinput = new Recurrenceinput(
                    textarea, 
                    $.extend(true, {}, default_conf, conf));

                //textarea.hide();

                // initialize widget
                if (textarea.val() == '') {
                    recurrenceinput.initial_structure();
                } else {
                    // TODO: populate data from existing relations
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
                    //recurrenceinput.widget.remove();
                });

                // insert recurrance widget right after textarea 
                textarea.after(recurrenceinput.widget)
            };
        });
    };

})(jQuery);
