# Ensure Animation
A simple JS module to ensure a CSS animation plays continuously through to the end animation frame.

## [See the Demo](http://code.viget.com/ensure-animation)

## Use Cases
Continue playing loading animation until a:
* Lazy loaded image is loaded
* User has clicked on a notification
* "Load more" ajax request has been completed
* Chain multiple animations to fire sequentially

## Install
```bash
npm install ensure-animation --save
```

## Usage
Given the following markup:
```html
<figure>
  <img src="large-image.jpg" class="hero lazyload">
  <div class="preloader" data-ensure-target=".hero" data-ensure-until=".lazyloaded" data-ensure-finish-class="fade-in"></div>
</figure>
```
Import EnsureAnimation for use in your JS:
```js
import EnsureAnimation from 'ensure-animation'
new EnsureAnimation('.preloader')
```

## Get instances
```js
const preloaders = new EnsureAnimation('.preloaders')
```

## Stop single instance
```js
const preload = new EnsureAnimation('.preloader')[0]
preload.finish()
```

## Restart the animation
```js
preload.restart()
```

## Stop all instances
```js
const preloaders = new EnsureAnimation('.preloader')
preloaders.each((preloader) => preloader.finish())
```

## Custom Options
Options can be passed directly to an instance using data attributes on the node itself, or by passing in an object of values.
```html
<figure>
  <img src="large-image.jpg" class="hero lazyload">
  <div data-ensure-target=".hero"
       data-ensure-until=".lazyloaded"
       data-ensure-finish-class="fade-in"
       class="preloader"></div>
</figure>
```
And
```js
const preloaders = new EnsureAnimation('.preloader', {
  // target to watch for class to be applied
  target : '.hero-image'

  // targets' class signaling animation should finish
  until : 'has-been-loaded',

  // target received this class upon finished animation,
  finishClass : 'custom-finished-class'
})
```
