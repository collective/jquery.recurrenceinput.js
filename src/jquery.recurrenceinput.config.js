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

    // FIELD VALUES
    field: {
        display_text: null,

        checkbox_name: basename + '_checkbox',
        edit_name: basename + '_button',
        
        rtemplate_name: basename + '_rtemplate',
        
        daily_interval_name: basename + '_daily_interval',
        daily_interval_value: '1',

        weekly_interval_name: basename + '_weekly_interval',
        weekly_interval_value: '1',
        weekly_weekdays_name: basename + '_weekly_weekdays',

        monthly_options_name: basename + '_monthly_options',
        monthly_type_name: basename + '_monthly_type',
        monthly_day_of_month_value: 'DAY_OF_MONTH',
        monthly_day_of_month_day_name: basename + '_monthly_day_of_month_day_name',
        monthly_day_of_month_interval_name: basename + '_monthly_day_of_month_interval',
        monthly_day_of_month_interval_value: '1',
        monthly_weekday_of_month_value: 'WEEKDAY_OF_MONTH',
        monthly_weekday_of_month_index_name: basename + '_monthly_weekday_of_month_index',
        monthly_weekday_of_month_name: basename + '_monthly_weekday_of_month',
        monthly_weekday_of_month_interval_name: basename + '_monthly_weekday_of_month_interval',
        monthly_weekday_of_month_interval_value: '1',

        yearly_options_name: basename + '_yearly_options',
        yearly_type_name: basename + '_yearly_type',
        yearly_day_of_month_month_name: basename + '_yearly_day_of_month',
        yearly_day_of_month_index_name: basename + '_yearly_day_of_month_index',
        yearly_day_of_month_value: 'DAY_OF_MONTH',
        yearly_weekday_of_month_index_name: basename + '_yearly_weekday_of_month_index',
        yearly_weekday_of_month_day_name: basename + '_yearly_weekday_of_month_day',
        yearly_weekday_of_month_month_name: basename + '_yearly_weekday_of_month_month',
        yearly_weekday_of_month_value: 'WEEKDAY_OF_MONTH',

        range_options_name: basename + '_range_options',
        range_type_name: basename + '_range_type',
        range_no_end: 'NO_END_DATE',
        range_by_occurrences: 'BY_OCCURRENCES',
        range_by_occurrences_value_name: basename + '_range_by_occurrences_value',
        range_by_occurrences_value: '10',
        range_by_end_date: 'BY_END_DATE',
        range_by_end_date_calendar_name: basename + '_range_by_end_date_calendar'
    },

    // TEMPLATE NAMES
    template: {
        form: '#jquery-recurrenceinput-form-tmpl',
        display: '#jquery-recurrenceinput-display-tmpl'
    },

    // CLASS NAMES
    klass: {
        main: basename + '_main',

        display: basename + '_display',
        display_text: basename + '_display_text',
        display_label: basename + '_display_label',

        form: basename + '_form',

        cancel_button: basename + '_cancel_button',
        save_button: basename + '_save_button'
        
    }
    
};

// RECURRENCE TEMPLATES
// Defined outside so that the field names are available;
var rtemplate = {
    daily: {
        title: 'Daily',
        rrule: 'FREQ=DAILY',
        fields: [
            default_conf.field.daily_interval_name,
            default_conf.field.range_options_name
        ]
    },
    mondayfriday: {
        title: 'Mondays and Fridays',
        rrule: 'FREQ=WEEKLY;BYDAY=MO,FR',
        fields: [
            default_conf.field.range_options_name
        ]
    },
    weekdays: {
        title: 'Weekdays',
        rrule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR',
        fields: [
            default_conf.field.range_options_name
        ]
    },
    weekly: {
        title: 'Weekly',
        rrule: 'FREQ=WEEKLY',
        fields: [
            default_conf.field.weekly_interval_name,
            default_conf.field.weekly_weekdays_name,
            default_conf.field.range_options_name
        ]
    },
    monthly: {
        title: 'Monthly',
        rrule: 'FREQ=MONTHLY',
        fields: [
            default_conf.field.monthly_options_name,
            default_conf.field.range_options_name
        ]
    },
    yearly: {
        title: 'Yearly',
        rrule: 'FREQ=YEARLY',
        fields: [
            default_conf.field.yearly_options_name,
            default_conf.field.range_options_name
        ]
    }
    
};

// And then we stick it in the default_conf.
default_conf.rtemplate = rtemplate;