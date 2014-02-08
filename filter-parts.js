(function() {
  var prefixes = {
    'Z': Math.pow(10, 21),
    'E': Math.pow(10, 18),
    'P': Math.pow(10, 15),
    'T': Math.pow(10, 12),
    'G': Math.pow(10,  9),
    'M': Math.pow(10,  6),
    'k': Math.pow(10,  3),
    'm': Math.pow(10, -3),
    'u': Math.pow(10, -6),
    'µ': Math.pow(10, -6),
    'n': Math.pow(10, -9),
    'p': Math.pow(10,-12),
    'f': Math.pow(10,-15),
    'a': Math.pow(10,-18),
    'z': Math.pow(10,-21),
    'y': Math.pow(10,-24)
  };

  function parseValue(str, checkUnit) {
    var valueMatches = str.match(/^([-+]?[0-9]*\.?[0-9]+) *(µ?[°A-Za-z]+)$/);
    if (valueMatches === null) {
      return null;
    }

    var number = parseFloat(valueMatches[1]);
    var unit = valueMatches[2];
    var prefix = unit.charAt(0);
    if (unit.length > 1 && prefixes.hasOwnProperty(prefix)) {
      number *= prefixes[prefix];
      unit = unit.substr(1);
    }

    if (arguments.length > 1 && !checkUnit(unit)) {
      return null;
    }

    return number;
  }

  function fudge(x) {
    return x < 0 ? x * 1.01 : x / 1.01;
  }

  function inRange(range, value, unit) {
    function checkUnit(u) {
      return unit === u;
    }
    return range.split(",").some(function(condition) {
      var cond = condition.trim();
      var condMin = null;
      var condMax = null;

      (function() {
        var exact = parseValue(cond, checkUnit);
        if (exact !== null) {
          condMin = exact;
          condMax = exact;
          return;
        }

        var upToMatch = cond.match(/^(up|adj) to (.*)$/i);
        if (upToMatch !== null) {
          condMin = 0;
          condMax = parseValue(upToMatch[2], checkUnit);
          return;
        }

        var rangeMatch = cond.match(/^() *~ *()$/);
        if (rangeMatch !== null) {
          condMin = parseValue(upToMatch[1], checkUnit);
          condMax = parseValue(upToMatch[2], checkUnit);
        }
      })();

      if (condMin === null || condMin === null) {
        return false;
      }

      if (condMin > condMax) {
        var tmp = condMin;
        condMin = condMax;
        condMax = tmp;
      }

      return fudge(condMin) <= value && fudge(value) <= condMax;
    });
  }

  function insertFilters($) {
    $('select[multiple]').each(function() {
      var list = $(this);
      var input = $('<input type="text" style="width:95%;" />');
      input.on('input', function() {
        var search = input.val();
        if (search === "") {
          list.children().prop('selected', false);
          list.scrollTop(0);
          return;
        };

        var test;
        var unit;

        var value = parseValue(search, function(u) { unit = u; return true; });
        if (value === null) {
          var regexp = new RegExp(search, 'i');
          test = function(text) { return regexp.test(text); };
        } else {
          test = function(text) { return inRange(text, value, unit); }
        }

        var found = false;
        list.children().each(function() {
          var item = $(this);
          var match = test(item.text());
          if (match && !found) {
            list.scrollTop(item.offset().top - list.offset().top + list.scrollTop() - list.innerHeight()/2);
            found = true;
          }
          item.prop('selected', match);
        });


      });
      $(this).after(input);
    });
  }

  var script = document.createElement('script');
  script.src='http://code.jquery.com/jquery-1.10.1.min.js';
  script.onload = function() {
    insertFilters(jQuery.noConflict());
  };
  document.body.appendChild(script);
})();
