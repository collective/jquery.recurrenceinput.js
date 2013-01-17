1.0rc1 (2012-10-18)
===================

Tested with:
* jQuery 1.4.2 + jQuery Tools 1.2.5
* jQuery 1.7.2 + jQuery Tools 1.2.7
* IE 8 (Win), Chromium 20 (Linux), Firefox 16 (Linux, Android)


- Add ributtonExtraClass config parameter for setting extra classes on cancel
  and save buttons. This allows frameworks to react on submit for buttons
  marked with a special class.
  [thet]

- Add ajaxContentType parameter to allow configuring of the content type of the
  ajax request sent to the server for getting the recurrence occurences.
  [thet]

- Added IE8 support
  [regebro]
  
- Rewrote the demo/test server as WSGI for increased reliability.
  [regebro]

- Setting first day of the week now works.
  [regebro]

- The tests run on Chromium 20.
  [regebro]

- Moved the localized demo to it's own page, because jQuery Tools dateinput
  can not have different configurations on one page.
  [regebro]
  
- A license file was added to be explicit about the licensing.
  [regebro]

- Localization of the jquery tools dateinputs and first day configuration
  option added to set which is the first day of the month.
  [vsomogyi]

- Fixed a compatibility issue with IE8 and below.
  [dokai]

- By default, preselect the BYOCCURRENCES "End recurrence" field, so that
  recurrence rules with unlimited occurences are not selected by accident but
  intentionally.
  [thet]

1.0b1 (2012-02-01)
==================

Initial release.
