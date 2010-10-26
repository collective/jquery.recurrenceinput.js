/**
 * http://garbas.github.com/jquery.recurrenceinput.js
 *
 * Author: Rok Garbas <rok@garbas.si>
 * Since: Sep 2010
 * Date: XX-XX-XXXX
 */
(function($) {

    /**
     * TODO:
     *  - options for each freq
     *  - start date, end date and number of recurrences for each rule
     *  - add c.datetimewidget like widget with dateinput calendar 
     *  - reuse start date from other fields
     *
     */
    var default_conf = {
        'widget-tmpl': '#jquery-recurrenceinput-widget-tmpl',
        'rule-tmpl': '#jquery-recurrenceinput-rule-tmpl',
        'date-tmpl': '#jquery-recurrenceinput-date-tmpl'
    };

    // private

    function Recurrenceinput (textarea, conf) {

        var self = this;
        var widget = $(conf['widget-tmpl']).tmpl();

        /*
         * Initial steps to activate widget
         */

        // add actions to widget buttons
        widget.find('p.button > a')
            .unbind('click')
            .click(function (e) {
                e.preventDefault();

                var class_name = $(this).attr('class');
                if (class_name == 'button-add-rrule') { add_rule('rrule') }
                else if (class_name == 'button-add-exrule') { add_rule('exrule') }
                else if (class_name == 'button-add-rdate') { add_date('rdate') }
                else if (class_name == 'button-add-exdate') { add_date('exdate') }
            });


        function add_date(date_class, data) {
            var rule = $(conf['date-tmpl']).tmpl(
                { 'months': 'Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec'.split('|'),
                  'dateDay': '1', 'dateMonth': '2', 'dateYear': '2010' })
            rule.addClass(date_class);

            // remove rule action
            $('a.remove', rule).unbind("click").click(function () {
                $(this).closest("li.rule").slideUp(function() { $(this).remove() });
            });

            // append rule to ruleset
            rule.hide();
            $('.recurrenceinput-' + date_class + " ul.ruleset", widget).append(rule);
            rule.slideDown();
        }

        function add_rule (rule_class, data) {
            var rule = $("#jquery-recurrenceinput-rule-tmpl" ).tmpl();
            rule.addClass(rule_class);

            // hide options of frequencies
            $('.freq-options > div', rule).hide();

            // make label of freq option active for selection
            rule.find('.freq label').unbind("click").click(function () {
                var input = $(this).parent().find('input[name=freq]');
                input.click(); 
                input.change();
            });


            // select 
            rule.find('.freq input[name=freq]').removeClass("active");
            rule.find('.freq input[name=freq]').unbind("change").change(function() {
                var el = $(this);
                
                rule.find('.freq input[name=freq]').removeClass("active");
                rule.find('.freq-options > div').hide();

                el.addClass('active');

                parent_list = el.closest("ul");
                font_size = parent_list.css('font-size').replace('px', '').replace('em','');

                rule.find('.freq-options .' + el.val().toLowerCase())
                        .css('margin-left', + (parent_list.width() + 2*font_size))
                        .show();
            });

            // remove rrule action
            rule.find('a.remove').unbind("click").click(function () {
                    $(this).closest("li.rule").slideUp(function() { $(this).remove() });
            });

            // append rrule to ruleset
            rule.hide();
            $('.recurrenceinput-' + rule_class + " ul.ruleset", widget).append(rule);
            rule.slideDown();
        }



        /*
         * Parsing RDF2554 from widget
         */

        // method for parsing rules (rrule and exrule)
        function parse_rule(el) {
            var str_ = '';
            freq = el.find('input.active').val();
            str_ += 'FREQ=' + freq;
            // TODO: parse other options
            return str_;
        }

        // function for parsing dates (rdate and exdate)
        function parse_date(el) {
            var str_ = '';
            // TODO: parse other options
            return str_;
        }



        /*
         * Public API of Recurrenceinput
         */

        $.extend(self, {
            widget: widget,
            initial_structure: function () { add_rule('rrule') },
            parse_rrule: function (el) { return 'RRULE: '+parse_rule(el) },
            parse_exrule: function (el) { return 'EXRULE: '+parse_rule(el) },
            parse_rdate: function (el) { return 'RDATE: '+parse_date(el) },
            parse_exdate: function (el) { return 'EXDATE: '+parse_date(el) }
        });

    }



    /*
     * jQuery plugin implementation
     */

    $.fn.recurrenceinput = function(conf) {

        // already installed
        if (this.data("recurrenceinput")) { return this; } 

        // apply this for every textarea we can match
        this.each(function() {
            if (this.tagName == 'TEXTAREA') {

                var textarea = $(this);
                var form = textarea.closest("form");
                var recurrenceinput = new Recurrenceinput(textarea, $.extend(true, {}, default_conf, conf));

                //textarea.hide();

                // initialize widget
                if (textarea.val() == '') {
                    recurrenceinput.initial_structure();
                } else {
                    // TODO: populate data from existing relations
                }

                // on form submit we write to textarea
                form.submit(function(e) {
                    e.preventDefault();

                    // create string for rule widget
                    var ruleset_str = '';
                    var f = function(pf, el) {
                        ruleset_str += pf($(el)) + "\n";
                    }
                    var widgets = recurrenceinput.widget;
                    $('div.rrule', widgets).each( function() { f(recurrenceinput.parse_rrule, this) });
                    $('div.exrule', widgets).each(function() { f(recurrenceinput.parse_exdate, this) });
                    $('div.rdate', widgets).each( function() { f(recurrenceinput.parse_rdate, this) });
                    $('div.exdate', widgets).each(function() { f(recurrenceinput.parse_exdate, this) })

                    // insert string generated form above to textarea
                    textarea.val(ruleset_str);

                    // remove widget
                    //recurrenceinput.widget.remove();
                });

                // insert recurrance widget right after textarea 
                textarea.after(recurrenceinput.widget)
            };
        });
    };

})(jQuery);
