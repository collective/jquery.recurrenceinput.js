/*jslint indent: 4 */

var today = new Date();
var basename = 'recurrenceinput';

/**
 * Configurable values
 */
 
var default_conf = {
    // STRING TO BE TRANSLATED
    i18n: {
    
        display_label_unactivate: 'Does not repeat',
        display_label_activate: 'Repeats ',
        
        recurrence_type: 'Recurrence type:',

        daily_interval_1: 'Every',
        daily_interval_2: 'days',

        weekly_interval_1: 'Every',
        weekly_interval_2: 'week(s)',
        weekly_weekdays: 'On:',

        monthly_day_of_month_1: 'Day',
        monthly_day_of_month_2: 'of the month',
        monthly_day_of_month_3: ', every',
        monthly_day_of_month_4: 'month(s)',
        monthly_weekday_of_month_1: 'The',
        monthly_weekday_of_month_2: '',
        monthly_weekday_of_month_3: ', every',
        monthly_weekday_of_month_4: 'month(s)',

        yearly_day_of_month_1: 'Every',
        yearly_day_of_month_2: '',
        yearly_day_of_month_3: '',
        yearly_weekday_of_month_1: 'The',
        yearly_weekday_of_month_2: '',
        yearly_weekday_of_month_3: 'of',
        yearly_weekday_of_month_4: '',
        
        range_label: 'End recurrance:',
        range_no_end_label: 'No end',
        range_by_occurrences_label_1: 'Ending after',
        range_by_occurrences_label_2: 'occurrence(s)',
        range_by_end_date_label: 'Until ',

        cancel_button_label: 'Cancel',	
        save_button_label: 'Save',

        order_indexes: ['First', 'Second', 'Third', 'Fourth', 'Last'],
        months: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'],
        weekdays: [
            'Monday', 'Tuesday', 'Wednesday', 'Thursday',
            'Friday', 'Saturday', 'Sunday'],
            
        long_date_format: 'mmmm dd, yyyy',
        short_date_format: 'mm/dd/yyyy',
            
        no_template_match: 'Warning: This event uses recurrence features not ' +
                           'supported by this widget. Saving the recurrence ' +
                           'may change the recurrence in unintended ways.'
    },

    // FORM OVERLAY
    form_overlay: {
        speed: 'fast',
        mask: {
            color: '#ebecff',
            loadSpeed: 'fast',
            closeSpeed: 'fast',
            opacity: 0.5
        }
    },

    order_indexes: ['+1', '+2', '+3', '+4', '-1'],
    weekdays: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'],

    // TEMPLATE NAMES
    template: {
        form: '#jquery-recurrenceinput-form-tmpl',
        display: '#jquery-recurrenceinput-display-tmpl'
    },

};

// RECURRENCE TEMPLATES
// Defined outside so that the field names are available;
var rtemplate = {
    daily: {
        title: 'Daily',
        rrule: 'FREQ=DAILY',
        fields: [
            'recurrenceinput_daily_interval',
            'recurrenceinput_range_options'
        ]
    },
    mondayfriday: {
        title: 'Mondays and Fridays',
        rrule: 'FREQ=WEEKLY;BYDAY=MO,FR',
        fields: [
            'recurrenceinput_range_options'
        ]
    },
    weekdays: {
        title: 'Weekdays',
        rrule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR',
        fields: [
            'recurrenceinput_range_options'
        ]
    },
    weekly: {
        title: 'Weekly',
        rrule: 'FREQ=WEEKLY',
        fields: [
            'recurrenceinput_weekly_interval',
            'recurrenceinput_weekly_weekdays',
            'recurrenceinput_range_options'
        ]
    },
    monthly: {
        title: 'Monthly',
        rrule: 'FREQ=MONTHLY',
        fields: [
            'recurrenceinput_monthly_options',
            'recurrenceinput_range_options'
        ]
    },
    yearly: {
        title: 'Yearly',
        rrule: 'FREQ=YEARLY',
        fields: [
            'recurrenceinput_yearly_options',
            'recurrenceinput_range_options'
        ]
    }
    
};

// And then we stick it in the default_conf.
default_conf.rtemplate = rtemplate;