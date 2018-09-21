angular.module('ngIntlTelInput')
  .directive('ngIntlTelInput', ['ngIntlTelInput', '$log', '$window', '$parse',
    function (ngIntlTelInput, $log, $window, $parse, $scope) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attr, ctrl) {
          // Warning for bad directive usage.
          if ((!!attr.type && (attr.type !== 'text' && attr.type !== 'tel')) || elm[0].tagName !== 'INPUT') {
            $log.warn('ng-intl-tel-input can only be applied to a *text* or *tel* input');
            return;
          }
          // Override default country.
          if (attr.initialCountry) {
            ngIntlTelInput.set({initialCountry: attr.initialCountry});
          }
          // Initialize.
          ngIntlTelInput.init(elm);
          if (attr.selectedCountry) {
            setSelectedCountryData(attr.selectedCountry);
            angular.element($window).on('countrychange', handleCountryChange);
            scope.$on('$destroy', cleanUp);
          }

          // Set input value to model value and trigger evaluation.
          ctrl.$formatters.push(function (value) {
            if (value) {
              if(value.charAt(0) !== '+') {
                value = '+' + value;
              }
              elm.intlTelInput('setNumber', value);
            }
            return value;
          });
          function update(val) {
            ctrl.$setViewValue(elm.intlTelInput('getNumber') || val);
            elm[0].value = (elm.intlTelInput('getNumber') || val);
          }
          scope.$watch(function() {return elm[0].value}, update, true)
          scope.$watch(function() {return elm.intlTelInput('getSelectedCountryData')}, function(country) {update(elm[0].value)}, true)
        }
      };
    }]);
