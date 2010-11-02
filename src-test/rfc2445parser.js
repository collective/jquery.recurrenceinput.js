
    var default_conf = {
        classname: 'recurrenceinput_',
        classname_activate: 'activate',
        classname_form: 'form',
        classname_freq: 'freq',

        classname_freq_options: 'freq_options',
        classname_freq_daily: 'freq_daily',
        classname_freq_weekly: 'freq_weekly',
        classname_freq_monthly: 'freq_monthly',
        classname_freq_yearly: 'freq_yearly',

        classname_daily_type: 'daily_type',
        classname_daily_interval: 'daily_interval',
        classname_daily_weekdays: 'daily_weekdays',

        classname_weekly_interval: 'weekly_interval',
        classname_weekly_weekdays: 'weekly_weekdays',

        classname_monthly_type: 'monthly_type:',
        classname_monthly_dayofmonth_day: 'monthly_dayofmonth_day',
        classname_monthly_dayofmonth_interval: 'monthly_dayofmonth_interval',
        classname_monthly_weekdayofmonth_index: 'monthly_weekdayofmonth_index',
        classname_monthly_weekdayofmonth: 'monthly_weekdayofmonth',
        classname_monthly_weekdayofmonth_interval: 'monthly_weekdayofmonth_interval',

        classname_yearly_type: 'yearly_type:',
        classname_yearly_dayofmonth_month: 'yearly_dayofmonth_month:',
        classname_yearly_dayofmonth_day: 'yearly_dayofmonth_day:',
        classname_yearly_weekdayofweek_index: 'yearly_weekdayofweek_index',
        classname_yearly_weekdayofweek_day: 'yearly_weekdayofweek_day',
        classname_yearly_weekdayofweek_months: 'yearly_weekdayofweek_months',

        classname_range: 'range',
        classname_range_start: 'range_start',
        classname_range_end: 'range_end',
        classname_range_end_type: 'range_end_type',
        classname_range_end_by_ocurrences: 'range_end_by_ocurrences',
        classname_range_end_by_end_date: 'range_end_by_end_date',

        classname_z3cform_dateinput: 'z3cform_dateinput',

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

// First we need a function to make a rule element from the template, 
// which we can use for testing
function rule_el() {
    conf = default_conf;

    var today = new Date();
    conf.dateDay = today.getDate();
    conf.dateMonth = today.getMonth();
    conf.dateYear = today.getFullYear();
    
    var rule = $(conf.template.form).tmpl(conf);
    rule.addClass("rrule");

    return rule;
}

// Sanity check qunit setup

// Let's test this function  
function isEven(val) {  
    return val % 2 === 0;  
}  
  
test('isEven()', function() { 
        ok(isEven(0), 'Zero is an even number'); 
        ok(isEven(2), 'So is two'); 
        ok(isEven(-4), 'So is negative four'); 
        ok(!isEven(1), 'One is not an even number'); 
        ok(!isEven(-7), 'Neither is negative seven');  
    }); 

// Now move onto our tests.

function is_active_freq(el, frequency) {
    return $("input[name=recurrenceinput_freq]", el).val() === "DAILY";
}


test('rfc2445 DAILY', function() {
        el = rule_el();
        ok(el, "We created the rule element successfully!");

        widget_load_from_rfc2445(el, "FREQ=DAILY;INTERVAL=17");
        ok(is_active_freq(el, "DAILY"), "Daily options should be active");

        ok(
            $("input[name=recurrenceinput_daily_type]", el).val() === "DAILY", 
            "Set to 'every X days'");
        ok(
            $("input[name=recurrenceinput_daily_interval]", el).val() === "17",
            "Interval set to 17");

        ok(
            $(".recurrenceinput_daily_interval:visible", el).length === 1,
            "Daily options div visible");

    });

test('rfc2445 WEEKLY weekdays every 3 weeks', function() {
        el = rule_el();

        widget_load_from_rfc2445(el, "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=3");
        ok(is_active_freq(el, "WEEKLY"), "Weekly options should be active");

        days = []
        $('input[name=recurrenceinput_weekly_weekdays]:checked', el).each(function() {
                days[days.length] = $(this).val();
            });
        expected = ["MO","TU","WE","TH","FR"];

        ok(
            days.length === expected.length,
            "Right number of days for weekdays selected");

        jQuery.each(expected, function(index, value) {
                ok(jQuery.inArray(value, days) >= 0, value + " in array");
            });

        ok(
            $("input[name=recurrenceinput_weekly_interval]", el).val() === "3",
            "Interval set to 3");

        ok(
            $(".recurrenceinput_weekly_interval:visible", el).length === 1,
            "Weekly options div visible");

    });

