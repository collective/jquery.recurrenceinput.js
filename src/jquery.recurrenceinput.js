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
     *
     */
    var default_conf = {}

    // private

    // helper translation function
    function _(str, args) { 
        return $.i18n('jquery-recurrenceinput-js', str, args); 
    }

    function Recurrenceinput (textarea, conf) {

        var widget_str = '\
            <div class="recurrenceinput">\
              <div class="ruleset"></div>\
              <div class="buttons">\
                 <a href="#" class="add_rrule">'+_('Add RRULE')+'</a>\
                 <a href="#" class="add_exrule">'+_('Add EXRULE')+'</a>\
                 <a href="#" class="add_rdate">'+_('Add RDATE')+'</a>\
                 <a href="#" class="add_exdate">'+_('Add EXDATE')+'</a>\
              </div>\
              <div class="clear"><!-- --></div>\
            </div>'; 

        var rrule_str = '\
            <div class="rrule">\
              <form>\
                <a href="#" class="remove">'+_('Remove RRULE')+'</a>\
                <div class="clear"><!-- --></div>\
                <ul class="freq">\
                  <li>\
                    <input type="radio" name="freq" value="DAILY" />\
                    <label>'+_('Daily')+'</label>\
                  </li>\
                  <li>\
                    <input type="radio" name="freq" value="WEEKLY" />\
                    <label>'+_('Weekly')+'</label>\
                  </li>\
                  <li>\
                    <input type="radio" name="freq" value="MONTHLY" />\
                    <label>'+_('Monthly')+'</label>\
                  </li>\
                  <li>\
                    <input type="radio" name="freq" value="YEARLY" />\
                    <label>'+_('Yearly')+'</label>\
                  </li>\
                </ul>\
                <div class="freq-options">\
                  <div class="daily">DAILY OPTIONS</div>\
                  <div class="weekly">WEEKLY OPTIONS</div>\
                  <div class="monthly">MONTHLY OPTIONS</div>\
                  <div class="yearly">YEARLY OPTIONS</div>\
                </div>\
                <div class="clear"><!-- --></div>\
              </form>\
            </div>';

        var self = this,
            textarea = textarea;
            widget = $(widget_str);
            ruleset = widget.find('.ruleset');
            form = detect_form(textarea);

        // on form submit we write 
        form.submit(function(e) {
            var ruleset_str = '';
            widget.find('.ruleset > div').each(function () {
                $this = $(this);
                if ($this.hasClass('rrule')) {
                    ruleset_str += parse_rrule($this)+'\n';
                }
            });
            textarea.val(ruleset_str);
            widget.html('');
        });

        // add action to buttons
        // TODO: add action to other buttons
        widget.find('.buttons a.add_rrule').unbind('click').click(function () {
            add_rrule();
        })


        // HELPING FUNCTIONS

        function parse_rrule (rule) {
            var rule_str = 'RRULE:';
            rule_str += 'FREQ='+rule.find('input[class=active]').val()
            // TODO: parse other options
            return rule_str;
        }

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

        // adds rrule to widget
        function add_rrule (data) {
            var rrule = $(rrule_str);

            // hide options of frequencies
            rrule.find('.freq-options > div').css('display', 'none');

            // make label of freq option active for selection
            rrule.find('.freq label').unbind("click").click(function () {
                var input = $(this).parent().find('input[name=freq]');
                input.click(); input.change();
            });

            // select 
            rrule.find('.freq input[name=freq]').unbind("change").change(function() {
                $this = $(this);
                rrule.find('.freq input[name=freq]').attr('class', '');
                $this.attr('class', 'active')
                rrule.find('.freq-options > div').css('display', 'none');
                rrule.find('.freq-options .' + $this.val().toLowerCase())
                        .css('display', 'block')
                        .css('margin-left', +$this.parent().parent().width() +
                                            2*(+($this.parent().parent().css('font-size')
                                                .replace('px', '')
                                                .replace('em', ''))));
            });

            // remove rrule action
            rrule.find('a.remove').unbind("click").click(function () {
                $(this).parent().remove();
            });

            // append rrule to ruleset
            ruleset.append(rrule);

        }

        $.extend(self, {
            init: function (data) {
                // add empty rrule widget
                if (data === undefined || data == "") {
                    add_rrule();
                // widget
                } else {
                    alert('TODO: Need to parse and polute widget!');
                }
            },
            getWidget: function () {
                return widget;
            }
        });

    }

    // jQuery plugin implementation
    $.fn.recurrenceinput = function(conf) {

        // already installed
        if (this.data("recurrenceinput")) { return this; } 

        // extend configuration with globals
        conf = $.extend(true, {}, default_conf, conf);        

        this.each(function() {
            if (this.tagName == 'TEXTAREA') {
                $this = $(this);
                var d_recurr = new Recurrenceinput($this, $.extend(true, {}, conf));

                // hide textarea we are submiting
                $this.css('display', 'none');

                // initialize recurrance widget and polute with data
                d_recurr.init($this.val())

                // insert recurrance widget after textarea 
                $this.after(d_recurr.getWidget())
            };
        });        
        
    };    


})(jQuery);
