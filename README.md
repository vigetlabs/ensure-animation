# Ensure Animation
A simple JS module to ensure a CSS animation plays continuously through to the end animation frame.

## Use Case
Continue playing loading animation until...
* A lazy loaded image has been loaded
* A user has clicked on a notification
* A "load more" ajax request has been completed

## Install
`npm install ensure-animation --save`

## Usage
```html

<figure>
    <img src="" alt="" class="hero lazyload">
    <div class="preloader" data-ensure-target=".hero" data-ensure-ending-class=".loaded"></div>
</figure>
```

```js
import EnsureAnimation from 'ensure-animation'

var preloader = document.querySelector('.preloader')
new EnsureAnimation(preloader)

// Pass multiple instances
var preloaders = document.querySelectorAll('.preloaders')
new EnsureAnimation(preloaders)

// Manually stop
var preloader = document.querySelector('.preloader')
var preload = new EnsureAnimation(preloader)

// Manually finish the animations
preload.finish()

// Manually restart the animations
preload.restart()

// Making an ajax call
preload.restart()
axios.get('/user?id=1')
  .then(function(response) {
    // Returns a promise when animation is complete
    preload.finish().then(function(){
       console.log(response)
    })
  })
```


##