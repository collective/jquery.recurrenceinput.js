
function widget_load_from_rfc2445(el, initial_data) {
    // At this point, el is a fully constructed rule div 
    // what's the frequency?
    var matches = /^FREQ=(DAILY|WEEKLY|MONTHLY|YEARLY)/.exec(initial_data);
    var frequency = matches[1];
    var able_to_parse = false;

    interval = null;
    matches = /INTERVAL=([0-9]+);?/.exec(initial_data);
    if (matches) {
        interval = matches[1];
    }

    byday = null;
    matches = /BYDAY=([^;]+);?/.exec(initial_data);
    if (matches) {
        byday = matches[1];
    }

    bymonthday = null;
    matches = /BYMONTHDAY=([^;]+);?/.exec(initial_data);
    if (matches) {
        bymonthday = matches[1].split(",");
    }

    bymonth = null;
    matches = /BYMONTH=([^;]+);?/.exec(initial_data);
    if (matches) {
        bymonth = matches[1].split(",");
    }

    bysetpos = null;
    matches = /BYSETPOS=([^;]+);?/.exec(initial_data);
    if (matches) {
        bysetpos = matches[1];
    }

    switch (frequency) {
    case "DAILY":
    case "WEEKLY":
    case "MONTHLY":
    case "YEARLY":
        $("input[name=recurrenceinput_freq]", el).val([frequency]);
        $("input[value="+frequency+"]", el).change();
        break;
    }

    switch (frequency) {
    case "DAILY":
        if (interval) {
            $("input[name=recurrenceinput_daily_type]", el).val(["DAILY"]);
            $("input[name=recurrenceinput_daily_interval]", el).val(interval);
            able_to_parse = true;
        }
        break;
    case "WEEKLY":
        if (interval) {
            $("input[name=recurrenceinput_weekly_interval]", el).val(interval);
            able_to_parse = true;
        }
        else {
            $("input[name=recurrenceinput_weekly_interval]", el).val("1");
        }
        if (byday) { 
            // TODO: if this is weekdays and interval=null, select DAILY#weekdays?
            $('input[name=recurrenceinput_weekly_weekdays]', el).val(byday.split(","));
            able_to_parse = true;
        }
        break;
    case "MONTHLY":
        if (bymonthday && interval) { // Day X of the month, every Y months
            $("input[name=recurrenceinput_monthly_type]", el).val(['DAY_OF_MONTH']);
            $("select[name=recurrenceinput_monthly_dayofmonth_day]", el).val(bymonthday);
            $("input[name=recurrenceinput_monthly_dayofmonth_interval]", el).val(interval);
            able_to_parse = true;
        }
        else if (byday && bysetpos && interval) {
            $("select[name=recurrenceinput_monthly_weekdayofmonth_index]", el).val(bysetpos);
            $("input[name=recurrenceinput_monthly_weekdayofmonth_interval]", el).val(interval);
            if (byday === "MO,TU,WE,TH,FR") {
                $("select[name=recurrenceinput_monthly_weekdayofmonth]", el).val("WEEKDAY");
                able_to_parse = true;
            }
            else if (byday === "SA,SU") {
                $("select[name=recurrenceinput_monthly_weekdayofmonth]", el).val("WEEKEND_DAY");
                able_to_parse = true;
            }
        }
        else if (byday && interval) { // The Nth X of the month, every Y months
            $("input[name=recurrenceinput_monthly_type]", el).val(['WEEKDAY_OF_MONTH']);
            $("input[name=recurrenceinput_monthly_weekdayofmonth_interval]", el).val(interval);
            matches = /^(-?[0-9]+)([A-Z]{1,2}$)/.exec(byday); // we expect this to be -1TH
            if (!matches || matches.length != 3) {
                break; // don't understand the format
            }
            $("select[name=recurrenceinput_monthly_weekdayofmonth_index]", el).val(matches[1]);
            $("select[name=recurrenceinput_monthly_weekdayofmonth]", el).val(matches[2]);

            able_to_parse = true;
        }
        break;
    case "YEARLY":
        if (bymonth && bymonthday) { // Every [January] [1]
            $("input[name=recurrenceinput_yearly_type]", el).val(['DAY_OF_MONTH']);
            $("select[name=recurrenceinput_yearly_dayofmonth_month]", el).val(bymonth);
            $("select[name=recurrenceinput_yearly_dayofmonth_day]", el).val(bymonthday);

            able_to_parse = true;
        }
        else if (byday && bysetpos && bymonth) {
            $("select[name=recurrenceinput_yearly_weekdayofmonth_months]", el).val(bymonth);
                $("select[name=recurrenceinput_yearly_weekdayofmonth_index]", el).val(bysetpos);
            if (byday === "MO,TU,WE,TH,FR") {
                $("select[name=recurrenceinput_yearly_weekdayofmonth_day]", el).val("WEEKDAY");
                able_to_parse = true;
            }
            else if (byday === "SA,SU") {
                $("select[name=recurrenceinput_yearly_weekdayofmonth_day]", el).val("WEEKEND_DAY");
                able_to_parse = true;
            }
        }
        else if (bymonth && byday) {
            $("input[name=recurrenceinput_yearly_type]", el).val(['WEEKDAY_OF_MONTH']);
            $("select[name=recurrenceinput_yearly_weekdayofmonth_months]", el).val(bymonth);
            matches = /^(-?[0-9]+)([A-Z]{1,2})$/.exec(byday); // we expect this to be -1TH
            if (matches && matches.length == 3) {
                $("select[name=recurrenceinput_yearly_weekdayofmonth_index]", el).val(matches[1]);
                $("select[name=recurrenceinput_yearly_weekdayofmonth_day]", el).val(matches[2]);
                able_to_parse = true;
            }
        }
        break;
    }

    if (!able_to_parse) {
        // TODO: Probably want to throw and exception here
        //alert("Cannot parse! " + initial_data);
    }
}


/**
 * Parsing RFC2554 from widget
 */
function widget_save_to_rfc2445(el, conf) {
    var result = '';
    var frequency = $('input[name='+conf.field.freq_name+']:checked', el).val();
    switch (frequency) {
        case 'DAILY':
            result = 'FREQ=DAILY';
            result += ';INTERVAL=' + $('input[name='+conf.field.daily_interval_name+']', el).val();;
            break;
        case 'WEEKLY':
            result = 'FREQ=WEEKLY';
            result += ';INTERVAL=' + $('input[name='+conf.field.weekly_interval_name+']', el).val();
            days = [];
            $('input[name='+conf.field.weekly_weekdays_name+']:checked', el).each(function() {
                days[days.length] = $(this).val();
            });
            if (days.length) {
                result += ';BYDAY=' + days;
            }
            break;
        case 'MONTHLY':
            result = 'FREQ=MONTHLY';
            monthly_type = $('input[name='+conf.field.monthly_type_name+']:checked', el).val();
            switch (monthly_type) {
                case 'DAY_OF_MONTH':
                    day = $('select[name='+conf.field.monthly_dayofmonth_day_name+']', el).val();
                    interval = $('input[name='+conf.field.monthly_dayofmonth_interval_name+']', el).val();
                    result += ';BYMONTHDAY=' + day;
                    result += ';INTERVAL=' + interval;
                    break;
                case 'WEEKDAY_OF_MONTH':
                    var index = $('select[name='+conf.field.monthly_weekdayofmonth_index_name+']', el).val();
                    var day = $('select[name='+conf.field.monthly_weekdayofmonth_name+']', el).val();
                    var interval = $('input[name='+conf.field.monthly_weekdayofmonth_interval_name+']', el).val();
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
            yearly_type = $('input[name='+conf.field.yearly_type_name+']:checked', el).val();
            switch (yearly_type) {
                case 'DAY_OF_MONTH':
                    var month = $('select[name='+conf.field.yearly_dayofmonth_month_name+']', el).val();
                    var day = $('select[name='+conf.field.yearly_dayofmonth_day_name+']', el).val();
                    result += ';BYMONTH=' + month;
                    result += ';BYMONTHDAY=' + day;
                    break;
                case 'WEEKDAY_OF_MONTH':
                    var index = $('select[name='+conf.field.yearly_weekdayofmonth_index_name+']', el).val();
                    var day = $('select[name='+conf.field.yearly_weekdayofmonth_day_name+']', el).val();
                    var month = $('select[name='+conf.field.yearly_weekdayofmonth_months_name+']', el).val();
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

    var range_type = $('input[name='+conf.field.range_type_name+']:checked', el).val();
    switch (range_type) {
        case 'BY_OCURRENCES':
            result += ';COUNT=' + $('input[name='+conf.field.range_by_ocurrences_name+']').val();
            break;
        case 'BY_END_DATE':
            var year = $('input[name='+conf.field.range_name+'_year]').val();
            var month = $('select[name='+conf.field.range_name+'_month]').val();
            var day = $('input[name='+conf.field.range_name+'_day]').val();
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
