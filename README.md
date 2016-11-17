# Ensure Animation
A simple JS module to ensure a CSS animation plays continuously through to the end animation frame.

## Use Case
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
Given the following markup.
```html
<figure>
  <img src="" alt="" class="hero lazyload">
  <div class="preloader" data-ensure-target=".hero" data-ensure-ending-selector=".loaded"></div>
</figure>
```
Import EnsureAnimation for use in your JS.
```js
import EnsureAnimation from 'ensure-animation'
```

## Assuming there is only a single node
```js
const preload = new EnsureAnimation('.preloader')
// preload.length == 1
```

## Multiple node instances
```js
new EnsureAnimation('.preloaders')
// preload.length == multiple
```

## Stop single instance
```js
const preload = new EnsureAnimation('.preloader')
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

## Custom options
```js
const preloaders = new EnsureAnimation('.preloader', {
  // target received this class upon finished animation
  finish : 'custom-finished-class',

  // targets' class signaling animation should finish
  until  : 'has-been-loaded',

  // target to watch for class to be applied
  target  : '.hero-image'
})
```

## Making an ajax call
```js
const preloader = new EnsureAnimation('.preloader')
axios.get('api/users/1')
  .then(function(response) {
    preload.finish().then(function(){
      console.log(response)
    })
  })
```
