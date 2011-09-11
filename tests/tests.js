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

test("Open and close", function () {
    expect(2);
    // Open the form by clicking on the checkbox.
    var input = $("textarea[name=repeat]").recurrenceinput();
    input.form.overlay().load();
    ok(input.form.is(':visible'));
    
    input.form.hide().overlay();
    ok(!input.form.is(':visible'));  

});

test("Daily recurrence with count", function () {
    expect(4);
    // Open the form by clicking on the checkbox.
    var input = $("textarea[name=repeat]").recurrenceinput();
    input.loadData("FREQ=DAILY;INTERVAL=5;COUNT=8");
    
    ok(input.form.find('select[name=recurrenceinput_rtemplate]').val() === 'daily');
    ok(input.form.find('input[name=recurrenceinput_daily_interval]').val() === '5');
    ok(input.form.find('input[name=recurrenceinput_range_type]:checked').val() === 'BY_OCCURRENCES');
    ok(input.form.find('input[name=recurrenceinput_range_by_occurrences_value]').val() === '8');
});

test("Weekly recurrence with days and end", function () {
    expect(11);
    // Open the form by clicking on the checkbox.
    var input = $("textarea[name=repeat]").recurrenceinput();
    input.loadData("FREQ=WEEKLY;INTERVAL=4;BYDAY=TU,TH,FR;UNTIL=20120922T000000");
    
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
    ok(input.form.find('input[name=recurrenceinput_range_by_end_date_calendar]').val() === '09/22/12');
});

test("Yearly recurrence without end", function () {
    expect(5);
    // Open the form by clicking on the checkbox.
    var input = $("textarea[name=repeat]").recurrenceinput();
    // The second wednesday of April, forevah.
    input.loadData("FREQ=YEARLY;BYMONTH=3;BYDAY=+2WE");
    
    ok(input.form.find('select[name=recurrenceinput_rtemplate]').val() === 'yearly');
    ok(input.form.find('select[name=recurrenceinput_yearly_weekday_of_month_index]').val() === '+2');
    ok(input.form.find('select[name=recurrenceinput_yearly_weekday_of_month_day]').val() === 'WE');
    ok(input.form.find('select[name=recurrenceinput_yearly_weekday_of_month_month]').val() === '3');
    ok(input.form.find('input[name=recurrenceinput_range_type]:checked').val() === 'NO_END_DATE');
});
