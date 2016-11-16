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
  finish: null,
  watchFor: null,
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
      this.state = {};

      var target = this.props.target ? document.querySelector(this.props.target) : document.querySelector(this.el.getAttribute('data-ensure-target'));

      var trigger = this.props.watchFor ? this.props.watchFor : this.el.getAttribute('data-ensure-watch-for') ? this.el.getAttribute('data-ensure-watch-for') : 'ensure-animation-loaded';

      var finish = this.props.finish ? this.props.finish : this.el.getAttribute('data-ensure-finish-class') ? this.el.getAttribute('data-ensure-finish-class') : 'ensure-target-finished';

      this.state.target = target;
      this.state.watchFor = trigger;
      this.state.finish = finish;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.iterations = 1;
      this.el.style.animationIterationCount = 1;
      this.shouldRun = true;
      this.isFinished = false;
      this.checkReference = this.continueChecking.bind(this);
      this.el.removeEventListener(animationEvent, this.checkReference, false);
    }
  }, {
    key: 'restart',
    value: function restart() {
      // Remove loaded classname
      var classList = this.el.classList;
      var targetClassList = this.state.target.classList;
      targetClassList.remove(this.state.watchFor);

      // Force redraw
      var classes = classList.toString().split(' ');
      classList.remove.apply(classList, _toConsumableArray(classes));
      void this.el.offsetWidth;
      classList.add.apply(classList, _toConsumableArray(classes));

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
    value: function finish(cb) {
      var _this = this;

      return new Promise(function (resolve) {
        _this.shouldRun = false;

        // Listen for finished
        emitter.on('finished', resolve);
      });
    }
  }, {
    key: 'continueChecking',
    value: function continueChecking() {
      if (!this.isFinished && !this.shouldRun) {
        this.isFinished = true;
        this.shouldRun = false;

        if (this.state.finish) {
          this.state.target.classList.add(this.state.finish);
        }

        emitter.emit('finished');
        return;
      }

      var containsEndingClass = this.state.target.classList.contains(this.state.watchFor);

      if (containsEndingClass) {
        this.stop();
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

  if (instances.length < 2) return instances[0];

  return instances;
};

exports.default = EnsureAnimation;