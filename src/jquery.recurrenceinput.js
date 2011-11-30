/*jslint regexp: false, continue: true, indent: 4 */
/*global $, alert, jQuery */

(function ($) {
    $.tools = $.tools || {version: '@VERSION'};
    
    var tool;
    var LABELS = {};
    
    tool = $.tools.recurrenceinput = {
        conf: {
        
            lang: 'en',
            readOnly: false,
            
            // "REMOTE" FIELD
            startField: null,
            ajaxURL: null,
        
            // FORM OVERLAY
            formOverlay: {
                speed: 'fast',
                fixed: false
            },
        
            // JQUERY TEMPLATE NAMES
            template: {
                form: '#jquery-recurrenceinput-form-tmpl',
                display: '#jquery-recurrenceinput-display-tmpl'
            },
        
            // RECURRENCE TEMPLATES
            rtemplate: {
                daily: {
                    rrule: 'FREQ=DAILY',
                    fields: [
                        'ridailyinterval',
                        'rirangeoptions'
                    ]
                },
                mondayfriday: {
                    rrule: 'FREQ=WEEKLY;BYDAY=MO,FR',
                    fields: [
                        'rirangeoptions'
                    ]
                },
                weekdays: {
                    rrule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR',
                    fields: [
                        'rirangeoptions'
                    ]
                },
                weekly: {
                    rrule: 'FREQ=WEEKLY',
                    fields: [
                        'riweeklyinterval',
                        'riweeklyweekdays',
                        'rirangeoptions'
                    ]
                },
                monthly: {
                    rrule: 'FREQ=MONTHLY',
                    fields: [
                        'rimonthlyoptions',
                        'rirangeoptions'
                    ]
                },
                yearly: {
                    rrule: 'FREQ=YEARLY',
                    fields: [
                        'riyearlyoptions',
                        'rirangeoptions'
                    ]
                }
            }
        },
        
        localize: function (language, labels) {
            LABELS[language] = labels;        
        },
        
        setTemplates: function (templates, titles) {
            var lang, template;
            tool.conf.rtemplate = templates;
            for (lang in titles) {
                if (titles.hasOwnProperty(lang)) {
                    for (template in titles[lang]) {
                        if (titles[lang].hasOwnProperty(template)) {
                            LABELS[lang].rtemplate[template] = titles[lang][template];
                        }
                    }
                }
            }
        }
        
    };
    
    tool.localize("en", {
        displayUnactivate: 'Does not repeat',
        displayActivate: 'Repeats ',
        edit: 'Edit...',
        add:  'Add',
        
        recurrenceType: 'Recurrence type:',

        dailyInterval1: 'Every',
        dailyInterval2: 'days',

        weeklyInterval1: 'Every',
        weeklyInterval2: 'week(s)',
        weeklyWeekdays: 'On:',

        monthlyDayOfMonth1: 'Day',
        monthlyDayOfMonth2: 'of the month',
        monthlyDayOfMonth3: ', every',
        monthlyDayOfMonth4: 'month(s)',
        monthlyWeekdayOfMonth1: 'The',
        monthlyWeekdayOfMonth2: '',
        monthlyWeekdayOfMonth3: ', every',
        monthlyWeekdayOfMonth4: 'month(s)',

        yearlyDayOfMonth1: 'Every',
        yearlyDayOfMonth2: '',
        yearlyDayOfMonth3: '',
        yearlyWeekdayOfMonth1: 'The',
        yearlyWeekdayOfMonth2: '',
        yearlyWeekdayOfMonth3: 'of',
        yearlyWeekdayOfMonth4: '',
        
        range: 'End recurrance:',
        rangeNoEnd: 'No end',
        rangeByOccurrences1: 'Ending after',
        rangeByOccurrences2: 'occurrence(s)',
        rangeByEndDate: 'Until ',
        
        including: ', and also ',
        except: ', except for',

        cancel: 'Cancel',        
        save: 'Save',

        orderIndexes: ['First', 'Second', 'Third', 'Fourth', 'Last'],
        months: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'],
        shortMonths: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        weekdays: [
            'Monday', 'Tuesday', 'Wednesday', 'Thursday',
            'Friday', 'Saturday', 'Sunday'],
        shortWeekdays: [
            'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            
        longDateFormat: 'mmmm dd, yyyy',
        shortDateFormat: 'mm/dd/yyyy',
            
        unsupportedFeatures: 'Warning: This event uses recurrence features not ' +
                              'supported by this widget. Saving the recurrence ' +
                              'may change the recurrence in unintended ways:',
        noTemplateMatch: 'No matching recurrence template',
        multipleDayOfMonth: 'This widget does not support multiple days in monthly or yearly recurrence',
        bysetpos: 'BYSETPOS is not supported',
        noRule: 'No RRULE in RRULE data',
        
        rtemplate: {
            daily: 'Daily',
            mondayfriday: 'Mondays and Fridays',
            weekdays: 'Weekdays',
            weekly: 'Weekly',
            monthly: 'Monthly',
            yearly: 'Yearly'
        }
    });


    var OCCURRENCETMPL = ['<div class="rioccurrences">',
        '{{each occurrences}}',
            '<div class="occurrence">',
                '<span class="${occurrences[$index].type}">',
                    '${occurrences[$index].formattedDate}',
                '</span>',
                '{{if !readOnly}}',
                    '<span class="action">',
                        '{{if occurrences[$index].type === "rrule"}}',
                            '<a date="${occurrences[$index].date}" href="#"',
                               'class="${occurrences[$index].type}" >',
                                'Exclude',
                            '</a>',
                        '{{/if}}',
                        '{{if occurrences[$index].type === "rdate"}}',
                            '<a date="${occurrences[$index].date}" href="#"',
                               'class="${occurrences[$index].type}" >',
                                'Remove',
                            '</a>',
                        '{{/if}}',
                        '{{if occurrences[$index].type === "exdate"}}',
                            '<a date="${occurrences[$index].date}" href="#"',
                               'class="${occurrences[$index].type}" >',
                                'Include',
                            '</a>',
                        '{{/if}}',
                    '</span>',
                '{{/if}}',
            '</div>',
        '{{/each}}',
        '<div class="batching">',
            '{{each batch.batches}}',
                '{{if $index === batch.currentBatch}}<span class="current">{{/if}}',
                    '<a href="#" start="${batch.batches[$index][0]}">[${batch.batches[$index][0]} - ${batch.batches[$index][1]}]</a>',
                '{{if $index === batch.currentBatch}}</span>{{/if}}',
            '{{/each}}',
        '</div></div>'].join('\n');
    
    $.template('occurrenceTmpl', OCCURRENCETMPL);

    var DISPLAYTMPL = ['<div class="ridisplay">',
        '<div class="rimain">',
            '{{if !readOnly}}',
                '<input type="checkbox" name="richeckbox" />',
            '{{/if}}',
            '<label class="ridisplay">${i18n.displayUnactivate}</label>',
            '{{if !readOnly}}',
                '<a href="#" name="riedit">${i18n.edit}</a>',
            '{{/if}}',
        '</div>',
        '<div class="rioccurrences" style="display:none" /></div>'].join('\n');
        
    $.template('displayTmpl', DISPLAYTMPL);
    
    var FORMTMPL = ['<div class="riform">',
            '<form>',
                '<div id="messagearea" style="display: none;">',
                '</div>',
                '<div id="rirtemplate">',
                    '<label for="${name}rtemplate">',
                        '${i18n.recurrenceType}',
                        '<select name="rirtemplate">',
                            '{{each rtemplate}}',
                                '<option value="${$index}">${i18n.rtemplate[$index]}</value>',
                            '{{/each}}',
                        '</select>',
                    '</label>',
                '<div>',
                '<div id="riformfields">',
                    '<div id="ridailyinterval" class="rifield">',
                        '<label for="${name}dailyinterval">',
                            '${i18n.dailyInterval1}',
                            '<input type="text" size="2"',
                                'value="1"',
                                'name="ridailyinterval"',
                                'id="${name}dailyinterval" />',
                            '${i18n.dailyInterval2}',
                        '</label>',
                    '</div>',
                    '<div id="riweeklyinterval" class="rifield">',
                        '<label for="${name}weeklyinterval">',
                            '${i18n.weeklyInterval1}',
                            '<input type="text" size="2"',
                                'value="1"',
                                'name="riweeklyinterval"',
                                'id="${name}weeklyinterval"/>',
                            '${i18n.weeklyInterval2}',
                        '</label>',
                    '</div>',
                    '<div id="riweeklyweekdays" class="rifield">',
                        '<label for="${name}weeklyinterval">${i18n.weeklyWeekdays}</label>',
                        '{{each i18n.weekdays}}',
                            '<input type="checkbox"',
                                'name="riweeklyweekdays${weekdays[$index]}"',
                                'id="${name}weeklyWeekdays${weekdays[$index]}"',
                                'value="${weekdays[$index]}" />',
                            '<label for="${name}weeklyWeekdays${weekdays[$index]}">${$value}</label>',
                            '{{if $index==3}}<br/>{{/if}}',
                        '{{/each}}',
                        '</ul>',
                    '</div>',
                    '<div id="rimonthlyoptions" class="rifield">',
                        '<div>',
                            '<input',
                                'type="radio"',
                                'value="DAYOFMONTH"',
                                'name="rimonthlytype"',
                                'id="${name}monthlytype:DAYOFMONTH" />',
                            '<label for="${name}monthlytype:DAYOFMONTH">',
                                '${i18n.monthlyDayOfMonth1}',
                                '<select name="rimonthlydayofmonthday"',
                                    'id="${name}monthlydayofmonthday">',
                                '{{each [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,',
                                        '18,19,20,21,22,23,24,25,26,27,28,29,30,31]}}',
                                    '<option value="${$value}">${$value}</option>',
                                '{{/each}}',
                                '</select>',
                                '${i18n.monthlyDayOfMonth2}${i18n.monthlyDayOfMonth3}',
                                '<input type="text" size="2"',
                                    'value="1" ',
                                    'name="rimonthlydayofmonthinterval"/>',
                                '${i18n.monthlyDayOfMonth4}',
                            '</label>',
                        '</div>',
                        '<div>',
                            '<input',
                                'type="radio"',
                                'value="WEEKDAYOFMONTH"',
                                'name="rimonthlytype"',
                                'id="${name}monthlytype:WEEKDAYOFMONTH" />',
                            '<label for="${name}monthlytype:WEEKDAYOFMONTH">',
                                '${i18n.monthlyWeekdayOfMonth1}',
                                '<select name="rimonthlyweekdayofmonthindex">',
                                '{{each i18n.orderIndexes}}',
                                    '<option value="${orderIndexes[$index]}">${$value}</option>',
                                '{{/each}}',
                                '</select>',
                                '${i18n.monthlyWeekdayOfMonth2}',
                                '<select name="rimonthlyweekdayofmonth">',
                                '{{each i18n.weekdays}}',
                                    '<option value="${weekdays[$index]}">${$value}</option>',
                                '{{/each}}',
                                '</select>',
                                '${i18n.monthlyWeekdayOfMonth3}',
                                '<input type="text" size="2"',
                                    'value="1"',
                                    'name="rimonthlyweekdayofmonthinterval" />',
                                '${i18n.monthlyWeekdayOfMonth4}',
                            '</label>',
                        '</div>',
                    '</div>',
                    '<div id="riyearlyoptions" class="rifield">',
                        '<div>',
                            '<input',
                                'type="radio"',
                                'value="DAYOFMONTH"',
                                'name="riyearlyType"',
                                'id="${name}yearlytype:DAYOFMONTH" />',
                            '<label for="${name}yearlytype:DAYOFMONTH">',
                                '${i18n.yearlyDayOfMonth1}',
                                '<select name="riyearlydayofmonthmonth">',
                                '{{each i18n.months}}',
                                    '<option value="${$index+1}">${$value}</option>',
                                '{{/each}}',
                                '</select>',
                                '${i18n.yearlyDayOfMonth2}',
                                '<select name="riyearlydayofmonthday">',
                                '{{each [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,',
                                        '18,19,20,21,22,23,24,25,26,27,28,29,30,31]}}',
                                    '<option value="${$value}">${$value}</option>',
                                '{{/each}}',
                                '</select>',
                                '${i18n.yearlyDayOfMonth3}',
                            '</label>',
                        '</div>',
                        '<div>',
                            '<input',
                                'type="radio"',
                                'value="WEEKDAYOFMONTH"',
                                'name="riyearlyType"',
                                'id="${name}yearlytype:WEEKDAYOFMONTH"/>',
                            '<label for="${name}yearlytype:WEEKDAYOFMONTH">',
                                '${i18n.yearlyWeekdayOfMonth1}',
                            '</label>',
                            '<select name="riyearlyweekdayofmonthindex">',
                            '{{each i18n.orderIndexes}}',
                                '<option value="${orderIndexes[$index]}">${$value}</option>',
                            '{{/each}}',
                            '</select>',
                            '<label for="${name}yearlytype:WEEKDAYOFMONTH">',
                                '${i18n.yearlyWeekdayOfMonth2}',
                                '<select name="riyearlyweekdayofmonthday">',
                                '{{each i18n.weekdays}}',
                                    '<option value="${weekdays[$index]}">${$value}</option>',
                                '{{/each}}',
                                '</select>',
                                '${i18n.yearlyWeekdayOfMonth3}',
                                '<select name="riyearlyweekdayofmonthmonth">',
                                '{{each i18n.months}}',
                                    '<option value="${$index+1}">${$value}</option>',
                                '{{/each}}',
                                '</select>',
                                '${i18n.yearlyWeekdayOfMonth4}',
                            '</label>',
                        '</div>',
                    '</div>',
                    '<div id="rirangeoptions" class="rifield">',
                        '<label>${i18n.range}</label>',
                        '<div>',
                            '<input',
                                'type="radio"',
                                'value="NOENDDATE"',
                                'name="rirangetype"',
                                'id="${name}rangetype:NOENDDATE"/>',
                            '<label for="${name}rangetype:NOENDDATE">',
                                '${i18n.rangeNoEnd}',
                            '</label>',
                        '</div>',
                        '<div>',
                            '<input',
                                'type="radio"',
                                'value="BYOCCURRENCES"',
                                'name="rirangetype"',
                                'id="${name}rangetype:BYOCCURRENCES"/>',
                            '<label for="${name}rangetype:BYOCCURRENCES">',
                                '${i18n.rangeByOccurrences1}',
                                '<input',
                                    'type="text" size="3"',
                                    'value="10"',
                                    'name="rirangebyoccurrencesvalue" />',
                                '${i18n.rangeByOccurrences2}',
                            '</label>',
                        '</div>',
                        '<div>',
                            '<input',
                                'type="radio"',
                                'value="BYENDDATE"',
                                'name="rirangetype"',
                                'id="${name}rangetype:BYENDDATE"/>',
                            '<label for="${name}rangetype:BYENDDATE">',
                                '${i18n.rangeByEndDate}',
                            '</label>',
                            '<input',
                                'type="date"',
                                'name="rirangebyenddatecalendar" />',
                        '</div>',
                    '</div>',
                '</div>',
                '<div class="rioccurrencesactions">',
                    '<div>',
                        '<span class="riaddoccurrence">',
                            '<input type="date" name="adddate" id="adddate" />',
                            '<input type="button" name="addaction" id="addaction" value="${i18n.add}">',
                        '</span>',
                        '<span class="refreshbutton action">',
                            '<a class="rirefreshbutton" href="#" >',
                                'Refresh',
                            '</a>',
                        '</span>',
                    '</div>',
                '</div>',
                '<div class="rioccurrences">',
                '</div>',
                '<div class="ributtons">',
                    '<input',
                        'type="submit"',
                        'class="ricancelbutton"',
                        'value="${i18n.cancel}" />',
                    '<input',
                        'type="submit"',
                        'class="risavebutton"',
                        'value="${i18n.save}" />',
                '</div>',
            '</form></div>'].join('\n');
    
    $.template('formTmpl', FORMTMPL);
    
    // Formatting function (mostly) from jQueryTools dateinput
    var Re = /d{1,4}|m{1,4}|yy(?:yy)?|"[^"]*"|'[^']*'/g;
    
    function zeropad(val, len) {
        val = val.toString();
        len = len || 2;
        while (val.length < len) { val = "0" + val; }
        return val;
    }  
    
    function format(date, fmt, conf) {
            
        var d = date.getDate(),
            D = date.getDay(),
            m = date.getMonth(),
            y = date.getFullYear(),

            flags = {
                d:    d,
                dd:   zeropad(d),
                ddd:  conf.i18n.shortWeekdays[D],
                dddd: conf.i18n.weekdays[D],
                m:    m + 1,
                mm:   zeropad(m + 1),
                mmm:  conf.i18n.shortMonths[m],
                mmmm: conf.i18n.months[m],
                yy:   String(y).slice(2),
                yyyy: y
            };

        var result = fmt.replace(Re, function ($0) {
            return flags.hasOwnProperty($0) ? flags[$0] : $0.slice(1, $0.length - 1);
        });
        
        return result;
            
    }
    
    /**
     * Parsing RFC5545 from widget
     */
    function widgetSaveToRfc5545(form, conf, tz) {
        var value = form.find('select[name=rirtemplate]').val();
        var rtemplate = conf.rtemplate[value];
        var result = rtemplate.rrule;
        var human = conf.i18n.rtemplate[value];
        var field, input, weekdays, i18nweekdays, i, j, index, tmp;
        var day, month, year, interval, yearlyType, occurrences, date;
        
        for (i = 0; i < rtemplate.fields.length; i++) {
            field = form.find('#' + rtemplate.fields[i]);
            
            switch (field.attr('id')) {
            
            case 'ridailyinterval':
                input = field.find('input[name=ridailyinterval]');
                result += ';INTERVAL=' + input.val();
                human = conf.i18n.dailyInterval1 + ' ' + input.val() + ' ' + conf.i18n.dailyInterval2;
                break;
                
            case 'riweeklyinterval':
                input = field.find('input[name=riweeklyinterval]');
                result += ';INTERVAL=' + input.val();
                human = conf.i18n.weeklyInterval1 + ' ' + input.val() + ' ' + conf.i18n.weeklyInterval2;
                break;
                
            case 'riweeklyweekdays':
                weekdays = '';
                i18nweekdays = '';
                for (j = 0; j < conf.weekdays.length; j++) {
                    input = field.find('input[name=riweeklyweekdays' + conf.weekdays[j] + ']');
                    if (input.is(':checked')) {
                        if (weekdays) {
                            weekdays += ',';
                            i18nweekdays += ', ';
                        }
                        weekdays += conf.weekdays[j];
                        i18nweekdays += conf.i18n.weekdays[j];
                    }
                }
                if (weekdays) {
                    result += ';BYDAY=' + weekdays;
                    human += ' ' + conf.i18n.weeklyWeekdays + ' ' + i18nweekdays;
                }
                break;
                
            case 'rimonthlyoptions':
                var monthlyType = $('input[name=rimonthlytype]:checked', form).val();
                switch (monthlyType) {
                
                case 'DAYOFMONTH':
                    day = $('select[name=rimonthlydayofmonthday]', form).val();
                    interval = $('input[name=rimonthlydayofmonthinterval]', form).val();
                    result += ';BYMONTHDAY=' + day;
                    result += ';INTERVAL=' + interval;                        
                    human += ', ' + conf.i18n.monthlyDayOfMonth1 + ' ' + day + ' ' + conf.i18n.monthlyDayOfMonth2;
                    if (interval !== 1) {
                        human += conf.i18n.monthlyDayOfMonth3 + ' ' + interval + ' ' + conf.i18n.monthlyDayOfMonth4;
                    }
                    break;
                case 'WEEKDAYOFMONTH':
                    index = $('select[name=rimonthlyweekdayofmonthindex]', form).val();
                    day = $('select[name=rimonthlyweekdayofmonth]', form).val();
                    interval = $('input[name=rimonthlyweekdayofmonthinterval]', form).val();
                    if ($.inArray(day, ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']) > -1) {
                        result += ';BYDAY=' + index + day;
                        human += ', ' + conf.i18n.monthlyWeekdayOfMonth1 + ' ';
                        human += ' ' + conf.i18n.orderIndexes[conf.orderIndexes.indexOf(index)];
                        human += ' ' + conf.i18n.monthlyWeekdayOfMonth2;
                        human += ' ' + conf.i18n.weekdays[conf.weekdays.indexOf(day)];
                    }
                    result += ';INTERVAL=' + interval;
                    if (interval !== 1) {
                        human += ' ' + conf.i18n.monthlyWeekdayOfMonth3 + ' ' + interval + ' ' + conf.i18n.monthlyWeekdayOfMonth4;
                    }
                    break;
                }
                break;
                
            case 'riyearlyoptions':
                yearlyType = $('input[name=riyearlyType]:checked', form).val();
                switch (yearlyType) {
                
                case 'DAYOFMONTH':
                    month = $('select[name=riyearlydayofmonthmonth]', form).val();
                    day = $('select[name=riyearlydayofmonthday]', form).val();
                    result += ';BYMONTH=' + month;
                    result += ';BYMONTHDAY=' + day;
                    human += ', ' + conf.i18n.months[month - 1] + ' ' + day;
                    break;
                case 'WEEKDAYOFMONTH':
                    index = $('select[name=riyearlyweekdayofmonthindex]', form).val();
                    day = $('select[name=riyearlyweekdayofmonthday]', form).val();
                    month = $('select[name=riyearlyweekdayofmonthmonth]', form).val();
                    result += ';BYMONTH=' + month;
                    if ($.inArray(day, ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']) > -1) {
                        result += ';BYDAY=' + index + day;
                        human += ', ' + conf.i18n.yearlyWeekdayOfMonth1;
                        human += ' ' + conf.i18n.orderIndexes[conf.orderIndexes.indexOf(index)];
                        human += ' ' + conf.i18n.yearlyWeekdayOfMonth2;
                        human += ' ' + conf.i18n.weekdays[conf.weekdays.indexOf(day)];
                        human += ' ' + conf.i18n.yearlyWeekdayOfMonth3;
                        human += ' ' + conf.i18n.months[month - 1];
                        human += ' ' + conf.i18n.yearlyWeekdayOfMonth4;
                    }
                    break;
                }
                break;
                
            case 'rirangeoptions':
                var rangeType = form.find('input[name=rirangetype]:checked').val();
                switch (rangeType) {
                
                case 'BYOCCURRENCES':
                    occurrences = form.find('input[name=rirangebyoccurrencesvalue]').val();
                    result += ';COUNT=' + occurrences;
                    human += ', ' + conf.i18n.rangeByOccurrences1;
                    human += ' ' + occurrences;
                    human += ' ' + conf.i18n.rangeByOccurrences2;
                    break;
                case 'BYENDDATE':
                    field = form.find('input[name=rirangebyenddatecalendar]');
                    date = field.data('dateinput').getValue('yyyymmdd');
                    result += ';UNTIL=' + date + 'T000000';
                    if (tz === true) {
                        // Make it UTC:
                        result += 'Z';
                    }
                    human += ', ' + conf.i18n.rangeByEndDate;
                    human += ' ' + field.data('dateinput').getValue(conf.i18n.longDateFormat);
                    break;
                }
                break;
            }
        }
        
        if (form.ical.RDATE !== undefined && form.ical.RDATE.length > 0) {
            form.ical.RDATE.sort();
            tmp = [];
            for (i = 0; i < form.ical.RDATE.length; i++) {
                if (form.ical.RDATE[i] !== '') {
                    year = parseInt(form.ical.RDATE[i].substring(0, 4), 10);
                    month = parseInt(form.ical.RDATE[i].substring(4, 6), 10) - 1;
                    day = parseInt(form.ical.RDATE[i].substring(6, 8), 10);
                    tmp.push(format(new Date(year, month, day), conf.i18n.longDateFormat, conf));
                }
            }
            if (tmp.length !== 0) {
                human = human + conf.i18n.including + ' ' + tmp.join('; ');
            }
        }
        
        if (form.ical.EXDATE !== undefined && form.ical.EXDATE.length > 0) {
            form.ical.EXDATE.sort();
            tmp = [];
            for (i = 0; i < form.ical.EXDATE.length; i++) {
                if (form.ical.EXDATE[i] !== '') {
                    year = parseInt(form.ical.EXDATE[i].substring(0, 4), 10);
                    month = parseInt(form.ical.EXDATE[i].substring(4, 6), 10) - 1;
                    day = parseInt(form.ical.EXDATE[i].substring(6, 8), 10);
                    tmp.push(format(new Date(year, month, day), conf.i18n.longDateFormat, conf));
                }
            }
            if (tmp.length !== 0) {
                human = human + conf.i18n.except + ' ' + tmp.join('; ');
            }
        }
        result = 'RRULE:' + result;
        if (form.ical.EXDATE !== undefined && form.ical.EXDATE.join() !== "") {
            if (tz === true) {
                // Make it UTC:
                tmp = form.ical.EXDATE.map(function (x) {
                    if (x.length === 8) { // DATE format. Make it DATE-TIME
                        x += 'T000000';
                    }
                    return x + 'Z'; 
                });
            } else {
                tmp = form.ical.EXDATE;
            }
            result = result + '\nEXDATE:' + tmp;
        }
        if (form.ical.RDATE !== undefined && form.ical.RDATE.join() !== "") {
            if (tz === true) {
                // Make it UTC:
                tmp = form.ical.RDATE.map(function (x) {
                    if (x.length === 8) { // DATE format. Make it DATE-TIME
                        x += 'T000000';
                    }
                    return x + 'Z';
                });
            } else {
                tmp = form.ical.RDATE;
            }
            result = result + '\nRDATE:' + tmp;
        }
        return {result: result, description: human};
    }

    function parseLine(icalline) {
        var result = {};
        var pos = icalline.indexOf(':');
        var property = icalline.substring(0, pos);
        result.value = icalline.substring(pos + 1);
        
        if (property.indexOf(';') !== -1) {
            pos = property.indexOf(';');
            result.parameters = property.substring(pos + 1);
            result.property = property.substring(0, pos);
        } else {
            result.parameters = null;
            result.property = property;
        }
        return result;
    }
    
    function cleanDates(dates) {
        // Get rid of timezones
        // TODO: We could parse dates and range here, maybe?
        var result = [];
        var splitDates = dates.split(',');
        var date;
        
        for (date in splitDates) {
            if (splitDates.hasOwnProperty(date)) {
                if (splitDates[date].indexOf('Z') !== -1) {
                    result.push(splitDates[date].substring(0, 15));
                } else {
                    result.push(splitDates[date]);
                }
            }
        }
        return result;
    }
    
    function parseIcal(icaldata) {
        var lines = [];
        var result = {};
        var propAndValue = [];
        var line = null;
        var nextline;
        
        lines = icaldata.split('\n');
        lines.reverse();
        while (true) {
            if (lines.length > 0) {
                nextline = lines.pop();
                if (nextline.charAt(0) === ' ' || nextline.charAt(0) === '\t') {
                    // Line continuation:
                    line = line + nextline;
                    continue;
                }
            } else {
                nextline = '';
            }
            
            // New line; the current one is finished, add it to the result.
            if (line !== null) { 
                line = parseLine(line);
                 // We ignore properties for now
                if (line.property === 'RDATE' || line.property === 'EXDATE') {
                    result[line.property] = cleanDates(line.value);
                } else {
                    result[line.property] = line.value;
                }
            }
            
            line = nextline;
            if (line === '') {
                break;
            }
        }
        return result;
    }
    
    function widgetLoadFromRfc5545(form, conf, icaldata) {
        var unsupportedFeatures = [];
        var i, matches, match, matchIndex, rtemplate, d, input, index;
        var selector, selectors, field, radiobutton, start, end;
        var interval, byday, bymonth, bymonthday, count, until;
        var day, month, year, weekday, ical;

        form.ical = parseIcal(icaldata);
        if (form.ical.RRULE === undefined) {
            unsupportedFeatures.push(conf.i18n.noRule);
        } else {
  
        
            matches = /INTERVAL=([0-9]+);?/.exec(form.ical.RRULE);
            if (matches) {
                interval = matches[1];
            } else {
                interval = '1';
            }
        
            matches = /BYDAY=([^;]+);?/.exec(form.ical.RRULE);
            if (matches) {
                byday = matches[1];
            } else {
                byday = '';
            }
            
            matches = /BYMONTHDAY=([^;]+);?/.exec(form.ical.RRULE);
            if (matches) {
                bymonthday = matches[1].split(",");
            } else {
                bymonthday = null;
            }
        
            matches = /BYMONTH=([^;]+);?/.exec(form.ical.RRULE);
            if (matches) {
                bymonth = matches[1].split(",");
            } else {
                bymonth = null;
            }
        
            matches = /COUNT=([0-9]+);?/.exec(form.ical.RRULE);
            if (matches) {
                count = matches[1];
            } else {
                count = null;
            }
            
            matches = /UNTIL=([0-9T]+);?/.exec(form.ical.RRULE);
            if (matches) {
                until = matches[1];
            } else {
                until = null;
            }
    
            matches = /BYSETPOS=([^;]+);?/.exec(form.ical.RRULE);
            if (matches) {
                unsupportedFeatures.push(conf.i18n.bysetpos);
            }
    
            // Find the best rule:
            match = '';
            matchIndex = null;
            for (i in conf.rtemplate) {
                if (conf.rtemplate.hasOwnProperty(i)) {
                    rtemplate = conf.rtemplate[i];
                    if (form.ical.RRULE.indexOf(rtemplate.rrule) === 0) {
                        if (form.ical.RRULE.length > match.length) {
                            // This is the best match so far
                            match = form.ical.RRULE;
                            matchIndex = i;
                        }
                    }  
                }
            }
            
            if (match) {
                rtemplate = conf.rtemplate[matchIndex];
                // Set the selector:
                selector = form.find('select[name=rirtemplate]').val(matchIndex);
            } else {
                for (rtemplate in conf.rtemplate) {
                    if (conf.rtemplate.hasOwnProperty(rtemplate)) {
                        rtemplate = conf.rtemplate[rtemplate];
                        break;
                    }
                }
                unsupportedFeatures.push(conf.i18n.noTemplateMatch);
            }
            
            for (i = 0; i < rtemplate.fields.length; i++) {
                field = form.find('#' + rtemplate.fields[i]);
                switch (field.attr('id')) {
                
                case 'ridailyinterval':
                    field.find('input[name=ridailyinterval]').val(interval);
                    break;  
                    
                case 'riweeklyinterval':
                    field.find('input[name=riweeklyinterval]').val(interval);
                    break;
                    
                case 'riweeklyweekdays':
                    for (d = 0; d < conf.weekdays.length; d++) {
                        day = conf.weekdays[d];
                        input = field.find('input[name=riweeklyweekdays' + day + ']');
                        input.attr('checked', byday.indexOf(day) !== -1);
                    }
                    break;
                    
                case 'rimonthlyoptions':
                    var monthlyType = 'DAYOFMONTH'; // Default to using BYMONTHDAY
                    
                    if (bymonthday) {
                        monthlyType = 'DAYOFMONTH';
                        if (bymonthday.length > 1) {
                            // No support for multiple days in one month
                            unsupportedFeatures.push(conf.i18n.multipleDayOfMonth);
                            // Just keep the first
                            bymonthday = bymonthday[0];
                        }
                        field.find('select[name=rimonthlydayofmonthday]').val(bymonthday);
                        field.find('input[name=rimonthlydayofmonthinterval]').val(interval);
                    }
        
                    if (byday) {
                        monthlyType = 'WEEKDAYOFMONTH';
                        
                        if (byday.indexOf(',') !== -1) {
                            // No support for multiple days in one month
                            unsupportedFeatures.push(conf.i18n.multipleDayOfMonth);
                            byday = byday.split(",")[0];
                        }
                        index = byday.slice(0, -2);
                        weekday = byday.slice(-2);
                        field.find('select[name=rimonthlyweekdayofmonthindex]').val(index);
                        field.find('select[name=rimonthlyweekdayofmonth]').val(weekday);
                        field.find('input[name=rimonthlyweekdayofmonthinterval]').val(interval);
                    }
                    
                    selectors = field.find('input[name=rimonthlytype]');
                    for (index = 0; index < selectors.length; index++) {
                        radiobutton = selectors[index];
                        $(radiobutton).attr('checked', radiobutton.value === monthlyType);
                    }
                    break;
        
                case 'riyearlyoptions':
                    var yearlyType = 'DAYOFMONTH'; // Default to using BYMONTHDAY
                    
                    if (bymonthday) {
                        yearlyType = 'DAYOFMONTH';
                        if (bymonthday.length > 1) {
                            // No support for multiple days in one month
                            unsupportedFeatures.push(conf.i18n.multipleDayOfMonth);
                            bymonthday = bymonthday[0];
                        }
                        field.find('select[name=riyearlydayofmonthmonth]').val(bymonth);                    
                        field.find('select[name=riyearlydayofmonthday]').val(bymonthday);                    
                    }
        
                    if (byday) {
                        yearlyType = 'WEEKDAYOFMONTH';
                        
                        if (byday.indexOf(',') !== -1) {
                            // No support for multiple days in one month
                            unsupportedFeatures.push(conf.i18n.multipleDayOfMonth);
                            byday = byday.split(",")[0];
                        }
                        index = byday.slice(0, -2);
                        weekday = byday.slice(-2);
                        field.find('select[name=riyearlyweekdayofmonthindex]').val(index);
                        field.find('select[name=riyearlyweekdayofmonthday]').val(weekday);
                        field.find('select[name=riyearlyweekdayofmonthmonth]').val(bymonth);
                    }
                    
                    selectors = field.find('input[name=riyearlyType]');
                    for (index = 0; index < selectors.length; index++) {
                        radiobutton = selectors[index];
                        $(radiobutton).attr('checked', radiobutton.value === yearlyType);
                    }
                    break;
                    
                case 'rirangeoptions':
                    var rangeType = 'NOENDDATE';
                    
                    if (count) {
                        rangeType = 'BYOCCURRENCES';
                        field.find('input[name=rirangebyoccurrencesvalue]').val(count);
                    }
                    
                    if (until) {
                        rangeType = 'BYENDDATE';
                        input = field.find('input[name=rirangebyenddatecalendar]');
                        year = until.slice(0, 4);
                        month = until.slice(4, 6);
                        month = parseInt(month, 10) - 1;
                        day = until.slice(6, 8);
                        input.data('dateinput').setValue(year, month, day);
                    }
                    
                    selectors = field.find('input[name=rirangetype]');
                    for (index = 0; index <  selectors.length; index++) {
                        radiobutton = selectors[index];
                        $(radiobutton).attr('checked', radiobutton.value === rangeType);
                    }
                    break;
                }
            }
        }
        
        var messagearea = form.find('#messagearea');
        if (unsupportedFeatures.length !== 0) {
            messagearea.text(conf.i18n.unsupportedFeatures + ' ' + unsupportedFeatures.join('; '));
            messagearea.show();
        } else {
            messagearea.text('');
            messagearea.hide();
        }
    
    }
    
    /**
     * RecurrenceInput - form, display and tools for recurrenceinput widget
     */
    function RecurrenceInput(conf, textarea) {

        var self = this;
        var form, display;

        // Extend conf with non-configurable data used by templates.
        $.extend(conf, {
            orderIndexes: ['+1', '+2', '+3', '+4', '-1'],
            weekdays: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']
        });
        
        // The recurrence type dropdown should show certain fields depending
        // on selection:        
        function displayFields(selector) {
            var i;
            // First hide all the fields
            form.find('.rifield').hide();
            // Then show the ones that should be shown.
            var value = selector.val();
            if (value) {
                var rtemplate = conf.rtemplate[value];
                for (i = 0; i < rtemplate.fields.length; i++) {
                    form.find('#' + rtemplate.fields[i]).show();
                }
            }
        }

        function occurrenceExclude(event) {
            event.preventDefault();
            form.ical.EXDATE.push(this.attributes.date.value);
            this.attributes['class'].value = 'exdate';
            $(this).unbind(event);
            $(this).click(occurrenceInclude);
        }

        function occurrenceInclude(event) {
            event.preventDefault();
            form.ical.EXDATE.splice(form.ical.EXDATE.indexOf(this.attributes.date.value), 1);
            this.attributes['class'].value = 'rrule';
            $(this).unbind(event);
            $(this).click(occurrenceExclude);
        }
        
        function occurrenceDelete(event) {
            event.preventDefault();
            form.ical.RDATE.splice(form.ical.RDATE.indexOf(this.attributes.date.value), 1);
            $(this).parent().parent().hide('slow', function () {
                $(this).remove();
            });
        }
        
        function occurrenceAdd(event) {
            event.preventDefault();
            var dateinput = form
                .find('span.riaddoccurrence input#adddate')
                .data('dateinput');
            var datevalue = dateinput.getValue('yyyymmddT000000');
            form.ical.RDATE.push(datevalue);
            var html = ['<div class="occurrence" style="display: none;">',
                    '<span class="rdate">',
                        dateinput.getValue(conf.i18n.longDateFormat),
                    '</span>',
                    '<span class="action">',
                        '<a date="' + datevalue + '" href="#" class="rdate" >',
                            'Include',
                        '</a>',
                    '</span>',
                    '</div>'].join('\n');
            form.find('div.rioccurrences').prepend(html);
            $(form.find('div.rioccurrences div')[0]).slideDown();
            $(form.find('div.rioccurrences .action a.rdate')[0]).click(occurrenceDelete);
        }
        
        // element is where to find the tag in question. Can be the form
        // or the display widget. Defaults to the form.
        function loadOccurrences(startdate, rfc5545, start, readonly) {
            var element, occurrenceDiv;
            
            if (!readonly) {
                element = form;
            } else {
                element = display;
            }
            
            occurrenceDiv = element.find('.rioccurrences');
            occurrenceDiv.hide();
            
            
            $.ajax({
                url: conf.ajaxURL,
                async: false, // Can't be tested if it's asynchronous, annoyingly.
                type: 'post',
                dataType: 'json',
                data: {year: startdate.getFullYear(),
                       month: startdate.getMonth() + 1, // Sending January as 0? I think not.
                       day: startdate.getDate(),
                       rrule: rfc5545,
                       format: conf.i18n.longDateFormat,
                       start: start},
                success: function (data, status, jqXHR) {
                    var result, element;
                    
                    if (!readonly) {
                        element = form;
                    } else {
                        element = display;
                    }
                    data.readOnly = readonly;
                    result = $.tmpl('occurrenceTmpl', data);
                    occurrenceDiv = element.find('.rioccurrences');
                    occurrenceDiv.replaceWith(result);
                    
                    // Add the batch actions:
                    element.find('.rioccurrences .batching a').click(
                        function (event) {
                            event.preventDefault();
                            loadOccurrences(startdate, rfc5545, this.attributes.start.value, readonly);
                        }
                    );

                    // Add the delete/undelete actions:
                    if (!readonly) {
                        element.find('.rioccurrences .action a.rrule').click(occurrenceExclude);
                        element.find('.rioccurrences .action a.exdate').click(occurrenceInclude);
                        element.find('.rioccurrences .action a.rdate').click(occurrenceDelete);
                    }
                    // Show the new div
                    element.find('.rioccurrences').show();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert(textStatus);
                }
            });
        }
        
        function findStartDate() {
            var startField, startdate;
            // Find the default byday and bymonthday from the start date, if any:
            if (conf.startField) {
                // Se if it is a field already
                startField = $(conf.startField);
                if (!startField.length) {
                    // Otherwise, we assume it's an id:
                    startField = $('input[id=' + conf.startField + ']');
                }
                
                // Now we have a field, see if it is a dateinput field:
                startdate = startField.data('dateinput');
                if (startdate === undefined || startdate === null) {
                    //No, it wasn't, just try to interpret it with Date()
                    startdate = startField.val();
                } else {
                    // Yes it was, get the date:
                    startdate = startdate.getValue();
                }
                startdate = new Date(startdate);
                
                if (isNaN(startdate)) {
                    return null;
                }
                return startdate;
            }
            return null;
        }
        // Loading (populating) display and form widget with
        // passed RFC5545 string (data)
        function loadData(rfc5545) {
            var selector, format, startField, startdate, dayindex, day;

            if (rfc5545) {
                widgetLoadFromRfc5545(form, conf, rfc5545);
                // check checkbox
                display.find('input[name=richeckbox]')
                    .attr('checked', true);
            }

            startdate = findStartDate();
            
            if (startdate !== null) {
                // If the date is a real date, set the defaults in the form
                form.find('select[name=rimonthlydayofmonthday]').val(startdate.getDate());
                dayindex = conf.orderIndexes[Math.floor((startdate.getDate() - 1) / 7)];
                day = conf.weekdays[startdate.getDay() - 1];
                form.find('select[name=rimonthlyweekdayofmonthindex]').val(dayindex);
                form.find('select[name=rimonthlyweekdayofmonth]').val(day);

                form.find('select[name=riyearlydayofmonthmonth]').val(startdate.getMonth() + 1);
                form.find('select[name=riyearlydayofmonthday]').val(startdate.getDate());                    
                form.find('select[name=riyearlyweekdayofmonthindex]').val(dayindex);
                form.find('select[name=riyearlyweekdayofmonthday]').val(day);
                form.find('select[name=riyearlyweekdayofmonthmonth]').val(startdate.getMonth() + 1);
                
                // Now when we have a start date, we can also do an ajax call to calculate occurrences:
                loadOccurrences(startdate, widgetSaveToRfc5545(form, conf, false).result, 0, false);
                
                // Show the add and refresh buttons:
                form.find('div.rioccurrencesactions').show();
                
            } else {
                // No EXDATE/RDATE support
                form.find('div.rioccurrencesactions').hide();
            }

            
            selector = form.find('select[name=rirtemplate]');
            displayFields(selector);            
        }
        
        function recurrenceOn() {
            var RFC5545 = widgetSaveToRfc5545(form, conf, true);
            var label = display.find('label[class=ridisplay]');
            label.text(conf.i18n.displayActivate + ' ' + RFC5545.description);
            textarea.val(RFC5545.result);
            var startdate = findStartDate();
            if (startdate !== null) {
                loadOccurrences(startdate, widgetSaveToRfc5545(form, conf, false).result, 0, true);
            }
        }

        function recurrenceOff() {
            var label = display.find('label[class=ridisplay]');
            label.text(conf.i18n.displayUnactivate);
            textarea.val('');
            display.find('.rioccurrences').hide();
        }

        function toggleRecurrence(e) {
            var checkbox = display.find('input[name=richeckbox]');
            if (checkbox.is(':checked')) {
                recurrenceOn();
            } else {
                recurrenceOff();
            }
        }

        function save(event) {
            event.preventDefault();
            // close overlay
            form.overlay().close();
            // check checkbox
            display.find('input[name=richeckbox]')
                .attr('checked', true);
            recurrenceOn();
        }

        function cancel(event) {
            event.preventDefault();
            // close overlay
            form.overlay().close();
        }

        /* 
          Load the templates
        */

        display = $.tmpl('displayTmpl', conf);
        form = $.tmpl('formTmpl', conf);

        //// The overlay = form popup
        //if ($.template.riform === undefined) {
            //$.ajax({
                //url: $(conf.template.form)[0].src,
                //async: false,
                //success: function (data) {
                    //conf.template.form = data;
                //},
                //error: function (request, status, error) {
                    //alert(error.message + ": " + error.filename);
                //}
            //});
            //$(conf.template.form).template('riform');
        //}
        //form = $.tmpl('riform', conf);
        // Make an overlay and hide it
        form.overlay(conf.formOverlay).hide();
        form.ical = {};
        
        // Make the date input into a calendar dateinput()
        form.find('input[name=rirangebyenddatecalendar]').dateinput({
            selectors: true,
            format: conf.i18n.shortDateFormat,
            yearRange: [-5, 10]
        });

        if (textarea.val()) {
            widgetLoadFromRfc5545(form, conf, textarea.val());
            recurrenceOn();
        }

        /* 
          Do all the GUI stuff:
        */
        
        // When you click on the checkbox, recurrence should toggle on/off.
        display.find('input[name=richeckbox]').click(toggleRecurrence);

        // Show form overlay when you click on the "Edit..." link
        display.find('a[name=riedit]').click(
            function (e) {
                // Load the form to set up the right fields to show, etc.
                loadData(textarea.val());
                e.preventDefault();
                form.overlay().load();
            }
        );

        // Pop up the little add form when clicking "Add..."
        form.find('span.riaddoccurrence input#adddate').dateinput({
            selectors: true,
            format: conf.i18n.shortDateFormat,
            yearRange: [-5, 10]
        });
        form.find('input#addaction').click(occurrenceAdd);

        // When the reload button is clicked, reload
        form.find('a.rirefreshbutton').click(
            function (event) {
                event.preventDefault();
                loadOccurrences(findStartDate(),
                    widgetSaveToRfc5545(form, conf, false).result,
                    0,
                    false);
            }
        );
        
        // When selecting template, update what fieldsets are visible.
        form.find('select[name=rirtemplate]').change(
            function (e) {
                displayFields($(this));
            }
        );

        // When focus goes to a drop-down, select the relevant radiobutton.
        form.find('select').change(
            function (e) {
                $(this).parent().find('> input').click().change();
            }
        );
        
        /*
          Save and cancel methods:
        */
        form.find('.ricancelbutton').click(cancel);
        form.find('.risavebutton').click(save);
        
        /*
         * Public API of RecurrenceInput
         */
         
        $.extend(self, {
            display: display,
            form: form,
            loadData: loadData, //Used by tests.
            save: save //Used by tests.
        });

    }


    /*
     * jQuery plugin implementation
     */
    $.fn.recurrenceinput = function (conf) {
        if (this.data('recurrenceinput')) {
            // plugin already installed
            return this.data('recurrenceinput'); 
        }
        
        // "compile" configuration for widget
        var config = $.extend({}, tool.conf);
        $.extend(config, conf);
        $.extend(config, {i18n: LABELS[config.lang], name: this.attr('name')});

        // our recurrenceinput widget instance
        var recurrenceinput = new RecurrenceInput(config, this);
        // hide textarea and place display widget after textarea
        recurrenceinput.form.appendTo('body');
        this.after(recurrenceinput.display);
        
        if (this.val()) {
            recurrenceinput.display.find(
                'input[name=richeckbox]'
            ).attr('checked', true);
        }
        
        // hide the textarea
        this.hide();
        
        // save the data for next call
        this.data('recurrenceinput', recurrenceinput);
        return recurrenceinput;
    };

}(jQuery));
