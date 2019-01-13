# Fretboard

An Angular-1 directive which wraps the <a href="https://github.com/fmodica/fretboard">jQuery plugin</a>.

## Demo

Check out the <a href="http://frankmodica.net/static/fretboarddemo/angular-1/index-with-full-config.html">demo fretboard (default styles)</a>, which shows the fretboard and the config updated in real time. Here is the same fretboard styled with a <a href="http://frankmodica.net/static/fretboarddemo/angular-1/index-with-full-config-dark-theme.html" target="_blank">dark theme</a> using CSS.

## Setup

Initialize the submodule:

```
git submodule init
git submodule update
```

Load your scripts and styles:

```
<script src="../fretboard/jquery-plugin/jquery-1.11.2.min.js"></script>
<script src="../fretboard/jquery-plugin/fretboard.js"></script>
<script src="./angular.js"></script>
<script src="./angular-fretboard.js"></script>

<link rel="stylesheet" type="text/css" href="../fretboard/jquery-plugin/styles.css">
```

Create an Angular controller with a config:

``` 
$scope.config = {};
```

Use the `fretboard` directive in your HTML and pass in your config:

```
<div fretboard config='config'></div>
```

This is enough to create a fretboard using the default configuration.

Learn more about <a target="_blank" href="https://github.com/fmodica/fretboard-angular-1/wiki/Configuration">fretboard configuration</a>.

## Code Examples

<a href="https://github.com/fmodica/fretboard-angular-1/blob/master/angular-directive/index.html">AngularJS directive (basic, using the default config)</a>

<a href="https://github.com/fmodica/fretboard-angular-1/blob/master/angular-directive/index-with-full-config.html">AngularJS directive (using all config options + API)</a>

## Tests
Unit tests for can be run using the <a href="https://github.com/fmodica/fretboard-angular-1/tree/master/tests">Spec Runner</a>.

## Angular 2 Component

If you are using Angular 2, the fretboard is also wrapped as an <a href="https://github.com/fmodica/fretboard-angular">Angular 2 component</a>.
