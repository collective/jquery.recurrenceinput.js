Changelog
=========

1.0dev (unreleased)
-------------------
TODO: ADD MISSING CHANGELOG ENTRIES HERE

- backport pbauers fix of "use strict is not a function".
  [thet]


1.0rc1 (2012-10-18)
-------------------

tested with:
* jquery 1.4.2 + jquery tools 1.2.5
* jquery 1.7.2 + jquery tools 1.2.7
* ie 8 (win), chromium 20 (linux), firefox 16 (linux, android)


- fix pull-request #9: recurrence end date not properly saved.
  [aroemen, thet]

- add ributtonextraclass config parameter for setting extra classes on cancel
  and save buttons. this allows frameworks to react on submit for buttons
  marked with a special class.
  [thet]

- add ajaxcontenttype parameter to allow configuring of the content type of the
  ajax request sent to the server for getting the recurrence occurences.
  [thet]

- added ie8 support
  [regebro]

- rewrote the demo/test server as wsgi for increased reliability.
  [regebro]

- setting first day of the week now works.
  [regebro]

- the tests run on chromium 20.
  [regebro]

- moved the localized demo to it's own page, because jquery tools dateinput
  can not have different configurations on one page.
  [regebro]

- a license file was added to be explicit about the licensing.
  [regebro]

- localization of the jquery tools dateinputs and first day configuration
  option added to set which is the first day of the month.
  [vsomogyi]

- fixed a compatibility issue with ie8 and below.
  [dokai]

- by default, preselect the byoccurrences "end recurrence" field, so that
  recurrence rules with unlimited occurences are not selected by accident but
  intentionally.
  [thet]

1.0b1 (2012-02-01)
------------------

Initial release.
