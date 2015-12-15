# ng-fluid-height
AngularJS directives to implement responsive-fluid height layouts in all browsers.

## Demo
Try the sample project in `sample` directory.

## Download
Download using `bower`

`bower install ng-fluid-height`

## Compatibility
Tested with AngularJS 1.2, 1.3, 1.4. Probably works with most of AngularJS versions.
Browser tested with IE9+ and most of the modern browsers.

## Install Guide

### Include files in your project
Include minified(or unminified) js file in `ng-fluid-height/dist` folder to your web project.

### Add dependency for your application
Add the ng-fluid-height module as a dependency to your application module.

```js
var myAppModule = angular.module('MyApp', ['deopard.ngFluidHeight']);
```

### Using it in AngularJS application

```html
<div class="a">

  <!-- Element of group 'a', registered with explicit height and is dynamically shown -->
  <div class="a-static-1"
    fluid-height-static="'a'" fluid-height-static-key="'a-static-1'"
    fluid-height-static-shown="showToggle" fluid-height-static-height="60"
    ng-show="showToggle">
    a-static-1 with explicit height
  </div>

  <!-- fluid element of group 'a' -->
  <div class="a-fluid"
    fluid-height-fluid="'a'">
    <div ng-repeat="item in longLongList" class="item">
      {{ item }}
    </div>
  </div>

  <!-- static element of group 'a'. Height will be auto calculated since there's no explicit declaration -->
  <div class="a-static-2"
    fluid-height-static="'a'" fluid-height-static-key="'a-static-2'">
    a-static-2
  </div>

  <!-- static element of group 'a'. Height will be auto calculated since there's no explicit declaration -->
  <div class="a-static-3"
    fluid-height-static="'a'" fluid-height-static-key="'a-static-3'">
    a-static-3
  </div>
</div>
<div class="b">
  <!-- Group b has no static height elements. Fluid height element only. -->
  <div class="b-fluid"
    fluid-height-fluid="'b'">
    <div ng-repeat="item in list" class="item">
      {{ item }}
    </div>
  </div>
</div>
```

## Directives
### fluidHeightStatic
#### Description
Register static height elements

#### Parameters
##### fluidHeightStatic (required)
Group name of fluid height calculation.
Use 'common' for elements which are used in all calculation groups.

##### fluidHeightStaticKey (required)
Unique key of the static height element in calculation group.

##### fluidHeightStaticHeight (optional. default: outerHeight)
Element's static height. Element's outerHeight value will be used as default value.

##### fluidHeightStaticShown (optional. default: true)
Expression whether this element is shown. Default value is `true`.


### fluidHeightFluid
#### Parameters
##### fluidHeightFluid (required)
Group name of fluid height calculation.
Use 'common' for elements which are used in all calculation groups.

## Services
### FluidHeightManager
You don't need to use this explicitly. ngFluidHeight directives will use this services.


license
=======
[MIT License](https://github.com/deopard/ng-fluid-height/blob/master/LICENSE)
