
function widget_load_from_rfc2445_old(form, rrule) {
    // At this point, form is a fully constructed rule div 
    // what's the frequency?
    var matches = /^FREQ=(DAILY|WEEKLY|MONTHLY|YEARLY)/.exec(rrule);
    var frequency = matches[1];
    var able_to_parse = false;

    interval = null;
    matches = /INTERVAL=([0-9]+);?/.exec(rrule);
    if (matches) {
        interval = matches[1];
    }

    byday = null;
    matches = /BYDAY=([^;]+);?/.exec(rrule);
    if (matches) {
        byday = matches[1];
    }

    bymonthday = null;
    matches = /BYMONTHDAY=([^;]+);?/.exec(rrule);
    if (matches) {
        bymonthday = matches[1].split(",");
    }

    bymonth = null;
    matches = /BYMONTH=([^;]+);?/.exec(rrule);
    if (matches) {
        bymonth = matches[1].split(",");
    }

    bysetpos = null;
    matches = /BYSETPOS=([^;]+);?/.exec(rrule);
    if (matches) {
        bysetpos = matches[1];
    }

    switch (frequency) {
    case "DAILY":
    case "WEEKLY":
    case "MONTHLY":
    case "YEARLY":
        $("input[name=recurrenceinput_freq]", form).val([frequency]);
        $("input[value="+frequency+"]", form).change();
        break;
    }

    switch (frequency) {
    case "DAILY":
        if (interval) {
            $("input[name=recurrenceinput_daily_type]", form).val(["DAILY"]);
            $("input[name=recurrenceinput_daily_interval]", form).val(interval);
            able_to_parse = true;
        }
        break;
    case "WEEKLY":
        if (interval) {
            $("input[name=recurrenceinput_weekly_interval]", form).val(interval);
            able_to_parse = true;
        }
        else {
            $("input[name=recurrenceinput_weekly_interval]", form).val("1");
        }
        if (byday) { 
            // TODO: if this is weekdays and interval=null, select DAILY#weekdays?
            $('input[name=recurrenceinput_weekly_weekdays]', form).val(byday.split(","));
            able_to_parse = true;
        }
        break;
    case "MONTHLY":
        if (bymonthday && interval) { // Day X of the month, every Y months
            $("input[name=recurrenceinput_monthly_type]", form).val(['DAY_OF_MONTH']);
            $("select[name=recurrenceinput_monthly_day_of_month_day]", form).val(bymonthday);
            $("input[name=recurrenceinput_monthly_day_of_month_interval]", form).val(interval);
            able_to_parse = true;
        }
        else if (byday && bysetpos && interval) {
            $("select[name=recurrenceinput_monthly_weekday_of_month_index]", form).val(bysetpos);
            $("input[name=recurrenceinput_monthly_weekday_of_month_interval]", form).val(interval);
            if (byday === "MO,TU,WE,TH,FR") {
                $("select[name=recurrenceinput_monthly_weekday_of_month]", form).val("WEEKDAY");
                able_to_parse = true;
            }
            else if (byday === "SA,SU") {
                $("select[name=recurrenceinput_monthly_weekday_of_month]", form).val("WEEKEND_DAY");
                able_to_parse = true;
            }
        }
        else if (byday && interval) { // The Nth X of the month, every Y months
            $("input[name=recurrenceinput_monthly_type]", form).val(['WEEKDAY_OF_MONTH']);
            $("input[name=recurrenceinput_monthly_weekday_of_month_interval]", form).val(interval);
            matches = /^(-?[0-9]+)([A-Z]{1,2}$)/.exec(byday); // we expect this to be -1TH
            if (!matches || matches.length != 3) {
                break; // don't understand the format
            }
            $("select[name=recurrenceinput_monthly_weekday_of_month_index]", form).val(matches[1]);
            $("select[name=recurrenceinput_monthly_weekday_of_month]", form).val(matches[2]);

            able_to_parse = true;
        }
        break;
    case "YEARLY":
        if (bymonth && bymonthday) { // Every [January] [1]
            $("input[name=recurrenceinput_yearly_type]", form).val(['DAY_OF_MONTH']);
            $("select[name=recurrenceinput_yearly_day_of_month_month]", form).val(bymonth);
            $("select[name=recurrenceinput_yearly_day_of_month_day]", form).val(bymonthday);

            able_to_parse = true;
        }
        else if (byday && bysetpos && bymonth) {
            $("select[name=recurrenceinput_yearly_weekday_of_month_months]", form).val(bymonth);
                $("select[name=recurrenceinput_yearly_weekday_of_month_index]", form).val(bysetpos);
            if (byday === "MO,TU,WE,TH,FR") {
                $("select[name=recurrenceinput_yearly_weekday_of_month_day]", form).val("WEEKDAY");
                able_to_parse = true;
            }
            else if (byday === "SA,SU") {
                $("select[name=recurrenceinput_yearly_weekday_of_month_day]", form).val("WEEKEND_DAY");
                able_to_parse = true;
            }
        }
        else if (bymonth && byday) {
            $("input[name=recurrenceinput_yearly_type]", form).val(['WEEKDAY_OF_MONTH']);
            $("select[name=recurrenceinput_yearly_weekday_of_month_months]", form).val(bymonth);
            matches = /^(-?[0-9]+)([A-Z]{1,2})$/.exec(byday); // we expect this to be -1TH
            if (matches && matches.length == 3) {
                $("select[name=recurrenceinput_yearly_weekday_of_month_index]", form).val(matches[1]);
                $("select[name=recurrenceinput_yearly_weekday_of_month_day]", form).val(matches[2]);
                able_to_parse = true;
            }
        }
        break;
    }

    if (!able_to_parse) {
        // TODO: Probably want to throw and exception here
        //alert("Cannot parse! " + rrule);
    }
}


