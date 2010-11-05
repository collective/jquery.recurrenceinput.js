
// TODO: DRY!!! ARG...
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

    classname_monthly_type: 'monthly_type',
    classname_monthly_dayofmonth_day: 'monthly_dayofmonth_day',
    classname_monthly_dayofmonth_interval: 'monthly_dayofmonth_interval',
    classname_monthly_weekdayofmonth_index: 'monthly_weekdayofmonth_index',
    classname_monthly_weekdayofmonth: 'monthly_weekdayofmonth',
    classname_monthly_weekdayofmonth_interval: 'monthly_weekdayofmonth_interval',

    classname_yearly_type: 'yearly_type',
    classname_yearly_dayofmonth_month: 'yearly_dayofmonth_month',
    classname_yearly_dayofmonth_day: 'yearly_dayofmonth_day',
    classname_yearly_weekdayofweek_index: 'yearly_weekdayofmonth_index',
    classname_yearly_weekdayofweek_day: 'yearly_weekdayofmonth_day',
    classname_yearly_weekdayofweek_months: 'yearly_weekdayofmonth_month',

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

        equal(
            $("input[name=recurrenceinput_daily_type]", el).val(), "DAILY", 
            "Set to 'every X days'");
        ok(
            $("input[name=recurrenceinput_daily_interval]", el).val(), "17",
            "Interval set to 17");

        //ok(
            //$(".recurrenceinput_daily_interval:visible", el).length === 1,
            //"Daily options div visible");

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

        equal(
            days.length, expected.length,
            "Right number of days for weekdays selected");

        same(days, expected, "Days are as expected");

        equal(
            $("input[name=recurrenceinput_weekly_interval]", el).val(), "3",
            "Interval set to 3");

        //ok(
            //$(".recurrenceinput_weekly_interval:visible", el).length === 1,
            //"Weekly options div visible");

    });

test('rfc2445 WEEKLY weekends every 12 weeks', function() {
        el = rule_el();
        widget_load_from_rfc2445(el, 'FREQ=WEEKLY;BYDAY=SA,SU;INTERVAL=12');
        ok(is_active_freq(el, "WEEKLY"), "Weekly options should be active");

        days = []
        $('input[name=recurrenceinput_weekly_weekdays]:checked', el).each(function() {
                days[days.length] = $(this).val();
            });
        expected = ["SA","SU"];

        equal(
            days.length, expected.length,
            "Right number of days for weekdays selected");

        same(days, expected, "Days are as expected");

        equal(
            $("input[name=recurrenceinput_weekly_interval]", el).val(), "12",
            "Interval set to 12");

        //ok(
            //$(".recurrenceinput_weekly_interval:visible", el).length === 1,
            //"Weekly options div visible");
    });

test('rfc2445 MONTHLY on the third day of each month', function(){
        el = rule_el();
        widget_load_from_rfc2445(el, "FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=3");
        ok(is_active_freq(el, "MONTHLY"), "Monthly options should be active");

        equal(
            $("input[name=recurrenceinput_monthly_type]", el).val(), "DAY_OF_MONTH", 
            "Set to 'the X day every Y months'");
        equal(
            $("select[name=recurrenceinput_monthly_dayofmonth_day]", el).val(), "3",
            "Day of month is 3");
        equal(
            $("input[name=recurrenceinput_monthly_dayofmonth_interval]", el).val(), "1",
            "Repeat every month");

        //ok(
            //$(".recurrenceinput_freq_monthly:visible", el).length === 1,
            //"Monthly options div visible");
    });

test('rfc2445 MONTHLY on the twelth day of every twenty-fifth month', function(){
        el = rule_el();
        widget_load_from_rfc2445(el, "FREQ=MONTHLY;INTERVAL=25;BYMONTHDAY=12");
        ok(is_active_freq(el, "MONTHLY"), "Monthly options should be active");

        equal(
            $("input[name=recurrenceinput_monthly_type]", el).val(), "DAY_OF_MONTH", 
            "Set to 'the X day every Y months'");
        equal(
            $("select[name=recurrenceinput_monthly_dayofmonth_day]", el).val(), "12",
            "Day of month is 12");
        equal(
            $("input[name=recurrenceinput_monthly_dayofmonth_interval]", el).val(), "25",
            "Repeat every 25 months");

        //ok(
            //$(".recurrenceinput_freq_monthly:visible", el).length === 1,
            //"Monthly options div visible");
    });

test('rfc2445 MONTHLY on the last Friday of every 12 months', function(){
        el = rule_el();
        widget_load_from_rfc2445(el, "FREQ=MONTHLY;BYDAY=-1FR;INTERVAL=12");
        ok(is_active_freq(el, "MONTHLY"), "Monthly options should be active");

        equal(
            $("input[name=recurrenceinput_monthly_type]", el).val(), "WEEKDAY_OF_MONTH", 
            "Set to 'the X day every Y months'");

        equal(
            $("select[name=recurrenceinput_monthly_weekdayofmonth_index]", el).val(), "-1",
            "Weekday index");
        equal(
            $("select[name=recurrenceinput_monthly_weekdayofmonth]", el).val(), "FR",
            "Weekday of the month");
        equal(
            $("input[name=recurrenceinput_monthly_weekdayofmonth_interval]", el).val(), "12",
            "Every X months");

        //ok(
            //$(".recurrenceinput_freq_monthly:visible", el).length === 1,
            //"Monthly options div visible");
    });

test('rfc2445 MONTHLY on the second weekday of every 12th month', function(){
        el = rule_el();
        widget_load_from_rfc2445(el, 
            "FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=2;INTERVAL=12");
        equal(
            $("select[name=recurrenceinput_monthly_weekdayofmonth]", el).val(), 
            "WEEKDAY",
            "Weekday of the month");
    });

test('rfc2445 MONTHLY on the last weekend-day of every 12th month', function(){
        el = rule_el();
        widget_load_from_rfc2445(el, "FREQ=MONTHLY;BYDAY=SA,SU;BYSETPOS=-1;INTERVAL=12");
        equal(
            $("select[name=recurrenceinput_monthly_weekdayofmonth]", el).val(), 
            "WEEKEND_DAY",
            "Weekday of the month");
    });


/***
 * YEARLY
 */

test('rfc2445 YEARLY on the fifteenth day of March each year', function(){
        el = rule_el();
        widget_load_from_rfc2445(el, "FREQ=YEARLY;BYMONTH=3;BYMONTHDAY=15");
        ok(is_active_freq(el, "YEARLY"), "Yearly options should be active");

        equal(
            $("input[name=recurrenceinput_yearly_type]", el).val(), "DAY_OF_MONTH", 
            "Set to 'the Xth of Y every year'");
        equal(
            $("select[name=recurrenceinput_yearly_dayofmonth_day]", el).val(), "15",
            "Day of month is 15");
        equal(
            $("select[name=recurrenceinput_yearly_dayofmonth_month]", el).val(), "3",
            "Repeat in March");

        //ok(
            //$(".recurrenceinput_freq_yearly:visible", el).length === 1,
            //"Yearly options div visible");
    });

test('rfc2445 YEARLY on the fourth Tuesday of May', function(){
        el = rule_el();
        widget_load_from_rfc2445(el, "FREQ=YEARLY;BYMONTH=5;BYDAY=4TU");
        ok(is_active_freq(el, "YEARLY"), "Yearly options should be active");

        equal(
            $("input[name=recurrenceinput_yearly_type]", el).val(), "WEEKDAY_OF_MONTH", 
            "Set to 'the X day every Y months'");
        equal(
            $("select[name=recurrenceinput_yearly_weekdayofmonth_index]", el).val(), "4",
            "4th occurence");
        equal(
            $("select[name=recurrenceinput_yearly_weekdayofmonth_day]", el).val(), "TU",
            "On Tuesday");
        equal(
            $("select[name=recurrenceinput_yearly_weekdayofmonth_month]", el).val(), "5",
            "Of May");

        //ok(
            //$(".recurrenceinput_freq_yearly:visible", el).length === 1,
            //"Yearly options div visible");
    });

test('rfc2445 YEARLY on the last Wednesday of December', function(){
        el = rule_el();
        widget_load_from_rfc2445(el, "FREQ=YEARLY;BYMONTH=12;BYDAY=-1WE");
        ok(is_active_freq(el, "YEARLY"), "Yearly options should be active");

        equal(
            $("input[name=recurrenceinput_yearly_type]", el).val(), "WEEKDAY_OF_MONTH", 
            "Set to 'the X day every Y months'");

        equal(
            $("select[name=recurrenceinput_yearly_weekdayofmonth_index]", el).val(), "-1",
            "Weekday index");
        equal(
            $("select[name=recurrenceinput_yearly_weekdayofmonth_day]", el).val(), "WE",
            "Weekday of the month");
        equal(
            $("select[name=recurrenceinput_yearly_weekdayofmonth_month]", el).val(), "12",
            "Every December");

        //ok(
            //$(".recurrenceinput_freq_yearly:visible", el).length === 1,
            //"Yearly options div visible");
    });

test('rfc2445 YEARLY on the last weekday of March', function(){
        el = rule_el();
        widget_load_from_rfc2445(el, 
            "FREQ=YEARLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-1;BYMONTH=3");
        equal(
            $("select[name=recurrenceinput_yearly_weekdayofmonth_day]", el).val(), 
            "WEEKDAY",
            "Weekday of the month");
    });

test('rfc2445 YEARLY on the last weekend-day of June', function(){
        el = rule_el();
        widget_load_from_rfc2445(el, "FREQ=YEARLY;BYMONTH=3;BYDAY=SA,SU;BYSETPOS=-1");
        equal(
            $("select[name=recurrenceinput_yearly_weekdayofmonth_day]", el).val(), 
            "WEEKEND_DAY",
            "Weekday of the month");
    });



