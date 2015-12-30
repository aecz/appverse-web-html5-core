(function () {
    'use strict';

    var requires = [
        'appverse.detection',
        'ui.router',
        'ui.bootstrap',
        'appverse.ionic.templates'
    ];


    /**
     * @ngdoc module
     * @name appverse.ionic
     *
     * @description
     * Provides ionic management views
     *
     * @requires appverse.detection
     * @requires ui.router
     * @requires ui.bootstrap
     */

    angular.module('appverse.ionic', requires);
})();

(function() {
    'use strict';

    angular.module('appverse.ionic')

    .controller('ModalNotAllowedCntrl',
        ["$scope", "$uibModalInstance", "Detection", "$location", "$timeout", "IONIC_CONFIG", function($scope, $uibModalInstance, Detection, $location, $timeout, IONIC_CONFIG) {
            if (Detection.isMobileBrowser()) {
                $scope.device = 'device';
            } else {
                $scope.device = 'desktop';
            }

            $scope.seconds = 5;
            var counter = setInterval(timer, 1000); //1000 will  run it every 1 second

            function timer() {
                $scope.seconds = $scope.seconds - 1;
                $scope.$evalAsync($scope.seconds);
                if ($scope.seconds <= 0) {
                    clearInterval(counter);
                    $uibModalInstance.close();
                    $timeout(function() {
                        $location.path(IONIC_CONFIG.redirectionPath);
                    }, 300);
                    return;
                }
            }
        }]);
})();

(function() {
    'use strict';

    run.$inject = ["$log", "Detection", "$rootScope", "$state", "$uibModal", "IONIC_CONFIG"];
    angular.module('appverse.ionic')
        .run(run);

    function run($log, Detection, $rootScope, $state, $uibModal, IONIC_CONFIG) {
        $log.info('appverse.ionic run');

        function showModalPrompt() {
            if (IONIC_CONFIG.modalPrompt) {

                $uibModal.open({
                    templateUrl: 'appverse-ionic/modal/not-allowed.html',
                    controller: 'ModalNotAllowedCntrl'
                });
            }

        }

        function transformState(toState) {
            //check if a mobile view exists, if is available in our envirnoment and if needs a different controller
            if (toState.data.mobile && Detection.isMobileBrowser()) {
                toState.templateUrl = toState.templateUrl.split('.html')[0] + IONIC_CONFIG.suffix + '.html';
                if (toState.data.controller) {
                    toState.controller = toState.controller + IONIC_CONFIG.suffix;
                }
            }

            //After change (if is necessary) the template and controller, delete data object to avoid all the process the next time
            delete toState.data;
        }

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            if (toState.data) {
                //if toState.data exists, check restrict attribute
                if (toState.data.restrict) {
                  //if restrict, check environment
                    if ((!Detection.isMobileBrowser() && toState.data.mobile) || (Detection.isMobileBrowser() && !toState.data.mobile)) {
                        showModalPrompt();
                    } else {
                        transformState(toState);
                    }
                } else {
                  //if NOT restrict, check environment
                  transformState(toState);
                }
            }
        });

    }
})();

/*jshint -W101 */
angular.module('appverse.ionic.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('appverse-ionic/modal/not-allowed.html',
    '<div class="modal-header"><h3 class="modal-title">Not Allowed</h3></div><div class="modal-body">This view is not allowed in {{device}} version, you will be redirected to home page in {{seconds}}...</div>');
}]);
