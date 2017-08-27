/**=========================================================
 * Module: climacon.js
 * Include any animated weather icon from Climacon
 =========================================================*/

App.directive('climacon', function(){
  'use strict';
  var SVG_PATH = 'app/vendor/animated-climacons/svgs/',
      SVG_EXT = '.svg';

  return {
    restrict: 'EA',
    link: function(scope, element, attrs) {
      
      var color  = attrs.color  || '#000',
          name   = attrs.name   || 'sun',
          width  = attrs.width  || 20,
          height = attrs.height || 20;

      // Request the svg indicated
      $.get(SVG_PATH + name + SVG_EXT).then(svgLoaded, svgError);

      // if request success put it as online svg so we can style it
      function svgLoaded(xml) {
        var svg = angular.element(xml).find('svg');

        svg.css({
          'width':  width,
          'height': height
        });
        svg.find('.climacon_component-stroke').css('fill', color);

        element.append(svg);
      }
      // If fails write a message
      function svgError() {
        element.text('Error loading SVG: ' + name);
      }

    }
  };
});