var nav = function() {

  var links = function () {

    var output = {},
        sections = document.querySelectorAll('section > h2');


    for (var i = 0; i < sections.length; i++) {
      var section = sections[i];
      var element = document.createElement('a');
      element.setAttribute('class', 'section-link');
      element.setAttribute('href', '#' + section.id);
      element.append(document.createTextNode(section.id));
      output[section.id] = [element];

      var articles = document.querySelectorAll('h2#' + section.id + ' ~ article > h3');

      for (var j = 0; j < articles.length; j++) {
        var article = articles[j];
        var articleEl = document.createElement('a');
        articleEl.setAttribute('class', 'article-link');
        articleEl.setAttribute('href', '#' + article.id);
        articleEl.append(document.createTextNode(article.id));
        output[section.id].push(articleEl);
      }
    }
    return output;
  }();

  (function createDropdowns() {

    var titles = Object.keys(links).map(function (k, i) {
      var el = document.createElement('div');
      el.setAttribute('class', 'dropdown-container');

      var checkbox = document.createElement('input');
      checkbox.setAttribute('id', k + '-dropdown-open');
      checkbox.setAttribute('type', 'checkbox');
      checkbox.onchange = function() {
        if (this.checked) buildDropdown(this.id);
        else removeDropdown();
      };
      el.append(checkbox);

      var label = document.createElement('label');
      label.setAttribute('class', 'dropdown-label');
      label.setAttribute('for', k + '-dropdown-open');
      label.append(document.createTextNode(k.slice(0,1).toUpperCase() + k.slice(1)));
      el.append(label);

      return el;
    });

    var nav = document.querySelectorAll('nav')[0];
    for (var i = 0; i < titles.length; i++) {
      var el = titles[i];
      nav.append(el);
    }


  })();

  var buildDropdown = function (id) {

    (function () {
      var checkboxes = document.querySelectorAll('.dropdown-container > input');
      for (var i = 0; i < checkboxes.length; i++) {
        var checkbox = checkboxes[i];
        if (checkbox.id !== id)
          checkbox.checked = false;
      }
    })();

    removeDropdown();

    var key = id.slice(0, -14);

    var dropdown = document.createElement('menu');
    dropdown.setAttribute('id', key + '-dropdown');

    for (var i = 0; i < links[key].length; i++) {
      var el = document.createElement('li');
      el.append(links[key][i]);
      dropdown.append(el);
    }

    var nav = document.querySelectorAll('nav')[0];
    nav.append(dropdown);

  };

  var removeDropdown = function () {

    var dropdown = document.querySelectorAll('menu[id$="-dropdown"]')[0];

    if (dropdown === undefined) return;

    var nav = document.querySelectorAll('nav')[0];

    nav.removeChild(dropdown);

  }

}();
