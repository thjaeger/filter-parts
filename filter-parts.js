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
      var regexp = new RegExp(search, 'i');
      var found = false;
      list.children().each(function() {
        var item = $(this);
        var match = regexp.test(item.text());
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

(function() {
  var script = document.createElement('script');
  script.src='http://code.jquery.com/jquery-1.10.1.min.js';
  script.onload = function() {
    insertFilters(jQuery.noConflict());
  };
  document.body.appendChild(script);
})();
