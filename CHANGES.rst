1.0dev (unreleased)
===================

Tested with:
* jQuery 1.4.2 + jQuery Tools 1.2.5
* jQuery 1.7.2 + jQuery Tools 1.2.7

jQuery Tools does not yet support jQuery 1.8, and there are at least one
serious bug in jQuery 1.6.4 that means this widget does not work with
jQuery 1.6.

- Setting first day of the week now works.
  [regebro]

- The tests run on Chromium again.
  [regebro]

- Moved the localized demo to it's own page, because jQuery Tools dateinput
  can not have different configurations on one page.
  [regebro]
  
- A license file was added to be explicit about the licensing.
  [regebro]

- Localization of the jquery tools dateinputs and first day configuration option
  added to set which is the first day of the month.
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