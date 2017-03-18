# Bootstrap yo site

[Try site in palampinen.github.io/bootstrap-yo-site/build](https://palampinen.github.io/bootstrap-yo-site/build/)

Demonstrating how to enable bootstrap styles...

This is how I did it

1) [Took some static gulp based boilerplate](https://github.com/anttti/static-boilerplate)

2) npm i bootstrap-sass --save

3) Copied `_variable.scss` from bootstrap node_modules to apps style scss folder

4) import bootstrap and cloned variable-file to main scss file
```
@import "scss/_variables.scss";
@import "../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss";
```
5) override some variables in _variables.scss, usually that being colors, border radius and some other main things that define your brand

6) write some own styles for your custom content

7) [Took some starter html content with bootstrap classes for building initial style library](http://getbootstrap.com/examples/theme/)

8) Profit!