/*jslint indent: 4 */
/*global $: false, ok: false, module: false, test: false, expect */

module("jquery.recurrenceinput widget");
 
test("Widget setup", function () {
    expect(2);
    // Make sure that the overlay for the popup exists and is hidden
    var form = $('.recurrenceinput_form');
    ok(form[0] !== undefined);
    ok(!form.is(':visible'));
  
});

test("Daily recurrence with count", function () {
    expect(5);
    
    // This sets the text area rule, and opens the dialog box.
    var rrule = "RRULE:FREQ=DAILY;INTERVAL=5;COUNT=8";
    $("textarea[name=repeat]").val(rrule);
    $('a[name=recurrenceinput_edit]').click();

    var input = $("textarea[name=repeat]").recurrenceinput();
    ok(input.form.find('select[name=recurrenceinput_rtemplate]').val() === 'daily');
    ok(input.form.find('input[name=recurrenceinput_daily_interval]').val() === '5');
    ok(input.form.find('input[name=recurrenceinput_range_type]:checked').val() === 'BY_OCCURRENCES');
    ok(input.form.find('input[name=recurrenceinput_range_by_occurrences_value]').val() === '8');
        
    // And this saves it.
    $('.recurrenceinput_save_button').click();
    ok($("textarea[name=repeat]").val() === rrule);
});

test("Weekly recurrence with days and end", function () {
    expect(12);
    
    // Set a recurrence rule and open the dialog box.
    var rrule = "RRULE:FREQ=WEEKLY;INTERVAL=4;BYDAY=TU,TH,FR;UNTIL=20120922T000000Z";
    $("textarea[name=repeat]").val(rrule);
    $('a[name=recurrenceinput_edit]').click();
    
    var input = $("textarea[name=repeat]").recurrenceinput();   
    ok(input.form.find('select[name=recurrenceinput_rtemplate]').val() === 'weekly');
    ok(input.form.find('input[name=recurrenceinput_weekly_interval]').val() === '4');
    ok(!input.form.find('input[name=recurrenceinput_weekly_weekdays_MO]').attr('checked'));
    ok(input.form.find('input[name=recurrenceinput_weekly_weekdays_TU]').attr('checked'));
    ok(!input.form.find('input[name=recurrenceinput_weekly_weekdays_WE]').attr('checked'));
    ok(input.form.find('input[name=recurrenceinput_weekly_weekdays_TH]').attr('checked'));
    ok(input.form.find('input[name=recurrenceinput_weekly_weekdays_FR]').attr('checked'));
    ok(!input.form.find('input[name=recurrenceinput_weekly_weekdays_SA]').attr('checked'));
    ok(!input.form.find('input[name=recurrenceinput_weekly_weekdays_SU]').attr('checked'));
    ok(input.form.find('input[name=recurrenceinput_range_type]:checked').val() === 'BY_END_DATE');
    ok(input.form.find('input[name=recurrenceinput_range_by_end_date_calendar]').val() === '09/22/2012');

    $('.recurrenceinput_save_button').click();
    ok($("textarea[name=repeat]").val() === rrule);
    
});

test("Bimonthly recurrence by month day", function () {
    expect(5);
    
    // Set a recurrence rule and open the dialog box.
    var rrule = "RRULE:FREQ=MONTHLY;BYMONTHDAY=12;INTERVAL=2";
    $("textarea[name=repeat]").val(rrule);
    $('a[name=recurrenceinput_edit]').click();
    
    var input = $("textarea[name=repeat]").recurrenceinput();   
    ok(input.form.find('select[name=recurrenceinput_rtemplate]').val() === 'monthly');
    ok(input.form.find('input[name=recurrenceinput_monthly_type]:checked').val() === 'DAY_OF_MONTH');
    ok(input.form.find('input[name=recurrenceinput_monthly_day_of_month_interval]').val() === '2');
    ok(input.form.find('input[name=recurrenceinput_range_type]:checked').val() === 'NO_END_DATE');
    
    $('.recurrenceinput_save_button').click();
    ok($("textarea[name=repeat]").val() === rrule);
    
});

test("Trimonthly recurrence by day", function () {
    expect(7);
    
    // Set a recurrence rule and open the dialog box.
    var rrule = "RRULE:FREQ=MONTHLY;BYDAY=+3TH;INTERVAL=3";
    $("textarea[name=repeat]").val(rrule);
    $('a[name=recurrenceinput_edit]').click();
    
    var input = $("textarea[name=repeat]").recurrenceinput();   
    ok(input.form.find('select[name=recurrenceinput_rtemplate]').val() === 'monthly');
    ok(input.form.find('input[name=recurrenceinput_monthly_type]:checked').val() === 'WEEKDAY_OF_MONTH');
    ok(input.form.find('select[name=recurrenceinput_monthly_weekday_of_month_index]').val() === '+3');
    ok(input.form.find('select[name=recurrenceinput_monthly_weekday_of_month]').val() === 'TH');
    ok(input.form.find('input[name=recurrenceinput_monthly_weekday_of_month_interval]').val() === '3');
    ok(input.form.find('input[name=recurrenceinput_range_type]:checked').val() === 'NO_END_DATE');
    
    $('.recurrenceinput_save_button').click();
    ok($("textarea[name=repeat]").val() === rrule);
    
});

test("Yearly by month day recurrence without end", function () {
    expect(6);

    // The second wednesday of April, forevah.
    var rrule = "RRULE:FREQ=YEARLY;BYMONTH=4;BYMONTHDAY=11";
    $("textarea[name=repeat]").val(rrule);
    $('a[name=recurrenceinput_edit]').click();
        
    var input = $("textarea[name=repeat]").recurrenceinput();
    ok(input.form.find('select[name=recurrenceinput_rtemplate]').val() === 'yearly');
    ok(input.form.find('input[name=recurrenceinput_yearly_type]:checked').val() === 'DAY_OF_MONTH');
    ok(input.form.find('select[name=recurrenceinput_yearly_day_of_month_month]').val() === '4');
    ok(input.form.find('select[name=recurrenceinput_yearly_day_of_month_day]').val() === '11');
    ok(input.form.find('input[name=recurrenceinput_range_type]:checked').val() === 'NO_END_DATE');
        
    $('.recurrenceinput_save_button').click();
    ok($("textarea[name=repeat]").val() === rrule);
    
});


test("Yearly byday recurrence without end", function () {
    expect(6);

    // The second wednesday of April, forevah.
    var rrule = "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE";    
    $("textarea[name=repeat]").val(rrule);
    $('a[name=recurrenceinput_edit]').click();
        
    var input = $("textarea[name=repeat]").recurrenceinput();
    ok(input.form.find('select[name=recurrenceinput_rtemplate]').val() === 'yearly');
    ok(input.form.find('select[name=recurrenceinput_yearly_weekday_of_month_index]').val() === '+2');
    ok(input.form.find('select[name=recurrenceinput_yearly_weekday_of_month_day]').val() === 'WE');
    ok(input.form.find('select[name=recurrenceinput_yearly_weekday_of_month_month]').val() === '4');
    ok(input.form.find('input[name=recurrenceinput_range_type]:checked').val() === 'NO_END_DATE');
        
    $('.recurrenceinput_save_button').click();
    ok($("textarea[name=repeat]").val() === rrule);
    
});


test("Test of connected start field and showing of occurrences", function () {
    expect(1);

    // Set the start date to test the XML javascript stuff.
    $("input[name=start]").val('4/13/11');
        
    // The second wednesday of April, forevah.
    var input = $("textarea[name=repeat]").recurrenceinput();
    var rrule = "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE";    
    $("textarea[name=repeat]").val(rrule);
    $('a[name=recurrenceinput_edit]').click();
    var occurrences = input.form.find('div.occurrence');
    ok(occurrences.length === 10);
    
    $('.recurrenceinput_save_button').click();
    
});

test("RDATE and EXDATE", function () {
    expect(8);

    // Set the start date to test the XML javascript stuff.
    $("input[name=start]").val('4/13/11');
    //$("input[name=start]").data('dateinput').change();
    
    
    // The second wednesday of April, until 2020, except 2012, but also June 6th 2012
    var input = $("textarea[name=repeat]").recurrenceinput();
    var rrule = "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE;UNTIL=20180419T000000Z\nEXDATE:20120411T000000Z\nRDATE:20120606T000000Z";
    $("textarea[name=repeat]").val(rrule);
    $('a[name=recurrenceinput_edit]').click();
        
    ok(input.form.find('select[name=recurrenceinput_rtemplate]').val() === 'yearly');
    ok(input.form.find('select[name=recurrenceinput_yearly_weekday_of_month_index]').val() === '+2');
    ok(input.form.find('select[name=recurrenceinput_yearly_weekday_of_month_day]').val() === 'WE');
    ok(input.form.find('select[name=recurrenceinput_yearly_weekday_of_month_month]').val() === '4');
    ok(input.form.find('input[name=recurrenceinput_range_type]:checked').val() === 'BY_END_DATE');
    ok(input.form.find('input[name=recurrenceinput_range_by_end_date_calendar]').val() === '04/19/2018');
    
    var occurrences = input.form.find('div.occurrence');
    ok(occurrences.length === 9);
    
    $('.recurrenceinput_save_button').click();
    ok($("textarea[name=repeat]").val() === rrule);
    
});

test("Parameters get stripped, dates converted to date times, multiple row lines merged.", function () {
    // XXX: I suspect, but I have to verify this, that it should be the other way around.
    // We should force EXDATES and RDATES to by DATE's only.
    expect(1);

    var input = $("textarea[name=repeat]").recurrenceinput();
    var rrule = "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE;\n UNTIL=20180419T000000Z\nEXDATE;VALUE=DATE:20120411\nRDATE;VALUE=DATE:20120606";
    $("textarea[name=repeat]").val(rrule);
    $('a[name=recurrenceinput_edit]').click();
    $('.recurrenceinput_save_button').click();
    ok($("textarea[name=repeat]").val() === "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE;UNTIL=20180419T000000Z\nEXDATE:20120411T000000Z\nRDATE:20120606T000000Z");
    
});
