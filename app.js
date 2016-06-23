var app = angular.module('plunker', ['ui.bootstrap',]);

app.controller('MainCtrl', function($scope) {
  $scope.color = "#ff0000";
});

app.directive('lvColorPicker', function ($timeout) {
  var template = [
    '<div class="input-group">',
    '  <span class="input-group-addon">',
    '    <input type="hidden">',
    '  </span>',
    '  <input type="text" class="form-control" ng-model="color" ng-change="updateColor()">',
    '  <div class="input-group-btn" uib-dropdown>',
    '    <button class="btn btn-default dropdown-toggle" uib-dropdown-toggle>',
    '      <span class="text-uppercase">{{ format }}</span>',
    '      <i class="fa fa-caret-down" aria-hidden="true"></i>',
    '    </button>',
    '    <ul class="dropdown-menu dropdown-menu-right" uib-dropdown-menu>',
    '      <li><a href ng-click="changeFormat(\'hex\')">HEX</a></li>',
    '      <li><a href ng-click="changeFormat(\'rgb\')">RGB</a></li>',
    '      <li><a href ng-click="changeFormat(\'hsl\')">HSL</a></li>',
    '    </ul>',
    '  </div>',
    '</div>'
  ].join('\n');

  var link = function(scope, element, attributes, ngModel) {
    var swatch = element.find('input[type=hidden]');
    var input = element.find('input[type=text]');
    
    scope.format = 'hex';
    
    if (!ngModel) {
      return;
    }
    
    function toHex(value) {
      var color = tinycolor(value);
      if (color.isValid()) {
        return color.toHex();
      }
      return value;
    }
    
    function fromHex(value) {
      switch (scope.format) {
        case 'hex':
          if (value[0] !== '#') {
            value = '#' + value;
          }
          return value;
        
        case 'rgb':
          var rgb = tinycolor(value).toRgb();
          return [ 'rgb(',
            rgb.r + ', ',
            rgb.g + ', ',
            rgb.b + ')'
          ].join('');
          
        case 'hsl':
          var hsv = tinycolor(value).toHsv();
          return [ 'hsl(',
            Math.round(hsv.h) + ', ',
            Math.round(hsv.s * 100) + '%, ',
            Math.round(hsv.v * 100) + '%)'
          ].join('');
      }
    }
    
    ngModel.$render = function () {
      $timeout(function() {
        scope.color = fromHex(ngModel.$viewValue);
        swatch.minicolors('value', ngModel.$viewValue);
      }, 0, false);
    };
    
    scope.changeFormat = function(format) {
      if (scope.format !== format) {
        scope.format = format;
        scope.color = fromHex(toHex(scope.color));
      }
    };
    
    scope.updateColor = function() {
      $timeout(function() {
        swatch.minicolors('value', toHex(scope.color));
      }, 0, false);
    };
    
    swatch.minicolors({
      theme: 'default',
      opacity: false,
      change: function (value) {
        scope.$apply(function () {
          if (!input.is(":focus")) {
            scope.color = fromHex(value);
            ngModel.$setViewValue(value);
          }
        });
      },
    });
  };
  
  return {
    require: '?ngModel',
    scope: {},
    restrict: 'E',
    template: template,
    link: link
  };
});
