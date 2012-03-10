/*jslint indent: 4 */
/*global $, ok, module, test, stop, start, expect */

module("jquery.recurrenceinput widget");

test("Basics", function () {
    expect(4);
    
    // This sets the text area rule, and opens the dialog box.
    var input = $("textarea[name=repeat]").recurrenceinput();
    var rrule = "RRULE:FREQ=DAILY;INTERVAL=5;COUNT=8";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();

    // And this saves it.
    input.form.find('.risavebutton').click();
    ok($("textarea[name=repeat]").val() === rrule);
    
    // And now we toggle it off.
    $('.repeatfield input[name=richeckbox]')[0].checked = false;
    $('.repeatfield input[name=richeckbox]').click();
    ok($("textarea[name=repeat]").val() === '');    
    
    // And on again.
    $('.repeatfield input[name=richeckbox]')[0].checked = true;
    $('.repeatfield input[name=richeckbox]').click();
    ok($("textarea[name=repeat]").val() === rrule);
    
    // Open the dialog box and close it with cancel
    $('.repeatfield a[name=riedit]').click();
    input.form.find('.ricancelbutton').click();
    ok(input.form.is(':visible'));
});

test("Invalid ical data", function () {
    var input = $("textarea[name=repeat]").recurrenceinput();

    // Looks valid, but it doens't contain the RRULE data:
    $("textarea[name=repeat]").val("FREQ=MONTHLY;COUNT=3");
    $('.repeatfield a[name=riedit]').click();
    ok(input.form.find('#messagearea').text().indexOf('No RRULE in RRULE data') !== -1);
    input.form.find('.risavebutton').click();
});

test("No recurrence rule opens empty form with limited Recurrence Type to prevent unlimited Recurrences.", function () {
    expect(2);
    
    // This sets the text area rule, and opens the dialog box.
    var rrule = "";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();

    var input = $("textarea[name=repeat]").recurrenceinput();
    ok(input.form.find('input[name=rirangetype]:checked').val() === 'BYOCCURRENCES');
    ok(input.form.find('input[name=rirangebyoccurrencesvalue]').val() === '10');
});

test("Daily recurrence with count", function () {
    expect(5);
    
    // This sets the text area rule, and opens the dialog box.
    var rrule = "RRULE:FREQ=DAILY;INTERVAL=5;COUNT=8";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();

    var input = $("textarea[name=repeat]").recurrenceinput();
    ok(input.form.find('select[name=rirtemplate]').val() === 'daily');
    ok(input.form.find('input[name=ridailyinterval]').val() === '5');
    ok(input.form.find('input[name=rirangetype]:checked').val() === 'BYOCCURRENCES');
    ok(input.form.find('input[name=rirangebyoccurrencesvalue]').val() === '8');
        
    // And this saves it.
    input.form.find('.risavebutton').click();
    ok($("textarea[name=repeat]").val() === rrule);
});

test("Weekly recurrence with days and end", function () {
    expect(12);
    
    // Set a recurrence rule and open the dialog box.
    var rrule = "RRULE:FREQ=WEEKLY;INTERVAL=4;BYDAY=TU,TH,FR;UNTIL=20120922T000000";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();
    
    var input = $("textarea[name=repeat]").recurrenceinput();   
    ok(input.form.find('select[name=rirtemplate]').val() === 'weekly');
    ok(input.form.find('input[name=riweeklyinterval]').val() === '4');
    ok(!input.form.find('input[name=riweeklyweekdaysMO]').attr('checked'));
    ok(input.form.find('input[name=riweeklyweekdaysTU]').attr('checked'));
    ok(!input.form.find('input[name=riweeklyweekdaysWE]').attr('checked'));
    ok(input.form.find('input[name=riweeklyweekdaysTH]').attr('checked'));
    ok(input.form.find('input[name=riweeklyweekdaysFR]').attr('checked'));
    ok(!input.form.find('input[name=riweeklyweekdaysSA]').attr('checked'));
    ok(!input.form.find('input[name=riweeklyweekdaysSU]').attr('checked'));
    ok(input.form.find('input[name=rirangetype]:checked').val() === 'BYENDDATE');
    ok(input.form.find('input[name=rirangebyenddatecalendar]').val() === '09/22/2012');

    input.form.find('.risavebutton').click();
    ok($("textarea[name=repeat]").val() === rrule);
    
});

test("Bimonthly recurrence by month day", function () {
    expect(5);
    
    // Set a recurrence rule and open the dialog box.
    var rrule = "RRULE:FREQ=MONTHLY;INTERVAL=2;BYMONTHDAY=12";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();
    
    var input = $("textarea[name=repeat]").recurrenceinput();   
    ok(input.form.find('select[name=rirtemplate]').val() === 'monthly');
    ok(input.form.find('input[name=rimonthlytype]:checked').val() === 'DAYOFMONTH');
    ok(input.form.find('input[name=rimonthlyinterval]').val() === '2');
    ok(input.form.find('input[name=rirangetype]:checked').val() === 'NOENDDATE');
    
    input.form.find('.risavebutton').click();
    ok($("textarea[name=repeat]").val() === rrule);
    
});

test("Trimonthly recurrence by day", function () {
    expect(7);
    
    // Set a recurrence rule and open the dialog box.
    var rrule = "RRULE:FREQ=MONTHLY;INTERVAL=3;BYDAY=+3TH";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();
    
    var input = $("textarea[name=repeat]").recurrenceinput();   
    ok(input.form.find('select[name=rirtemplate]').val() === 'monthly');
    ok(input.form.find('input[name=rimonthlytype]:checked').val() === 'WEEKDAYOFMONTH');
    ok(input.form.find('select[name=rimonthlyweekdayofmonthindex]').val() === '+3');
    ok(input.form.find('select[name=rimonthlyweekdayofmonth]').val() === 'TH');
    ok(input.form.find('input[name=rimonthlyinterval]').val() === '3');
    ok(input.form.find('input[name=rirangetype]:checked').val() === 'NOENDDATE');
    
    input.form.find('.risavebutton').click();
    ok($("textarea[name=repeat]").val() === rrule);
    
});

test("Yearly by month day recurrence without end", function () {
    expect(7);

    // The second wednesday of April, forevah.
    var rrule = "RRULE:FREQ=YEARLY;INTERVAL=3;BYMONTH=4;BYMONTHDAY=11";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();
        
    var input = $("textarea[name=repeat]").recurrenceinput();
    ok(input.form.find('select[name=rirtemplate]').val() === 'yearly');
    ok(input.form.find('input[name=riyearlyinterval]').val() === '3');
    ok(input.form.find('input[name=riyearlyType]:checked').val() === 'DAYOFMONTH');
    ok(input.form.find('select[name=riyearlydayofmonthmonth]').val() === '4');
    ok(input.form.find('select[name=riyearlydayofmonthday]').val() === '11');
    ok(input.form.find('input[name=rirangetype]:checked').val() === 'NOENDDATE');
        
    input.form.find('.risavebutton').click();
    ok($("textarea[name=repeat]").val() === rrule);
    
});


test("Yearly byday recurrence without end", function () {
    expect(6);

    // The second wednesday of April, forevah.
    var rrule = "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE";    
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();
        
    var input = $("textarea[name=repeat]").recurrenceinput();
    ok(input.form.find('select[name=rirtemplate]').val() === 'yearly');
    ok(input.form.find('select[name=riyearlyweekdayofmonthindex]').val() === '+2');
    ok(input.form.find('select[name=riyearlyweekdayofmonthday]').val() === 'WE');
    ok(input.form.find('select[name=riyearlyweekdayofmonthmonth]').val() === '4');
    ok(input.form.find('input[name=rirangetype]:checked').val() === 'NOENDDATE');
        
    input.form.find('.risavebutton').click();
    ok($("textarea[name=repeat]").val() === rrule);
    
});


test("Test of connected start field and showing of occurrences", function () {
    expect(1);

    // Set the start date to test the XML javascript stuff.
    $("input[name=start]").val('4/13/2011');
        
    // The second wednesday of April, forevah.
    var input = $("textarea[name=repeat]").recurrenceinput();
    var rrule = "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE";    
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();
    var occurrences = input.form.find('div.occurrence');
    ok(occurrences.length === 10);
    
    input.form.find('.risavebutton').click();
    
});

test("RDATE and EXDATE", function () {
    expect(12);

    // Set the start date to test the Ajax request stuff.
    $("input[name=start]").val('04/13/2011');    
    
    // The second wednesday of April, until 2020, except 2012, but also June 6th 2012
    var rrule = "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE;UNTIL=20180419T000000\nEXDATE:20120411T000000\nRDATE:20120606T000000";
    $("textarea[name=repeat]").val(rrule);
    var input = $("textarea[name=repeat]").recurrenceinput();
    
    // Verify the list of dates    
    stop(); // Delay this 1 second so the Ajax request can finish.
    setTimeout(function () {
        var occurrences = input.display.find('.rioccurrences .occurrence span');
        ok(occurrences[0].firstChild.data === " April 13, 2011  ");
        ok(occurrences[8].firstChild.data === " April 13, 2016   ");
        start();
    }, 1000);

    
    $('.repeatfield a[name=riedit]').click();
        
    ok(input.form.find('select[name=rirtemplate]').val() === 'yearly');
    ok(input.form.find('select[name=riyearlyweekdayofmonthindex]').val() === '+2');
    ok(input.form.find('select[name=riyearlyweekdayofmonthday]').val() === 'WE');
    ok(input.form.find('select[name=riyearlyweekdayofmonthmonth]').val() === '4');
    ok(input.form.find('input[name=rirangetype]:checked').val() === 'BYENDDATE');
    ok(input.form.find('input[name=rirangebyenddatecalendar]').val() === '04/19/2018');
    
    var occurrences = input.form.find('div.occurrence');
    ok(occurrences.length === 9);
    
    input.form.find('.risavebutton').click();
    ok($("textarea[name=repeat]").val() === rrule);
    
    // Verify the list of dates    
    stop(); // Delay this 1 second so the Ajax request can finish.
    setTimeout(function () {
        var occurrences = input.display.find('.rioccurrences .occurrence span');
        ok(occurrences[0].firstChild.data === " April 13, 2011  ");
        ok(occurrences[8].firstChild.data === " April 13, 2016   ");
        start();
    }, 1000);

    
});

test("Adding RDATE", function () {
    expect(4);
    
    // Set the start date to test the Ajax request stuff.
    $("input[name=start]").val('04/13/2011');    
    
    // The second wednesday of April, until 2020, except 2012, but also June 6th 2012
    var input = $("textarea[name=repeat]").recurrenceinput();
    var rrule = "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE;UNTIL=20180419T000000\nEXDATE:20120411T000000\nRDATE:20120606T000000";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();

    // Add a new date as an RDATE
    input.form.find('#adddate').data('dateinput').setValue(2011, 5, 13);
    input.form.find('#addaction').click();
    // Check that it's added properly
    var entity = input.form.find('.rioccurrences .occurrence span')[0];
    ok(entity.attributes['class'].value === "rdate");
    
    // Delete it
    entity = input.form.find('.rioccurrences .occurrence span.action a')[0];
    ok(entity.attributes.date.value === "20110613T000000");
    $(entity).click();
    
    // Delay 1 second
    stop();
    setTimeout(function () { // In jQuery 1.6 this can be replaced by a .promise().done() call.
        // Check that it is gone:
        entity = input.form.find('.rioccurrences .occurrence span.action a')[0];
        ok(entity.attributes.date.value !== "20110613T000000");
        start();
    }, 1000);

    // And add another one:
    input.form.find('#adddate').data('dateinput').setValue(2011, 5, 14);
    input.form.find('#addaction').click();
    
    input.form.find('.risavebutton').click();
    ok($("textarea[name=repeat]").val() === "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE;UNTIL=20180419T000000\nEXDATE:20120411T000000\nRDATE:20110614T000000,20120606T000000");
    
});

test("Adding EXDATE", function () {
    expect(4);
    
    // Set the start date to test the Ajax request stuff.
    $("input[name=start]").val('04/13/2011');    
    
    // The second wednesday of April, until 2020, except 2012, but also June 6th 2012
    var input = $("textarea[name=repeat]").recurrenceinput();
    var rrule = "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE;UNTIL=20210414T000000\nEXDATE:20120411T000000\nRDATE:20120606T000000";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();

    // Reinclude the one in the original rrule.
    var entity = input.form.find('.rioccurrences .occurrence span.action a')[0];
    ok(entity.attributes.date.value === "20120411T000000");
    $(entity).click();

    // Exclude another one
    entity = input.form.find('.rioccurrences .occurrence span.action a')[2];
    ok(entity.attributes.date.value === "20130410T000000");
    $(entity).click();
    
    // Check the batching
    $(input.form.find('.rioccurrences .batching a')[1]).click();
    // Delay 1 second
    stop();
    setTimeout(function () { // In jQuery 1.6 this can be replaced by a .promise().done() call.
        // Check that it is gone:
        entity = input.form.find('.rioccurrences .batching .current a')[0];
        ok(entity.attributes.start.value === "11");
        start();
    }, 1000);
        
    input.form.find('.risavebutton').click();
    ok($("textarea[name=repeat]").val() === "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE;UNTIL=20210414T000000\nEXDATE:20130410T000000\nRDATE:20120606T000000");
    
});

test("Parameters get stripped, dates converted to date times, multiple row lines merged.", function () {
    // XXX: I suspect, but I have to verify this, that it should be the other way around.
    // We should force EXDATES and RDATES to by DATE's only.
    expect(1);

    var input = $("textarea[name=repeat]").recurrenceinput();
    var rrule = "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE;\n UNTIL=20180419T000000\nEXDATE;VALUE=DATE:20120411\nRDATE;VALUE=DATE:20120606";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();
    input.form.find('.risavebutton').click();
    ok($("textarea[name=repeat]").val() === "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE;UNTIL=20180419T000000\nEXDATE:20120411T000000\nRDATE:20120606T000000");
    
});

test("Field validations", function () {
    expect(49);
    
    // This sets the text area rule, and opens the dialog box.
    var rrule = "RRULE:FREQ=DAILY;INTERVAL=5;COUNT=8";
    $('textarea[name=repeat]').val(rrule);
    $('#start').val('12/31/2011');
    $('.repeatfield a[name=riedit]').click();

    var input = $("textarea[name=repeat]").recurrenceinput();
    
    // Daily
    ok(input.form.find('select[name=rirtemplate]').val() === 'daily');
    
    // Empty Repeat every N days field
    input.form.find('input[name=ridailyinterval]').val('');
    input.form.find('.rirefreshbutton').click();
    ok(input.form.find('input[name=ridailyinterval]').val() === '');
    ok(input.form.find('#messagearea').css('display') === 'block');
    ok(input.form.find('#messagearea').text() === 'Error: The "Repeat every"-field must be between 1 and 1000');
    input.form.find('input[name=ridailyinterval]').val('5');
    input.form.find('.rirefreshbutton').click();
    ok(input.form.find('#messagearea').css('display') === 'none');
    ok(input.form.find('input[name=ridailyinterval]').val() === '5');    
    
    // Empty End recurrence after N occurances field
    input.form.find('input[name=rirangebyoccurrencesvalue]').val('');
    input.form.find('.rirefreshbutton').click();
    ok(input.form.find('input[name=rirangetype]:checked').val() === 'BYOCCURRENCES');
    ok(input.form.find('input[name=rirangebyoccurrencesvalue]').val() === '');
    ok(input.form.find('#messagearea').css('display') === 'block');
    ok(input.form.find('#messagearea').text() === 'Error: The "After N occurrences"-field must be between 1 and 1000');
    input.form.find('input[name=rirangebyoccurrencesvalue]').val('5');
    input.form.find('.rirefreshbutton').click();
    ok(input.form.find('#messagearea').css('display') === 'none');
    ok(input.form.find('input[name=rirangetype]:checked').val() === 'BYOCCURRENCES');
    ok(input.form.find('input[name=rirangebyoccurrencesvalue]').val() === '5');
    
    // Empty End recurrence On field
    input.form.find('input[value=BYENDDATE]').click();
    input.form.find('.rirefreshbutton').click();
    ok(input.form.find('input[name=rirangetype]:checked').val() === 'BYENDDATE');
    ok(input.form.find('input[name=rirangebyenddatecalendar]').val() === '');
    ok(input.form.find('#messagearea').css('display') === 'block');
    ok(input.form.find('#messagearea').text() === 'Error: End date is not set. Please set a correct value');
    input.form.find('input[name=rirangebyenddatecalendar]').data('dateinput').setValue('2015', '7', '15');
    input.form.find('input[value=BYENDDATE]').click();
    input.form.find('.rirefreshbutton').click();
    ok(input.form.find('#messagearea').css('display') === 'none');
    ok(input.form.find('input[name=rirangetype]:checked').val() === 'BYENDDATE');
    ok(input.form.find('input[name=rirangebyenddatecalendar]').val() === '08/15/2015');
    
    // End date before start date
    input.form.find('input[name=rirangebyenddatecalendar]').data('dateinput').setValue('2001', '7', '15');
    input.form.find('input[value=BYENDDATE]').click();
    input.form.find('.rirefreshbutton').click();
    ok(input.form.find('#messagearea').css('display') === 'block');
    ok(input.form.find('#messagearea').text() === 'Error: End date cannot be before start date');
    input.form.find('input[name=rirangebyenddatecalendar]').data('dateinput').setValue('2013', '7', '15');
    input.form.find('input[value=BYENDDATE]').click();
    input.form.find('.rirefreshbutton').click();
    ok(input.form.find('#messagearea').css('display') === 'none');
    ok(input.form.find('input[name=rirangetype]:checked').val() === 'BYENDDATE');
    ok(input.form.find('input[name=rirangebyenddatecalendar]').val() === '08/15/2013');
    
    // Weekly
    input.form.find('select[name=rirtemplate]').val('weekly').change();
    ok(input.form.find('select[name=rirtemplate]').val() === 'weekly');
    
    // Empty Repeat every N days field
    input.form.find('input[name=riweeklyinterval]').val('');
    input.form.find('#riweeklyweekdays input:checkbox').attr('checked', true);
    input.form.find('.rirefreshbutton').click();
    ok(input.form.find('input[name=riweeklyinterval]').val() === '');
    ok(input.form.find('#messagearea').css('display') === 'block');
    ok(input.form.find('#messagearea').text() === 'Error: The "Repeat every"-field must be between 1 and 1000');
    input.form.find('input[name=riweeklyinterval]').val('5');
    input.form.find('.rirefreshbutton').click();
    ok(input.form.find('#messagearea').css('display') === 'none');
    ok(input.form.find('input[name=riweeklyinterval]').val() === '5');
    
    // Monthly
    input.form.find('select[name=rirtemplate]').val('monthly').change();
    ok(input.form.find('select[name=rirtemplate]').val() === 'monthly');
    
    // No Repeat on radio button is selected
    input.form.find('.rirefreshbutton').click();
    ok(input.form.find('#messagearea').css('display') === 'block');
    ok(input.form.find('#messagearea').text() === 'Error: "Repeat on"-value must be selected');
    input.form.find('input[name=rimonthlytype]').attr('checked', true);
    input.form.find('.rirefreshbutton').click();
    ok(input.form.find('#messagearea').css('display') === 'none');
    
    // Empty Repeat every N days field
    input.form.find('input[name=rimonthlyinterval]').val('');
    input.form.find('.rirefreshbutton').click();
    ok(input.form.find('input[name=rimonthlyinterval]').val() === '');
    ok(input.form.find('#messagearea').css('display') === 'block');
    ok(input.form.find('#messagearea').text() === 'Error: The "Repeat every"-field must be between 1 and 1000');
    input.form.find('input[name=rimonthlyinterval]').val('5');
    input.form.find('.rirefreshbutton').click();
    ok(input.form.find('#messagearea').css('display') === 'none');
    ok(input.form.find('input[name=rimonthlyinterval]').val() === '5');
    
    // Yearly
    input.form.find('select[name=rirtemplate]').val('yearly').change();
    ok(input.form.find('select[name=rirtemplate]').val() === 'yearly');
    
    // No Repeat on radio button is selected
    input.form.find('input[name=riyearlyType]').attr('checked', false);
    input.form.find('.rirefreshbutton').click();
    ok(input.form.find('#messagearea').css('display') === 'block');
    ok(input.form.find('#messagearea').text() === 'Error: "Repeat on"-value must be selected');
    input.form.find('input[name=riyearlyType]').attr('checked', true);
    input.form.find('.rirefreshbutton').click();
    ok(input.form.find('#messagearea').css('display') === 'none');
    
    // Empty Repeat every N days field
    input.form.find('input[name=riyearlyinterval]').val('');
    input.form.find('.rirefreshbutton').click();
    ok(input.form.find('input[name=riyearlyinterval]').val() === '');
    ok(input.form.find('#messagearea').css('display') === 'block');
    ok(input.form.find('#messagearea').text() === 'Error: The "Repeat every"-field must be between 1 and 1000');
    input.form.find('input[name=riyearlyinterval]').val('5');
    input.form.find('.rirefreshbutton').click();
    ok(input.form.find('#messagearea').css('display') === 'none');
    ok(input.form.find('input[name=riyearlyinterval]').val() === '5');
    
    // And this saves it.
    input.form.find('.risavebutton').click();
});

test("Unsupported features (incomplete)", function () {

    expect(13);
    
    var input = $("textarea[name=custom]").recurrenceinput();

    // No matching template
    $("textarea[name=custom]").val("RRULE:FREQ=MONTHLY;COUNT=3");
    $('.customfield a[name=riedit]').click();
    ok(input.form.find('#messagearea').text().indexOf('No matching recurrence template') !== -1);
    input.form.find('.risavebutton').click();
    
    input = $("textarea[name=repeat]").recurrenceinput();
    // No support for BYSETPOS (how would you do something like that in a UI!?)
    $("textarea[name=repeat]").val("RRULE:FREQ=MONTHLY;COUNT=3;BYSETPOS=3");
    $('.repeatfield a[name=riedit]').click();
    ok(input.form.find('#messagearea').text().indexOf('BYSETPOS') !== -1);
    input.form.find('.risavebutton').click();

    // Can't have multiple recurrences in a month with MONTHLY recurrence
    $("textarea[name=repeat]").val("RRULE:FREQ=MONTHLY;BYMONTHDAY=2,3,9");
    $('.repeatfield a[name=riedit]').click();
    ok(input.form.find('select[name=rimonthlydayofmonthday]').val() === "2");
    ok(input.form.find('#messagearea').text().indexOf('multiple days in') !== -1);
    input.form.find('.risavebutton').click();

    $("textarea[name=repeat]").val("RRULE:FREQ=MONTHLY;BYDAY=+2WE,+3TH");
    $('.repeatfield a[name=riedit]').click();
    ok(input.form.find('select[name=rimonthlyweekdayofmonthindex]').val() === '+2');
    ok(input.form.find('select[name=rimonthlyweekdayofmonth]').val() === 'WE');
    ok(input.form.find('#messagearea').text().indexOf('multiple days in') !== -1);
    input.form.find('.risavebutton').click();

    $("textarea[name=repeat]").val("RRULE:FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=2,3,9");
    $('.repeatfield a[name=riedit]').click();
    ok(input.form.find('select[name=riyearlydayofmonthday]').val() === "2");
    ok(input.form.find('#messagearea').text().indexOf('multiple days in') !== -1);
    input.form.find('.risavebutton').click();

    $("textarea[name=repeat]").val("RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE,+3TH");
    $('.repeatfield a[name=riedit]').click();
    ok(input.form.find('select[name=riyearlyweekdayofmonthindex]').val() === '+2');
    ok(input.form.find('select[name=riyearlyweekdayofmonthday]').val() === 'WE');
    ok(input.form.find('select[name=riyearlyweekdayofmonthmonth]').val() === '4');
    ok(input.form.find('#messagearea').text().indexOf('multiple days in') !== -1);
    input.form.find('.risavebutton').click();


});
