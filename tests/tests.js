/*jslint indent: 4 */
/*global $, ok, module, test, stop, start, expect */

module("jquery.recurrenceinput widget");

test("Basics", function () {
    expect(3);
    
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
    var rrule = "RRULE:FREQ=WEEKLY;INTERVAL=4;BYDAY=TU,TH,FR;UNTIL=20120922T000000Z";
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
    var rrule = "RRULE:FREQ=MONTHLY;BYMONTHDAY=12;INTERVAL=2";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();
    
    var input = $("textarea[name=repeat]").recurrenceinput();   
    ok(input.form.find('select[name=rirtemplate]').val() === 'monthly');
    ok(input.form.find('input[name=rimonthlytype]:checked').val() === 'DAYOFMONTH');
    ok(input.form.find('input[name=rimonthlydayofmonthinterval]').val() === '2');
    ok(input.form.find('input[name=rirangetype]:checked').val() === 'NOENDDATE');
    
    input.form.find('.risavebutton').click();
    ok($("textarea[name=repeat]").val() === rrule);
    
});

test("Trimonthly recurrence by day", function () {
    expect(7);
    
    // Set a recurrence rule and open the dialog box.
    var rrule = "RRULE:FREQ=MONTHLY;BYDAY=+3TH;INTERVAL=3";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();
    
    var input = $("textarea[name=repeat]").recurrenceinput();   
    ok(input.form.find('select[name=rirtemplate]').val() === 'monthly');
    ok(input.form.find('input[name=rimonthlytype]:checked').val() === 'WEEKDAYOFMONTH');
    ok(input.form.find('select[name=rimonthlyweekdayofmonthindex]').val() === '+3');
    ok(input.form.find('select[name=rimonthlyweekdayofmonth]').val() === 'TH');
    ok(input.form.find('input[name=rimonthlyweekdayofmonthinterval]').val() === '3');
    ok(input.form.find('input[name=rirangetype]:checked').val() === 'NOENDDATE');
    
    input.form.find('.risavebutton').click();
    ok($("textarea[name=repeat]").val() === rrule);
    
});

test("Yearly by month day recurrence without end", function () {
    expect(6);

    // The second wednesday of April, forevah.
    var rrule = "RRULE:FREQ=YEARLY;BYMONTH=4;BYMONTHDAY=11";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();
        
    var input = $("textarea[name=repeat]").recurrenceinput();
    ok(input.form.find('select[name=rirtemplate]').val() === 'yearly');
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
    var rrule = "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE;UNTIL=20180419T000000Z\nEXDATE:20120411T000000Z\nRDATE:20120606T000000Z";
    $("textarea[name=repeat]").val(rrule);
    var input = $("textarea[name=repeat]").recurrenceinput();
    
    // Verify the list of dates    
    stop(); // Delay this 1 second so the Ajax request can finish.
    setTimeout(function () {
        var occurrences = input.display.find('.rioccurrences .occurrence span');
        ok(occurrences[0].firstChild.data === " April 13, 2011 ");
        ok(occurrences[8].firstChild.data === " April 11, 2018 ");
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
        ok(occurrences[0].firstChild.data === " April 13, 2011 ");
        ok(occurrences[8].firstChild.data === " April 11, 2018 ");
        start();
    }, 1000);

    
});

test("Adding RDATE", function () {
    expect(4);
    
    // Set the start date to test the Ajax request stuff.
    $("input[name=start]").val('04/13/2011');    
    
    // The second wednesday of April, until 2020, except 2012, but also June 6th 2012
    var input = $("textarea[name=repeat]").recurrenceinput();
    var rrule = "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE;UNTIL=20180419T000000Z\nEXDATE:20120411T000000Z\nRDATE:20120606T000000Z";
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
    ok($("textarea[name=repeat]").val() === "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE;UNTIL=20180419T000000Z\nEXDATE:20120411T000000Z\nRDATE:20110614T000000Z,20120606T000000Z");
    
});

test("Adding EXDATE", function () {
    expect(4);
    
    // Set the start date to test the Ajax request stuff.
    $("input[name=start]").val('04/13/2011');    
    
    // The second wednesday of April, until 2020, except 2012, but also June 6th 2012
    var input = $("textarea[name=repeat]").recurrenceinput();
    var rrule = "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE;UNTIL=20210414T000000Z\nEXDATE:20120411T000000Z\nRDATE:20120606T000000Z";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();

    // Reinclude the one in the original rrule.
    var entity = input.form.find('.rioccurrences .occurrence span.action a')[1];
    ok(entity.attributes.date.value === "20120411T000000");
    $(entity).click();

    // Exclude another one
    entity = input.form.find('.rioccurrences .occurrence span.action a')[3];
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
    ok($("textarea[name=repeat]").val() === "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE;UNTIL=20210414T000000Z\nEXDATE:20130410T000000Z\nRDATE:20120606T000000Z");
    
});

test("Parameters get stripped, dates converted to date times, multiple row lines merged.", function () {
    // XXX: I suspect, but I have to verify this, that it should be the other way around.
    // We should force EXDATES and RDATES to by DATE's only.
    expect(1);

    var input = $("textarea[name=repeat]").recurrenceinput();
    var rrule = "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE;\n UNTIL=20180419T000000Z\nEXDATE;VALUE=DATE:20120411\nRDATE;VALUE=DATE:20120606";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();
    input.form.find('.risavebutton').click();
    ok($("textarea[name=repeat]").val() === "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE;UNTIL=20180419T000000Z\nEXDATE:20120411T000000Z\nRDATE:20120606T000000Z");
    
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