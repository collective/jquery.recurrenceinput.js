
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
            $("select[name=recurrenceinput_monthly_day_of_month_day]", el).val(bymonthday);
            $("input[name=recurrenceinput_monthly_day_of_month_interval]", el).val(interval);
            able_to_parse = true;
        }
        else if (byday && bysetpos && interval) {
            $("select[name=recurrenceinput_monthly_weekday_of_month_index]", el).val(bysetpos);
            $("input[name=recurrenceinput_monthly_weekday_of_month_interval]", el).val(interval);
            if (byday === "MO,TU,WE,TH,FR") {
                $("select[name=recurrenceinput_monthly_weekday_of_month]", el).val("WEEKDAY");
                able_to_parse = true;
            }
            else if (byday === "SA,SU") {
                $("select[name=recurrenceinput_monthly_weekday_of_month]", el).val("WEEKEND_DAY");
                able_to_parse = true;
            }
        }
        else if (byday && interval) { // The Nth X of the month, every Y months
            $("input[name=recurrenceinput_monthly_type]", el).val(['WEEKDAY_OF_MONTH']);
            $("input[name=recurrenceinput_monthly_weekday_of_month_interval]", el).val(interval);
            matches = /^(-?[0-9]+)([A-Z]{1,2}$)/.exec(byday); // we expect this to be -1TH
            if (!matches || matches.length != 3) {
                break; // don't understand the format
            }
            $("select[name=recurrenceinput_monthly_weekday_of_month_index]", el).val(matches[1]);
            $("select[name=recurrenceinput_monthly_weekday_of_month]", el).val(matches[2]);

            able_to_parse = true;
        }
        break;
    case "YEARLY":
        if (bymonth && bymonthday) { // Every [January] [1]
            $("input[name=recurrenceinput_yearly_type]", el).val(['DAY_OF_MONTH']);
            $("select[name=recurrenceinput_yearly_day_of_month_month]", el).val(bymonth);
            $("select[name=recurrenceinput_yearly_day_of_month_day]", el).val(bymonthday);

            able_to_parse = true;
        }
        else if (byday && bysetpos && bymonth) {
            $("select[name=recurrenceinput_yearly_weekday_of_month_months]", el).val(bymonth);
                $("select[name=recurrenceinput_yearly_weekday_of_month_index]", el).val(bysetpos);
            if (byday === "MO,TU,WE,TH,FR") {
                $("select[name=recurrenceinput_yearly_weekday_of_month_day]", el).val("WEEKDAY");
                able_to_parse = true;
            }
            else if (byday === "SA,SU") {
                $("select[name=recurrenceinput_yearly_weekday_of_month_day]", el).val("WEEKEND_DAY");
                able_to_parse = true;
            }
        }
        else if (bymonth && byday) {
            $("input[name=recurrenceinput_yearly_type]", el).val(['WEEKDAY_OF_MONTH']);
            $("select[name=recurrenceinput_yearly_weekday_of_month_months]", el).val(bymonth);
            matches = /^(-?[0-9]+)([A-Z]{1,2})$/.exec(byday); // we expect this to be -1TH
            if (matches && matches.length == 3) {
                $("select[name=recurrenceinput_yearly_weekday_of_month_index]", el).val(matches[1]);
                $("select[name=recurrenceinput_yearly_weekday_of_month_day]", el).val(matches[2]);
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
function widget_save_to_rfc2445(form, conf) {
    var result = '';
    selector = form.find('select[name='+conf.field.rtemplate_name+']').val();
    rtemplate = conf.rtemplate[value];
    result = rtemplate.rrule;
    
    for (i in rtemplate.fields) {
        field = form.find('#'+rtemplate.fields[i]);
        
        switch (field.attr('id')) {
        
            case conf.field.daily_interval_name:
                // TODO: Assert that this is a number.
                input = field.find('input[name='+conf.field.daily_interval_name+']')
                result += ';INTERVAL=' + input.val();
                break;
                
            case conf.field.weekly_interval_name:
                // TODO: Assert that this is a number.
                input = field.find('input[name='+conf.field.weekly_interval_name+']')
                result += ';INTERVAL=' + input.val();
                break;
                
            case conf.field.weekly_weekdays_name:
                weekdays = ''
                for (i in conf.i18n.weekdays) {
                    input = field.find('input[name='+conf.field.weekly_weekdays_name+'_'+conf.weekdays[i]+']');
                    if (input.is(':checked')) {
                        if (weekdays) {
                            weekdays += ','
                        }
                        weekdays += conf.weekdays[i]
                    }
                }
                if (weekdays) {
                    result += ';BYDAY=' + weekdays
                }
                break;
                
            case conf.field.monthly_options_name:
                monthly_type = $('input[name='+conf.field.monthly_type_name+']:checked', form).val();
                switch (monthly_type) {
                    case 'DAY_OF_MONTH':
                        day = $('select[name='+conf.field.monthly_day_of_month_day_name+']', form).val();
                        interval = $('input[name='+conf.field.monthly_day_of_month_interval_name+']', form).val();
                        result += ';BYMONTHDAY=' + day;
                        result += ';INTERVAL=' + interval;
                        break;
                    case 'WEEKDAY_OF_MONTH':
                        index = $('select[name='+conf.field.monthly_weekday_of_month_index_name+']', form).val();
                        day = $('select[name='+conf.field.monthly_weekday_of_month_name+']', form).val();
                        interval = $('input[name='+conf.field.monthly_weekday_of_month_interval_name+']', form).val();
                        if ($.inArray(day, ['MO','TU','WE','TH','FR','SA','SU']) > -1) {
                            result += ';BYDAY=' + index + day;
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
                
            case conf.field.yearly_options_name:
                yearly_type = $('input[name='+conf.field.yearly_type_name+']:checked', form).val();
                switch (yearly_type) {
                    case 'DAY_OF_MONTH':
                        var month = $('select[name='+conf.field.yearly_day_of_month_month_name+']', form).val();
                        var day = $('select[name='+conf.field.yearly_day_of_month_index_name+']', form).val();
                        result += ';BYMONTH=' + month;
                        result += ';BYMONTHDAY=' + day;
                        break;
                    case 'WEEKDAY_OF_MONTH':
                        var index = $('select[name='+conf.field.yearly_weekday_of_month_index_name+']', form).val();
                        var day = $('select[name='+conf.field.yearly_weekday_of_month_day_name+']', form).val();
                        var month = $('select[name='+conf.field.yearly_weekday_of_month_month_name+']', form).val();
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
                
            case conf.field.range_options_name:
                var range_type = $('input[name='+conf.field.range_type_name+']:checked', form).val();
                switch (range_type) {
                    case 'BY_OCURRENCES':
                        result += ';COUNT=' + $('input[name='+conf.field.range_by_ocurrences_value_name+']').val();
                        break;
                    case 'BY_END_DATE':
                        var year = $('input[name='+conf.field.range_by_end_date_year_name+']').val();
                        var month = $('select[name='+conf.field.range_by_end_date_month_name+']').val();
                        var day = $('input[name='+conf.field.range_by_end_date_day_name+']').val();
                        if (month < 10) {
                            month = '0' + month;
                        }
                        if (day < 10) {
                            day = '0' + day;
                        }
                        result += ';UNTIL='+year+month+day+'T000000';
                        break;
                }
        };
    };
    
    return result
}
    
