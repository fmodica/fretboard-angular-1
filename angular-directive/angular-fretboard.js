(function () {
    'use strict';

    angular.module('angularFretboard', [])
        .directive('fretboard', fretboard)
        .directive('tuning', ['dataBindingHelper', tuning])
        .directive('numFrets', ['dataBindingHelper', numFrets])
        .directive('isChordMode', ['dataBindingHelper', isChordMode])
        .directive('noteClickingDisabled', ['dataBindingHelper', noteClickingDisabled])
        .directive('noteMode', ['dataBindingHelper', noteMode])
        .directive('intervals', ['dataBindingHelper', intervals])
        .directive('intervalRoot', ['dataBindingHelper', intervalRoot])
        .directive('noteLetters', ['dataBindingHelper', noteLetters])
        .directive('animationSpeed', ['dataBindingHelper', animationSpeed])
        .directive('noteCircles', ['dataBindingHelper', noteCircles])
        .directive('dimensionsFunc', ['dataBindingHelper', dimensionsFunc])
        .directive('clickedNotes', ['dataBindingHelper', clickedNotes])
        .directive('allNotes', ['dataBindingHelper', allNotes])
        .factory('dataBindingHelper', ['$rootScope', dataBindingHelper]);

    // Data-binding has to be done carefully, so this service helps each directive with
    // the following:
    //
    // - If a config value is undefined during init, we want to fill that in using
    //   info from the plugin (getFn).
    // 
    // - If a config value is defined during init, it will be rendered during init, 
    //   so we should ignore the first call to ngModelCtrl.$render or it will
    //   render again.
    //
    // - Some options on the config are not "true" config options (e.g. 
    //   clickedNotes), so they will not render during init. Thus they are the 
    //   exception to the above rule and will be rendered on init if defined.
    function dataBindingHelper($rootScope) {
        function bind(ngModelCtrl, getFn, setFn, renderOnInitIfDefined) {
            var isFirstRender = true;

            ngModelCtrl.$render = $render;

            function $render() {
                if (shouldRender()) {
                    render();
                }

                if (shouldUpdateModel()) {
                    updateModel();
                }

                isFirstRender = false;
            }

            function shouldRender() {
                return setFn && (!isFirstRender || (renderOnInitIfDefined && !isUndefinedOrNull(ngModelCtrl.$viewValue)));
            }

            function render() {
                setFn(ngModelCtrl.$viewValue);
            }

            function shouldUpdateModel() {
                return isFirstRender && isUndefinedOrNull(ngModelCtrl.$viewValue);
            }

            function updateModel() {
                $rootScope.$evalAsync(function () {
                    ngModelCtrl.$setViewValue(getFn());
                });
            }

            return { updateModel: updateModel };
        }

        return { bind: bind };
    }

    function fretboard() {
        return {
            restrict: 'AE',
            scope: { config: '<' },
            controller: ['$scope', '$element', fretboardController],
            // The inner directives each have their own ngModel which handle two-way
            // data-binding for a single config property.
            template:
                '<tuning ng-if="config" ng-model="config.tuning"></tuning>' +
                '<num-frets ng-if="config" ng-model="config.numFrets"></num-frets>' +
                '<is-chord-mode ng-if="config" ng-model="config.isChordMode"></is-chord-mode>' +
                '<note-clicking-disabled ng-if="config" ng-model="config.noteClickingDisabled"></note-clicking-disabled >' +
                '<note-mode ng-if="config" ng-model="config.noteMode"></note-mode>' +
                '<intervals ng-if="config" ng-model="config.intervals"></intervals>' +
                '<interval-root ng-if="config" ng-model="config.root"></interval-root>' +
                '<note-letters ng-if="config" ng-model="config.noteLetters"></note-letters>' +
                '<animation-speed ng-if="config" ng-model="config.animationSpeed"></animation-speed>' +
                '<note-circles ng-if="config" ng-model="config.noteCircles"></note-circles>' +
                '<dimensions-func ng-if="config" ng-model="config.dimensionsFunc"></dimensions-func>' +

                // These must come last because they are affected by some of the others.
                '<all-notes ng-if="config" ng-model="config.allNotes"></all-notes>' +
                '<clicked-notes ng-if="config" ng-model="config.clickedNotes" ng-change="ctrl.onClickedNotesUpdated()"></clicked-notes>'
        };

        function fretboardController($scope, $element) {
            if (!$scope.config) {
                throw new Error('The "config" object is not defined. Place it on your scope and pass it into the fretboard directive.');
            }

            var updateClickedNotesModel;
            var updateAllNotesModel;
            var modelUpdateIsScheduled = false;
            var ctrl = $scope.ctrl = this;

            initFretboard();

            ctrl.registerClickedNotesModelUpdateFn = function (_updateClickedNotesModel) {
                updateClickedNotesModel = _updateClickedNotesModel;
            };

            ctrl.registerAllNotesModelUpdateFn = function (_updateAllNotesModel) {
                updateAllNotesModel = _updateAllNotesModel;
            };

            ctrl.onNotesChanged = function () {
                if (modelUpdateIsScheduled) return;

                modelUpdateIsScheduled = true;

                $scope.$evalAsync(function () {
                    updateAllNotesModel();
                    updateClickedNotesModel();
                    modelUpdateIsScheduled = false;
                });
            }

            $scope.$on('$destroy', function destroy() {
                ctrl.api.destroy();
                ctrl.api = null;
            });

            function initFretboard() {
                var configCopy = angular.copy($scope.config);
                var originalNotesClickedCallback = configCopy.notesClickedCallback;

                // The plugin gets a function which updates the model, so that can happen before
                // the original callback is invoked.
                configCopy.notesClickedCallback = function () {
                    updateClickedNotesModel();
                }

                // The original callback gets invoked with ng-change after clicked notes have been
                // updated on the model. 
                ctrl.onClickedNotesUpdated = originalNotesClickedCallback;

                $element.fretboard(configCopy);
                ctrl.api = $element.data('api');
            }
        }
    }

    function tuning(dataBindingHelper) {
        return {
            restrict: 'E',
            require: ['ngModel', '^fretboard'],
            link: function (scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0];
                var fretboardCtrl = ctrls[1];

                dataBindingHelper.bind(ngModelCtrl, getFn, setFn);

                function getFn() {
                    return fretboardCtrl.api.getTuning();
                }

                function setFn(model) {
                    fretboardCtrl.api.setTuning(model);
                    fretboardCtrl.onNotesChanged();
                }
            }
        };
    }

    function numFrets(dataBindingHelper) {
        return {
            restrict: 'E',
            require: ['ngModel', '^fretboard'],
            link: function (scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0];
                var fretboardCtrl = ctrls[1];

                dataBindingHelper.bind(ngModelCtrl, getFn, setFn);

                function getFn() {
                    return fretboardCtrl.api.getNumFrets();
                }

                function setFn(model) {
                    fretboardCtrl.api.setNumFrets(model);
                    fretboardCtrl.onNotesChanged();
                }
            }
        };
    }

    function isChordMode(dataBindingHelper) {
        return {
            restrict: 'E',
            require: ['ngModel', '^fretboard'],
            link: function (scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0];
                var fretboardCtrl = ctrls[1];

                dataBindingHelper.bind(ngModelCtrl, getFn, setFn);

                function getFn() {
                    return fretboardCtrl.api.getChordMode();
                }

                function setFn(model) {
                    fretboardCtrl.api.setChordMode(model);
                }
            }
        };
    }

    function noteClickingDisabled(dataBindingHelper) {
        return {
            restrict: 'E',
            require: ['ngModel', '^fretboard'],
            link: function (scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0];
                var fretboardCtrl = ctrls[1];

                dataBindingHelper.bind(ngModelCtrl, getFn, setFn);

                function getFn() {
                    return fretboardCtrl.api.getNoteClickingDisabled();
                }

                function setFn(model) {
                    return fretboardCtrl.api.setNoteClickingDisabled(model);
                }
            }
        };
    }

    function noteMode(dataBindingHelper) {
        return {
            restrict: 'E',
            require: ['ngModel', '^fretboard'],
            link: function (scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0];
                var fretboardCtrl = ctrls[1];

                dataBindingHelper.bind(ngModelCtrl, getFn, setFn);

                function getFn() {
                    return fretboardCtrl.api.getNoteMode();
                }

                function setFn(model) {
                    fretboardCtrl.api.setNoteMode(model);
                }
            }
        };
    }

    function intervals(dataBindingHelper) {
        return {
            restrict: 'E',
            require: ['ngModel', '^fretboard'],
            link: function (scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0];
                var fretboardCtrl = ctrls[1];

                dataBindingHelper.bind(ngModelCtrl, getFn);

                function getFn() {
                    return fretboardCtrl.api.getIntervals();
                }
            }
        };
    }

    function intervalRoot(dataBindingHelper) {
        return {
            restrict: 'E',
            require: ['ngModel', '^fretboard'],
            link: function (scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0];
                var fretboardCtrl = ctrls[1];

                dataBindingHelper.bind(ngModelCtrl, getFn, setFn);

                function getFn() {
                    return fretboardCtrl.api.getRoot();
                }

                function setFn(model) {
                    fretboardCtrl.api.setRoot(model);
                    fretboardCtrl.onNotesChanged();
                }
            }
        };
    }

    function animationSpeed(dataBindingHelper) {
        return {
            restrict: 'E',
            require: ['ngModel', '^fretboard'],
            link: function (scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0];
                var fretboardCtrl = ctrls[1];

                dataBindingHelper.bind(ngModelCtrl, getFn);

                function getFn() {
                    return fretboardCtrl.api.getAnimationSpeed();
                }
            }
        };
    }

    function noteLetters(dataBindingHelper) {
        return {
            restrict: 'E',
            require: ['ngModel', '^fretboard'],
            link: function (scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0];
                var fretboardCtrl = ctrls[1];

                dataBindingHelper.bind(ngModelCtrl, getFn);

                function getFn() {
                    return fretboardCtrl.api.getNoteLetters();
                }
            }
        };
    }

    function noteCircles(dataBindingHelper) {
        return {
            restrict: 'E',
            require: ['ngModel', '^fretboard'],
            link: function (scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0];
                var fretboardCtrl = ctrls[1];

                dataBindingHelper.bind(ngModelCtrl, getFn);

                function getFn() {
                    return fretboardCtrl.api.getNoteCircles();
                }
            }
        };
    }

    function dimensionsFunc(dataBindingHelper) {
        return {
            restrict: 'E',
            require: ['ngModel', '^fretboard'],
            link: function (scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0];
                var fretboardCtrl = ctrls[1];

                dataBindingHelper.bind(ngModelCtrl, getFn);

                function getFn() {
                    return fretboardCtrl.api.getDimensionsFunc();
                }
            }
        };
    }

    function allNotes(dataBindingHelper) {
        return {
            restrict: 'E',
            require: ['ngModel', '^fretboard'],
            link: function (scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0];
                var fretboardCtrl = ctrls[1];

                var updateModel = dataBindingHelper
                    .bind(ngModelCtrl, getFn)
                    .updateModel;

                fretboardCtrl.registerAllNotesModelUpdateFn(updateModel);

                function getFn() {
                    return fretboardCtrl.api.getAllNotes();
                }
            }
        };
    }

    function clickedNotes(dataBindingHelper) {
        return {
            restrict: 'E',
            require: ['ngModel', '^fretboard'],
            link: clickedNotesLinkFn
        };

        function clickedNotesLinkFn(scope, element, attrs, ctrls) {
            var ngModelCtrl = ctrls[0];
            var fretboardCtrl = ctrls[1];

            var updateModel = dataBindingHelper
                .bind(ngModelCtrl, getFn, setFn, true)
                .updateModel;

            fretboardCtrl.registerClickedNotesModelUpdateFn(updateModel);

            function getFn() {
                return fretboardCtrl.api.getClickedNotes();
            }

            function setFn(model) {
                fretboardCtrl.api.clearClickedNotes();
                fretboardCtrl.api.setClickedNotes(model);
                fretboardCtrl.onNotesChanged();
            };
        }
    }

    function isUndefinedOrNull(val) {
        return angular.isUndefined(val) || val === null;
    }
})();