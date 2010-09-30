(function($){
    $._i18n = { trans: {}, 'default':  'en', language: 'en' };
    $.i18n = function() {
        var getTrans = function(ns, str) {
            var trans = false;
            // check if string exists in translation
            if ($._i18n.trans[$._i18n.language] 
                && $._i18n.trans[$._i18n.language][ns]
                && $._i18n.trans[$._i18n.language][ns][str]) {
                trans = $._i18n.trans[$._i18n.language][ns][str];
            }
            // or exists in default
            else if ($._i18n.trans[$._i18n['default']] 
                     && $._i18n.trans[$._i18n['default']][ns]
                     && $._i18n.trans[$._i18n['default']][ns][str]) {
                trans = $._i18n.trans[$._i18n['default']][ns][str];
            }
            // return trans or original string
            return trans || str;
        };
        // Set language (accepted formats: en or en-US)
        if (arguments.length < 2) {
            $._i18n.language = arguments[0]; 
            return $._i18n.language;
        }
        else {
            // get translation
            if (typeof(arguments[1]) == 'string') {
                var trans = getTrans(arguments[0], arguments[1]);
                // has variables for string formating
                if (arguments[2] && typeof(arguments[2]) == 'object') {
                    return $.format(trans, arguments[2]);
                }
                else {
                    return trans;
                }
            }
            // set translation
            else {
                var tmp  = arguments[0].split('.');
                var lang = tmp[0];
                var ns   = tmp[1] || 'jQuery';
                if (!$._i18n.trans[lang]) {
                    $._i18n.trans[lang] = {};
                    $._i18n.trans[lang][ns] = arguments[1];
                }
                else {
                    $.extend($._i18n.trans[lang][ns], arguments[1]);
                }
            }
        }
    };
})(jQuery);
