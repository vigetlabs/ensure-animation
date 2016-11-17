import ee from 'event-emitter'
var emitter = ee({})

const whichAnimationEvent = () => {
  let el = document.createElement('fakeelement')
  let animations = {
    'animation'       : 'animationend',
    'OAnimation'      : 'oAnimationEnd',
    'MozAnimation'    : 'animationend',
    'WebkitAnimation' : 'webkitAnimationEnd'
  }

  for (let t in animations){
    if (el.style[t] !== undefined){
      return animations[t]
    }
  }
}

const animationEvent = whichAnimationEvent()
const defaults = {
  finish : null,
  until  : null,
  target : null
}

class Ensure {
  constructor(el, options = {}) {
    this.el = el
    this.props = Object.assign({}, defaults, options)
    this.setup()
    this.reset()
    this.check()
  }

  setup() {
    this.state = {}

    let trigger = this.props.until ?
      this.props.until :
      (this.el.getAttribute('data-ensure-until') ? this.el.getAttribute('data-ensure-until') : 'ensure-animation-loaded')

    let finish = this.props.finish ?
      this.props.finish :
      (this.el.getAttribute('data-ensure-finish-class') ? this.el.getAttribute('data-ensure-finish-class') : 'ensure-target-finished')

    this.state.target = target
    this.state.until  = trigger
    this.state.finish = finish
  }

  reset() {
    this.iterations = 1
    this.el.style.animationIterationCount = 1
    this.shouldRun = true
    this.isFinished = false
    this.checkReference = this.continueChecking.bind(this)
    this.el.removeEventListener(animationEvent, this.checkReference, false)
  }

  restart() {
    // Remove loaded classname
    let classList = this.el.classList
    let targetClassList = this.state.target.classList
    targetClassList.remove(this.state.until)

    // Force redraw
    let classes = classList.toString().split(' ')
    classList.remove(...classes)
    void this.el.offsetWidth
    classList.add(...classes)

    this.el.removeEventListener(animationEvent, this.checkReference, false)

    this.reset()
    this.check()
  }

  check() {
    this.el.addEventListener(animationEvent, this.checkReference, false)
  }

  finish() {
    return new Promise((resolve) => {
      this.shouldRun = false

      // Listen for finished
      emitter.on('finished', resolve)
    })
  }

  continueChecking() {
    if ( ! this.isFinished && ! this.shouldRun) {
      this.isFinished = true
      this.shouldRun  = false

      if (this.state.finish) {
        this.state.target.classList.add(this.state.finish)
      }

      emitter.emit('finished')
      return
    }

    let containsEndingClass = this.state.target.classList.contains(this.state.until)

    if (containsEndingClass) {
      this.stop()
      return
    }

    this.iterations += 1
    this.el.style.animationIterationCount = this.iterations
  }

  stop() {
    this.shouldRun = false
    this.el.removeEventListener(animationEvent, this.checkReference, false)
  }
}

var EnsureAnimation = class {
  constructor(selector, options) {
    const animations = document.querySelectorAll(selector)
    let instances = []

    for (let i = 0; i < animations.length; i++) {
      instances.push(new Ensure(animations[i], options))
    }

    if (instances.length < 2) return instances[0]

    return instances
  }
}

export default EnsureAnimation
