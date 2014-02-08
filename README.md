Simple Bookmarklet for Parts Search on Digikey
------------------------------

Installation
============

Create a bookmark to the follow URL:

    javascript:(function(){document.body.appendChild(document.createElement('script')).src='https://raw.github.com/thjaeger/filter-parts/master/filter-parts.js';})();

Clicking on the link will load the code and inject text boxes below the list boxes.

Usage
=====

Typing something into the list boxes will select all options that match the
string.  Two modes are currently implemented:

* Value Mode.  Select all options whose range matches the given value.  The
  value must be followed by the appropriate unit (SI prefixes are supported).

* Regex Mode.  Select all options that match the given regular expression.

Tested in Firefox and Chrome.
