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
    var default_conf = {};

    // private

    // helper translation function
    function _(str, args) { 
        return $.i18n('jquery-recurrenceinput', str, args); 
    }

    function Recurrenceinput (textarea, conf) {

        var widget_str = '<div class="recurrenceinput"><div class="ruleset"></div><div class="buttons"><a href="#" class="add_rrule">'+_('Add RRULE')+'</a><a href="#" class="add_exrule">'+_('Add EXRULE')+'</a><a href="#" class="add_rdate">'+_('Add RDATE')+'</a><a href="#" class="add_exdate">'+_('Add EXDATE')+'</a></div><div style="clear:both;"><!-- --></div></div>'; 
        var rule_str = '<div class="rule RULE_CLASS"><form><a href="#" class="remove">'+_('Remove RULE')+'</a><div style="clear:both;"><!-- --></div><ul class="freq" style="list-style:none; margin: 0; padding: 0 1em 0 0; display: block; float: left;"><li style="margin: 0;"><input type="radio" name="freq" value="DAILY" /><label>'+_('Daily')+'</label></li><li style="margin: 0;"><input type="radio" name="freq" value="WEEKLY" /><label>'+_('Weekly')+'</label></li><li style="margin: 0;"><input type="radio" name="freq" value="MONTHLY" /><label>'+_('Monthly')+'</label></li><li style="margin: 0;"><input type="radio" name="freq" value="YEARLY" /><label>'+_('Yearly')+'</label></li></ul><div class="freq-options"><div class="daily" style="margin: 0 0 0 1em;">DAILY OPTIONS</div><div class="weekly" style="margin: 0 0 0 1em;">WEEKLY OPTIONS</div><div class="monthly" style="margin: 0 0 0 1em;">MONTHLY OPTIONS</div><div class="yearly" style="margin: 0 0 0 1em;">YEARLY OPTIONS</div></div><div style="clear:both;"><!-- --></div></form></div>';
        var date_str = '<div class="rule DATE_CLASS"><form><a href="#" class="remove">'+_('Remove DATE')+'</a><input type="input" name="date" value="" /></form></div>';

        var self = this;
        var widget = $(widget_str);
        var widget_ruleset = widget.find('.ruleset');



        /*
         * Initial steps to activate widget
         */

        // add actions to widget buttons
        widget.find('.buttons > a')
            .unbind('click')
            .click(function () {
                var class_name = $(this).attr('class');
                if (class_name == 'add_rrule') { add_rule('rrule') }
                else if (class_name == 'add_exrule') { add_rule('exrule') }
                else if (class_name == 'add_rdate') { add_date('rdate') }
                else if (class_name == 'add_exdate') { add_date('exdate') }
            });


        function add_date(date_class, data) {
            var rule = $(date_str.replace('DATE_CLASS', date_class));

            // remove rrule action
            rule.find('a.remove').unbind("click").click(function () {
                $(this).parent().parent().remove();
            });

            // append rrule to ruleset
            widget_ruleset.append(rule);
        }

        function add_rule (rule_class, data) {
            var rule = $(rule_str.replace('RULE_CLASS', rule_class));

            // hide options of frequencies
            rule.find('.freq-options > div').css('display', 'none');

            // make label of freq option active for selection
            rule.find('.freq label').unbind("click").click(function () {
                var input = $(this).parent().find('input[name=freq]');
                input.click(); input.change();
            });

            // select 
            rule.find('.freq input[name=freq]').attr('class', '');
            rule.find('.freq input[name=freq]').unbind("change").change(function() {
                var el = $(this);
                el.attr('class', 'active');
                rule.find('.freq-options > div').css('display', 'none');
                rule.find('.freq-options .' + el.val().toLowerCase())
                        .css('display', 'block')
                        .css('margin-left', +el.parent().parent().width() +
                                            2*(+(el.parent().parent().css('font-size')
                                                .replace('px', '')
                                                .replace('em', ''))));
            });

            // remove rrule action
            rule.find('a.remove').unbind("click").click(function () {
                $(this).parent().parent().remove();
            });

            // append rrule to ruleset
            widget_ruleset.append(rule);

        }



        /*
         * Parsing RDF2554 from widget
         */

        // method for parsing rules (rrule and exrule)
        function parse_rule(el) {
            var str_ = '';
            str_ += 'FREQ='+el.find('input[class=active]').val()
            // TODO: parse other options
            return str_;
        }

        // function for parsing dates (rdate and exdate)
        function parse_rule(el) {
            var str_ = '';
            // TODO: parse other options
            return str_;
        }



        /*
         * Public API of Recurrenceinput
         */

        $.extend(self, {
            widget: widget,
            widget_ruleset: widget_ruleset,
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
                var form = detect_form(textarea);
                var recurrenceinput = new Recurrenceinput($.extend(true, {}, default_conf, conf));

                // hide textarea
                textarea.css('display', 'none');

                // initialize widget
                if (textarea.val() == '') {
                    recurrenceinput.initial_structure();
                } else {
                    // TODO: populate data
                }

                // on form submit we write to textarea
                form.submit(function(e) {

                    // create string for rule widget
                    var ruleset_str = '';
                    recurrenceinput.widget_ruleset.each(function () {
                        var el = $(this);
                        if (el.hasClass('rrule')) {
                            ruleset_str += recurrenceinput.parse_rrule(el)+'\n';
                        } else if (el.hasClass('exrule')) {
                            ruleset_str += recurrenceinput.parse_exrule(el)+'\n';
                        } else if (el.hasClass('rdate')) {
                            ruleset_str += parse_rdate(el)+'\n';
                        } else if (el.hasClass('exdate')) {
                            ruleset_str += parse_exdate(el)+'\n';
                        }
                    });

                    // insert string generated form above to textarea
                    textarea.val(ruleset_str);

                    // remove widget
                    recurrenceinput.widget.remove();
                });

                // insert recurrance widget right after textarea 
                textarea.after(recurrenceinput.widget)
            };
        });



        /*
         * HELPING FUNCTIONS
         */

        // FIXME: maybe there is a better way to detect form
        function detect_form (textarea) {
            var form = textarea.parent()
            while (form[0].tagName!= 'FORM') {
                form = textarea.parent();
                if (form[0].type == 'BODY') {
                    break;
                }
            }
            return form
        }
    };

})(jQuery);
