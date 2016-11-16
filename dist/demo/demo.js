'use strict';

var _ensureAnimation = require('../ensure-animation');

var _ensureAnimation2 = _interopRequireDefault(_ensureAnimation);

require('lazysizes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Example One
var e1_preloader = new _ensureAnimation2.default('#e1-preloader');
var e1_buttons = document.querySelectorAll('.e1-button');
var e1_content = document.querySelector('.e1-content');

var _loop = function _loop(i) {
  e1_buttons[i].addEventListener('click', function () {
    var finish = e1_buttons[i].getAttribute('data-finish');
    var restart = e1_buttons[i].getAttribute('data-restart');
    var callback = e1_buttons[i].getAttribute('data-callback');

    if (restart) {
      e1_preloader.restart();
    }
    if (finish) {
      e1_preloader.finish();
    }
    if (callback) {
      e1_preloader.finish().then(function () {
        e1_content.innerHTML += 'Animation completed, text appended<br>';
      });
    }
  });
};

for (var i = 0; i < e1_buttons.length; i++) {
  _loop(i);
}

// Example Two
var e2_preloader = new _ensureAnimation2.default('#e2-preloader');

// Example Three
var e3_preloader = new _ensureAnimation2.default('#e3-preloader');
var e3_button = document.querySelector('.e3-button');
var e3_content = document.querySelector('.e3-content');

e3_button.addEventListener('click', function () {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    var _this = this;

    if (this.readyState == 4 && this.status == 200) {
      (function () {
        var responseText = _this.responseText;
        e3_preloader.finish().then(function () {
          e3_content.innerHTML = responseText;
        });
      })();
    }
  };
  xhttp.open('GET', 'https://static.viget.com/content.txt', true);
  xhttp.send();
}, false);