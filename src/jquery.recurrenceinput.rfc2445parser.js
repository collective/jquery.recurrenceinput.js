
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
        byday = matches[1].split(",");
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
        bysetpos = matches[1].split(",");
    }

    switch (frequency) {
    case "DAILY":
    case "WEEKLY":
    case "MONTHLY":
    case "YEARLY":
        $("ul.freq input", el).val([frequency]);
        $("ul.freq input[value="+frequency+"]", el).change();
        break;
    }

    switch (frequency) {
    case "DAILY":
        if (interval) {
            $("input[name=recurrence_daily_interval]", el).val(interval);
            able_to_parse = true;
        }
        break;
    case "WEEKLY":
        if (interval) {
            $("input[name=recurrence_weekly_interval_number]", el).val(interval);
            able_to_parse = true;
        }
        else {
            $("input[name=recurrence_weekly_interval_number]", el).val("1");
        }
        if (byday) { 
            // TODO: if this is weekdays and interval=null, select DAILY#weekdays?
            $('input[name^=recurrence_weekly_days_]', el).val(byday);
            able_to_parse = true;
        }
        break;
    case "MONTHLY":
        if (bymonthday && interval) { // Day X of the month, every Y months
            $("input[name=recurrence_monthly_type]", el).val(['dayofmonth']);
            $("input[name=recurrence_monthly_dayofmonth_interval]", el).val(interval);
            $("select[name=recurrence_monthly_dayofmonth_day]", el).val(bymonthday);
            able_to_parse = true;
        }
        else if (byday && interval) { // The Nth X of the month, every Y months
            $("input[name=recurrence_monthly_type]", el).val(['dayofweek']);
            $("input[name=recurrence_monthly_dayofweek_interval]", el).val(interval);
            matches = /^(-?[0-9]+)([A-Z]{1,2}$)/.exec(byday); // we expect this to be -1TH
            if (!matches || matches.length != 3) {
                break; // don't understand the format
            }
            $("select[name=recurrence_monthly_dayofweek_index]", el).val(matches[1]);
            $("select[name=recurrence_monthly_dayofweek_day]", el).val(matches[2]);

            able_to_parse = true;
        }
        break;
    case "YEARLY":
        if (bymonth && bymonthday) { // Every [January] [1]
            $("input[name=recurrence_yearly_type]", el).val(['dayofmonth']);
            $("select[name=recurrence_yearly_dayofmonth_month]", el).val(bymonth);
            $("select[name=recurrence_yearly_dayofmonth_day]", el).val(bymonthday);

            able_to_parse = true;
        }
        else if (bymonth && byday) {
            $("input[name=recurrence_yearly_type]", el).val(['dayofweek']);
            $("select[name=recurrence_yearly_dayofweek_month]", el).val(bymonth);
            matches = /^(-?[0-9]+)([A-Z]{1,2})$/.exec(byday); // we expect this to be -1TH
            if (!matches || matches.length != 3) {
                break; // don't understand the format
            }
            $("select[name=recurrence_yearly_dayofweek_index]", el).val(matches[1]);
            $("select[name=recurrence_yearly_dayofweek_day]", el).val(matches[2]);

            able_to_parse = true;
        }
        break;
    }

    if (!able_to_parse) {
        // TODO: Probably want to throw and exception here
        alert("Cannot parse! " + initial_data);
    }
}

