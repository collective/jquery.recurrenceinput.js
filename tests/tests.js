/*jslint indent: 4 */
/*global $, ok, module, test, stop, start, expect */
QUnit.config.autostart = false;

module("jquery.recurrenceinput widget");


// HELPER


function rload1() {
    $.tools.recurrenceinput.localize("sv", {
        displayUnactivate: '\u00C5terkommer inte',
        displayActivate: '\u00C5terkommer var',
        edit: 'Redigera...',
        add: 'L\u00E4gg till',
        refresh: 'Ladda om',

        title: '\u00C5terkomster',
        preview: 'Valda datum',
        addDate: 'L\u00E4gg till',

        recurrenceType: 'Typ av \u00E5terkomst:',

        dailyInterval1: 'Varje',
        dailyInterval2: 'dag(ar)',

        weeklyInterval1: 'Varje',
        weeklyInterval2: 'vecka/veckor',
        weeklyWeekdays: 'P\u00E5:',
        weeklyWeekdaysHuman: 'p\u00E5: ',

        monthlyInterval1: '\u00C5terkom varje:',
        monthlyInterval2: 'm\u00E5nad(er)',
        monthlyDayOfMonth1: 'Den',
        monthlyDayOfMonth1Human: 'den',
        monthlyDayOfMonth2: 'dagen i m\u00E5naden',
        monthlyDayOfMonth3: 'm\u00E5nad',
        monthlyWeekdayOfMonth1: '',
        monthlyWeekdayOfMonth1Human: 'p\u00E5',
        monthlyWeekdayOfMonth2: '',
        monthlyWeekdayOfMonth3: 'i m\u00E5naden',
        monthlyRepeatOn: '\u00C5terkom p\u00E5:',

        yearlyInterval1: '\u00C5terkom varje:',
        yearlyInterval2: '\u00E5r',
        yearlyDayOfMonth1: 'Varje',
        yearlyDayOfMonth1Human: 'p\u00E5',
        yearlyDayOfMonth2: '',
        yearlyDayOfMonth3: '',
        yearlyWeekdayOfMonth1: '',
        yearlyWeekdayOfMonth1Human: 'p\u00E5',
        yearlyWeekdayOfMonth2: '',
        yearlyWeekdayOfMonth3: 'i',
        yearlyWeekdayOfMonth4: '',
        yearlyRepeatOn: '\u00C5terkom p\u00E5:',

        range: '\u00C5terkomsten stoppar:',
        rangeNoEnd: 'Inte',
        rangeByOccurrences1: 'Stoppar efter',
        rangeByOccurrences1Human: 'stoppar after',
        rangeByOccurrences2: '\u00E5terkomster',
        rangeByEndDate: 'Till och med',
        rangeByEndDateHuman: 'till och med ',

        including: ', samt den',
        except: ', f\u00F6rutom den',

        cancel: 'Avbryt',
        save: 'Spara',

        recurrenceStart: 'F\u00F6rsta g\u00E5ngen',
        additionalDate: 'Tillagt datum',
        include: 'Inkludera',
        exclude: 'Exkludera',
        remove: 'Ta bort',

        orderIndexes: ['f\u00F6rsta', 'andra', 'tredje', 'fj\u00E4rde', 'sista'],
        months: [
            'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
            'Juli', 'Augusti', 'September', 'October', 'November', 'December'
        ],
        shortMonths: [
            'Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun',
            'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'
        ],
        weekdays: [
            'm\u00E5ndagen', 'tisdagen', 'onsdagen', 'torsdagen',
            'fredagen', 'l\u00F6rdagen', 's\u00F6ndagen'
        ],
        shortWeekdays: [
            'M\u00E5n', 'Tis', 'Ons', 'Tor','Fre', 'L\u00F6r', 'S\u00F6n'
        ],

        longDateFormat: 'dd mmmm yyyy',
        shortDateFormat: 'yyyy-mm-dd',

        unsupportedFeatures: 'Varning: Denna h\u00E4ndelse anv\u00E4nder funktionalitet ' +
                             'som denna dialog inte st\u00F6djer. Om du sparar kan ' +
                             'detta \u00E4ndra n\u00E4r h\u00E4ndelsen \u00E5terkommer.',
        noTemplateMatch: 'Hittar ingen \u00E5terkomstmall som passar',
        multipleDayOfMonth: '\u00C5terkomster med flera dagar st\u00F6ds inte i m\u00E5natlig eller \u00E5rlig \u00E5terkomst',
        bysetpos: 'BYSETPOS st\u00F6ds ej',
        noRule: 'Ingen RRULE funnen',
        noRepeatEvery: 'Fel: "\u00C5terkom var"-f\u00E4ltet m\u00E5ste vara mellan 1 och 1000',
        noEndDate: 'Fel: Slutdatum \u00E4r inte satt.',
        pastEndDate: 'Fel: Slutdatum kan inte vara f\u00F6re startdatum',
        noEndAfterNOccurrences: 'Fel: "Efter N \u00E5terkomster"-f\u00E4ltet m\u00E5ste vara mellan 1 och 1000',

        rtemplate: {
            daily: 'Varje dag',
            mondayfriday: 'M\u00E5ndag och Fredag',
            weekdays: 'Veckodag',
            weekly: 'Varje vecka',
            monthly: 'Varje m\u00E5nad',
            yearly: 'Varje \u00E5r'
        }
    });

    var rinput = $("textarea[name=repeat]").recurrenceinput({
        startField: "start",
        ajaxURL: document.URL,
        formOverlay: { speed: 1 },
        ributtonExtraClass: 'totally extra'
    });
    return rinput;
}

function rload2() {
    $.tools.recurrenceinput.setTemplates({
        daily: {
            rrule: 'FREQ=DAILY',
            fields: [
                'ridailyinterval',
                'rirangeoptions'
            ]
        },
        mowefr: {
            rrule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR',
            fields: ['rirangeoptions']
        },
        weekends: {
            rrule: 'FREQ=WEEKLY;BYDAY=SA,SU',
            fields: ['rirangeoptions']
        }
    },
    {
        en: {
            daily: 'Daily',
            mowefr: 'Mondays, Wednesdays, Fridays',
            weekends: 'Weekends'
        },
        sv: {
            daily: 'Dagligen',
            mowefr: 'M\u00E5ndagar, Onsdagar, Fredagar',
            weekends: 'Veckoslut'
        }
    });

    var rinput = $("textarea[name=repeat]").recurrenceinput({
        startField: "start",
        ajaxURL: document.URL,
        formOverlay: { speed: 1 }
    });
    return rinput;
}

function runload() {
    $("div.ridisplay").remove();
    $("textarea[name=repeat]").show();
}

function set_date_value(ele, date) {
    // set date on an input element.
    // date is in format: YYYY/MM/DD
    // for chromium 20 date inputs, we have to use YYYY-MM-DD
    ele.val(date);
    if (!ele.val()) {
        // Chrome 20 DATE input? Requires ISO format.
        ele.val(date.replace(/\//g, '-'));
    }
}


$(document).ready(function() {
    QUnit.start();
});

// TESTS

asyncTest("Basics", function () {
    expect(4);

    // This sets the text area rule, and opens the dialog box.
    var input = rload1();

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

    runload();
    start();
});

asyncTest("Invalid ical data", function () {
    expect(1);
    var input = rload1();

    // Looks valid, but it doens't contain the RRULE data:
    $("textarea[name=repeat]").val("FREQ=MONTHLY;COUNT=3");
    $('.repeatfield a[name=riedit]').click();
    ok(input.form.find('#messagearea').text().indexOf('No RRULE in RRULE data') !== -1);
    input.form.find('.risavebutton').click();

    runload();
    start();
});

asyncTest("No recurrence rule opens empty form with limited Recurrence Type to prevent unlimited Recurrences.", function () {
    expect(2);

    // This sets the text area rule, and opens the dialog box.
    var rrule = "";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();

    var input = rload1();
    ok(input.form.find('input[name=rirangetype]:checked').val() === 'BYOCCURRENCES');
    ok(input.form.find('input[name=rirangebyoccurrencesvalue]').val() === '10');
    input.form.find('.risavebutton').click();

    runload();
    start();
});

asyncTest("Daily recurrence with count", function () {
    expect(5);

    // This sets the text area rule, and opens the dialog box.
    var rrule = "RRULE:FREQ=DAILY;INTERVAL=5;COUNT=8";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();

    var input = rload1();
    ok(input.form.find('select[name=rirtemplate]').val() === 'daily');
    ok(input.form.find('input[name=ridailyinterval]').val() === '5');
    ok(input.form.find('input[name=rirangetype]:checked').val() === 'BYOCCURRENCES');
    ok(input.form.find('input[name=rirangebyoccurrencesvalue]').val() === '8');

    // And this saves it.
    input.form.find('.risavebutton').click();
    ok($("textarea[name=repeat]").val() === rrule);

    runload();
    start();
});

asyncTest("Weekly recurrence with days and end", function () {
    expect(12);

    // Set a recurrence rule and open the dialog box.
    var rrule = "RRULE:FREQ=WEEKLY;INTERVAL=4;BYDAY=TU,TH,FR;UNTIL=20120922T000000";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();

    var input = rload1();
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

    runload();
    start();
});

asyncTest("Bimonthly recurrence by month day", function () {
    expect(5);

    // Set a recurrence rule and open the dialog box.
    var rrule = "RRULE:FREQ=MONTHLY;INTERVAL=2;BYMONTHDAY=12";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();

    var input = rload1();
    ok(input.form.find('select[name=rirtemplate]').val() === 'monthly');
    ok(input.form.find('input[name=rimonthlytype]:checked').val() === 'DAYOFMONTH');
    ok(input.form.find('input[name=rimonthlyinterval]').val() === '2');
    ok(input.form.find('input[name=rirangetype]:checked').val() === 'NOENDDATE');

    input.form.find('.risavebutton').click();
    ok($("textarea[name=repeat]").val() === rrule);

    runload();
    start();
});

asyncTest("Trimonthly recurrence by day", function () {
    expect(7);

    // Set a recurrence rule and open the dialog box.
    var rrule = "RRULE:FREQ=MONTHLY;INTERVAL=3;BYDAY=+3TH";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();

    var input = rload1();
    ok(input.form.find('select[name=rirtemplate]').val() === 'monthly');
    ok(input.form.find('input[name=rimonthlytype]:checked').val() === 'WEEKDAYOFMONTH');
    ok(input.form.find('select[name=rimonthlyweekdayofmonthindex]').val() === '+3');
    ok(input.form.find('select[name=rimonthlyweekdayofmonth]').val() === 'TH');
    ok(input.form.find('input[name=rimonthlyinterval]').val() === '3');
    ok(input.form.find('input[name=rirangetype]:checked').val() === 'NOENDDATE');

    input.form.find('.risavebutton').click();
    ok($("textarea[name=repeat]").val() === rrule);

    runload();
    start();
});

asyncTest("Yearly by month day recurrence without end", function () {
    expect(7);

    // The second wednesday of April, forevah.
    var rrule = "RRULE:FREQ=YEARLY;INTERVAL=3;BYMONTH=4;BYMONTHDAY=11";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();

    var input = rload1();
    ok(input.form.find('select[name=rirtemplate]').val() === 'yearly');
    ok(input.form.find('input[name=riyearlyinterval]').val() === '3');
    ok(input.form.find('input[name=riyearlyType]:checked').val() === 'DAYOFMONTH');
    ok(input.form.find('select[name=riyearlydayofmonthmonth]').val() === '4');
    ok(input.form.find('select[name=riyearlydayofmonthday]').val() === '11');
    ok(input.form.find('input[name=rirangetype]:checked').val() === 'NOENDDATE');

    input.form.find('.risavebutton').click();
    ok($("textarea[name=repeat]").val() === rrule);

    runload();
    start();
});

asyncTest("Yearly byday recurrence without end", function () {
    expect(6);

    // The second wednesday of April, forevah.
    var rrule = "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();

    var input = rload1();
    ok(input.form.find('select[name=rirtemplate]').val() === 'yearly');
    ok(input.form.find('select[name=riyearlyweekdayofmonthindex]').val() === '+2');
    ok(input.form.find('select[name=riyearlyweekdayofmonthday]').val() === 'WE');
    ok(input.form.find('select[name=riyearlyweekdayofmonthmonth]').val() === '4');
    ok(input.form.find('input[name=rirangetype]:checked').val() === 'NOENDDATE');

    input.form.find('.risavebutton').click();
    ok($("textarea[name=repeat]").val() === rrule);

    runload();
    start();
});

asyncTest("Test of connected start field and showing of occurrences", function () {
    expect(1);

    // Set the start date to test the XML javascript stuff.
    set_date_value($("input[name=start]"), '2011/04/13');

    // The second wednesday of April, forevah.
    var input = rload1();
    var rrule = "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();
    var occurrences = input.form.find('div.occurrence');
    ok(occurrences.length === 10);

    input.form.find('.risavebutton').click();

    runload();
    start();
});

asyncTest("RDATE and EXDATE", function () {
    expect(12);

    // Set the start date to test the Ajax request stuff.
    set_date_value($("input[name=start]"), '2011/04/13');

    // The second wednesday of April, until 2020, except 2012, but also June 6th 2012
    var rrule = "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE;UNTIL=20180419T000000\nEXDATE:20120411T000000\nRDATE:20120606T000000";
    $("textarea[name=repeat]").val(rrule);

    var input = rload1();

    // Verify the list of dates
    stop(); // Delay this 1 second so the Ajax request can finish.
    setTimeout(function () {
        var occurrences = input.display.find('.rioccurrences .occurrence span');
        ok($.trim(occurrences[0].firstChild.data) === "April 13, 2011");
        ok($.trim(occurrences[8].firstChild.data) === "April 13, 2016");
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
        ok($.trim(occurrences[0].firstChild.data) === "April 13, 2011");
        ok($.trim(occurrences[8].firstChild.data) === "April 13, 2016");
        start();
    }, 1000);

    runload();
    start();
});

asyncTest("Adding RDATE", function () {
    expect(4);

    // Set the start date to test the Ajax request stuff.
    set_date_value($("input[name=start]"), '2011/04/13');

    // The second wednesday of April, until 2020, except 2012, but also June 6th 2012
    var input = rload1();
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

    runload();
    start();
});

asyncTest("Adding EXDATE", function () {
    expect(4);

    // Set the start date to test the Ajax request stuff.
    set_date_value($("input[name=start]"), '2011/04/13');

    // The second wednesday of April, until 2020, except 2012, but also June 6th 2012
    var input = rload1();
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

    runload();
    start();
});

asyncTest("Parameters get stripped, dates converted to date times, multiple row lines merged.", function () {
    // XXX: I suspect, but I have to verify this, that it should be the other way around.
    // We should force EXDATES and RDATES to by DATE's only.
    expect(1);
    var input = rload1();

    var rrule = "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE;\n UNTIL=20180419T000000\nEXDATE;VALUE=DATE:20120411\nRDATE;VALUE=DATE:20120606";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();
    input.form.find('.risavebutton').click();
    ok($("textarea[name=repeat]").val() === "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=+2WE;UNTIL=20180419T000000\nEXDATE:20120411T000000\nRDATE:20120606T000000");

    runload();
    start();
});

asyncTest("Field validations", function () {
    expect(49);

    // This sets the text area rule, and opens the dialog box.
    var rrule = "RRULE:FREQ=DAILY;INTERVAL=5;COUNT=8";
    $('textarea[name=repeat]').val(rrule);

    set_date_value($("input[name=start]"), '2011/12/13');

    $('.repeatfield a[name=riedit]').click();

    var input = rload1();

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
    input.form.find('input[name =rirangebyenddatecalendar]').val('');
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

    runload();
    start();
});

asyncTest("Unsupported features (incomplete)", function () {
    expect(13);
    var input = rload2();

    // No matching template
    $("textarea[name=custom]").val("RRULE:FREQ=MONTHLY;COUNT=3");
    $('.customfield a[name=riedit]').click();
    ok(input.form.find('#messagearea').text().indexOf('No matching recurrence template') !== -1);
    input.form.find('.risavebutton').click();

    input = rload1();
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

    runload();
    start();
});

asyncTest("Configure ributtonExtraClass.", function () {
    expect(4);

    var input = rload1();
    ok(input_1.form.find('input.ricancelbutton').attr('class') === 'ricancelbutton totally extra');
    ok(input_1.form.find('input.risavebutton').attr('class') === 'risavebutton totally extra');

    input = rload2();
    ok(input_2.form.find('input.ricancelbutton').attr('class') === 'ricancelbutton ');
    ok(input_2.form.find('input.risavebutton').attr('class') === 'risavebutton ');

    runload();
    start();
});

asyncTest("Pull-Request #9: Recurrence end date not properly saved.", function () {
    expect(1);
    set_date_value($("input[name=start]"), '2013/01/17');
    var rrule = "RRULE:FREQ=WEEKLY;BYDAY=TH;UNTIL=20130120T000000";
    $("textarea[name=repeat]").val(rrule);
    var input = rload1();

    ok(input.form.find('input[name=rirangebyenddatecalendar]').val() === '01/20/2013');

    runload();
    start();
});

asyncTest("Pull-Request #16: Trimonthly recurrence by day fix", function () {
    /* Pull-Request #16 fixes a parsing error with following valid RRULE:
     * "RRULE:FREQ=MONTHLY;INTERVAL=3;BYDAY=3TH"
     * it's returned to the Textarea as
     * "RRULE:FREQ=MONTHLY;INTERVAL=3;BYDAY=+1TH"
     * which is just wrong.
     * It should instead read:
     * "RRULE:FREQ=MONTHLY;INTERVAL=3;BYDAY=+3TH"
     * See: http://tools.ietf.org/html/rfc5545#section-3.3.10 how to define the
     * BYDAY Weekdaylist values.
     */
    expect(7);

    // Set a recurrence rule and open the dialog box.
    var rrule = "RRULE:FREQ=MONTHLY;INTERVAL=3;BYDAY=3TH";
    var rrule_fixed = "RRULE:FREQ=MONTHLY;INTERVAL=3;BYDAY=+3TH";
    $("textarea[name=repeat]").val(rrule);
    $('.repeatfield a[name=riedit]').click();

    var input = rload1();
    ok(input.form.find('select[name=rirtemplate]').val() === 'monthly');
    ok(input.form.find('input[name=rimonthlytype]:checked').val() === 'WEEKDAYOFMONTH');
    ok(input.form.find('select[name=rimonthlyweekdayofmonthindex]').val() === '+3');
    ok(input.form.find('select[name=rimonthlyweekdayofmonth]').val() === 'TH');
    ok(input.form.find('input[name=rimonthlyinterval]').val() === '3');
    ok(input.form.find('input[name=rirangetype]:checked').val() === 'NOENDDATE');

    input.form.find('.risavebutton').click();
    ok($("textarea[name=repeat]").val() === rrule_fixed);

    runload();
    start();
});
