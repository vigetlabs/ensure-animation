'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventEmitter = require('event-emitter');

var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var emitter = (0, _eventEmitter2.default)({});
var matches = function matches(el, selector) {
  return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
};

var whichAnimationEvent = function whichAnimationEvent() {
  var el = document.createElement('fakeelement');
  var animations = {
    'animation': 'animationend',
    'OAnimation': 'oAnimationEnd',
    'MozAnimation': 'animationend',
    'WebkitAnimation': 'webkitAnimationEnd'
  };

  for (var t in animations) {
    if (el.style[t] !== undefined) {
      return animations[t];
    }
  }
};

var animationEvent = whichAnimationEvent();
var defaults = {
  finishClass: null,
  until: null,
  target: null
};

var Ensure = function () {
  function Ensure(el) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Ensure);

    this.el = el;
    this.props = _extends({}, defaults, options);
    this.setup();
    this.reset();
    this.check();
  }

  _createClass(Ensure, [{
    key: 'setup',
    value: function setup() {
      var p = this.props;
      var finishClass = p.finishClass ? p.finishClass : this.el.getAttribute('data-ensure-finish-class') ? this.el.getAttribute('data-ensure-finish-class') : 'ensure-target-finished';
      var target = p.target ? p.target : this.el.getAttribute('data-ensure-target') ? document.querySelectorAll(this.el.getAttribute('data-ensure-target'))[0] : this.el;
      var until = p.until ? p.until : this.el.getAttribute('data-ensure-until') ? this.el.getAttribute('data-ensure-until') : '.ensure-animation-loaded';

      this.state = {
        finishClass: finishClass,
        target: target,
        until: until
      };
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.iterations = 1;
      this.shouldRun = true;
      this.isFinished = false;
      this.isEmitted = false;
      this.el.style.animationIterationCount = 1;
      this.checkReference = this.continueChecking.bind(this);
      this.el.removeEventListener(animationEvent, this.checkReference, false);
    }
  }, {
    key: 'restart',
    value: function restart() {
      // Remove finished classname
      var elClassList = this.el.classList;
      var targetClassList = this.state.target.classList;
      targetClassList.remove(this.state.finishClass);

      // Force redraw
      var classes = elClassList.toString().split(' ');
      elClassList.remove.apply(elClassList, _toConsumableArray(classes));
      void this.el.offsetWidth;
      elClassList.add.apply(elClassList, _toConsumableArray(classes));

      this.el.removeEventListener(animationEvent, this.checkReference, false);

      this.reset();
      this.check();
    }
  }, {
    key: 'check',
    value: function check() {
      this.el.addEventListener(animationEvent, this.checkReference, false);
    }
  }, {
    key: 'finish',
    value: function finish() {
      var _this = this;

      return new Promise(function (resolve) {
        _this.shouldRun = false;

        // Listen for finished
        if (!_this.isEmitted) {
          _this.isEmitted = true;
          emitter.on('finished', resolve);
        }
      });
    }
  }, {
    key: 'continueChecking',
    value: function continueChecking() {
      // If it should run and not finished, keep checking for ending selector
      if (matches(this.state.target, this.state.until)) {
        this.stop();
        emitter.emit('finished');
      }

      if (!this.shouldRun) {
        this.isFinished = true;

        if (this.state.finishClass) {
          this.state.target.classList.add(this.state.finishClass);
        }

        if (this.isFinished) {
          this.isFinished = false;
          emitter.emit('finished');
        }

        return;
      }

      this.iterations += 1;
      this.el.style.animationIterationCount = this.iterations;
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.shouldRun = false;
      this.el.removeEventListener(animationEvent, this.checkReference, false);
    }
  }]);

  return Ensure;
}();

var EnsureAnimation = function EnsureAnimation(selector, options) {
  _classCallCheck(this, EnsureAnimation);

  var animations = document.querySelectorAll(selector);
  var instances = [];

  for (var i = 0; i < animations.length; i++) {
    instances.push(new Ensure(animations[i], options));
  }

  return instances;
};

exports.default = EnsureAnimation;