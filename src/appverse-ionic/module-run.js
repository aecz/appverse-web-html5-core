(function () {
    'use strict';

    angular.module('appverse.ionic')
        .run(run);

    function run($log, Detection, $rootScope, $state, IONIC_CONFIG, $location) {
        $log.info('appverse.ionic run');
        var state = $state;

        function showModalPrompt() {
            if (IONIC_CONFIG.modalPrompt) {

                angular.injector(['ui.bootstrap']).get('$uibModal').open({
                    templateUrl: 'appverse-ionic/modal/not-allowed.html',
                    controller: 'ModalNotAllowedCntrl'
                });
            } else {
                $location.path(IONIC_CONFIG.redirectionPath);
            }

        }

        function transformState(toState) {
            //check if a mobile view exists, if is available in our envirnoment and if needs a different controller
            if (toState.data.mobile && Detection.isMobileBrowser()) {
                if (!toState.data.restrict) {
                    var parentState = state.get('^', toState);
                    if (parentState && parentState.data && parentState.data.mobile && !parentState.data.restrict) {
                      parentState.templateUrl = parentState.templateUrl.split('.html')[0] + IONIC_CONFIG.suffix + '.html';
                    }
                    toState.templateUrl = toState.templateUrl.split('.html')[0] + IONIC_CONFIG.suffix + '.html';
                }
                if (toState.data.controller) {
                    toState.controller = toState.data.controller;
                    delete toState.data.controller;
                }
            }

            //After change (if is necessary) the template and controller, delete mobile property of data object to avoid all the process the next time
            delete toState.data.mobile;




        }

        $rootScope.$on('$stateChangeStart', function (event, toState) {

            if (toState.data && toState.data.mobile) {
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
