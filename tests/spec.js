"use strict";

describe("Angular fretboard directive", function () {
    var $element;
    var $compile;
    var $rootScope;

    var defaultNoteLetters = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "Ab/G#", "A", "A#/Bb", "B"];
    var defaultTuning = [
        {
            letter: "E",
            octave: 4
        }, {
            letter: "B",
            octave: 3
        }, {
            letter: "G",
            octave: 3
        }, {
            letter: "D",
            octave: 3
        }, {
            letter: "A",
            octave: 2
        }, {
            letter: "E",
            octave: 2
        }
    ];
    var defaultNumFrets = 15;
    var defaultIsChordMode = true;
    var defaultNoteClickingDisabled = false;
    var defaultAllNoteLetters = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "Ab/G#", "A", "A#/Bb", "B"];
    var defaultNoteMode = "letter";
    var defaultIntervalSettings = {
        intervals: ["1", "b2", "2", "b3", "3", "4", "b5", "5", "b6", "6", "b7", "7"],
        root: defaultNoteLetters[0]
    };
    var defaultAnimationSpeed = 400;
    var defaultNoteCircles = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
    var defaultClickedNotes = [];
    var defaultNotesClickedCallbacks = [];

    var standardATuning = [{
        letter: "D",
        octave: 4
    }, {
        letter: "A",
        octave: 3
    }, {
        letter: "F",
        octave: 3
    }, {
        letter: "C",
        octave: 3
    }, {
        letter: "G",
        octave: 2
    }, {
        letter: "D",
        octave: 2
    }, {
        letter: "A",
        octave: 1
    }];

    var cMaj7ChordForStandardTuning = [{
        string: {
            letter: "E",
            octave: 4
        },
        notes: [{
            fret: 3
        }]
    }, {
        string: {
            letter: "B",
            octave: 3
        },
        notes: [{
            fret: 5
        }]
    }, {
        string: {
            letter: "G",
            octave: 3
        },
        notes: [{
            fret: 4
        }]
    }, {
        string: {
            letter: "D",
            octave: 3
        },
        notes: [{
            fret: 5
        }]
    }, {
        string: {
            letter: "A",
            octave: 2
        },
        notes: [{
            fret: 3
        }]
    }, {
        string: {
            letter: "E",
            octave: 2
        },
        notes: [{
            fret: 3
        }]
    }];

    var bFlatMaj7ChordForStandardATuning = [{
        string: {
            letter: "D",
            octave: 4
        },
        notes: [{
            fret: 3
        }]
    }, {
        string: {
            letter: "A",
            octave: 3
        },
        notes: [{
            fret: 5
        }]
    }, {
        string: {
            letter: "F",
            octave: 3
        },
        notes: [{
            fret: 4
        }]
    }, {
        string: {
            letter: "C",
            octave: 3
        },
        notes: [{
            fret: 5
        }]
    }, {
        string: {
            letter: "G",
            octave: 2
        },
        notes: [{
            fret: 3
        }]
    }, {
        string: {
            letter: "D",
            octave: 2
        },
        notes: [{
            fret: 3
        }]
    }];

    var customTuning = angular.copy(defaultTuning);
    customTuning.push({
        letter: "B",
        octave: 1
    });
    var customNumFrets = defaultNumFrets - 1;
    var customIsChordMode = !defaultIsChordMode;
    var customNoteClickingDisabled = !defaultNoteClickingDisabled;
    var customAllNoteLetters = angular.copy(defaultAllNoteLetters);
    customAllNoteLetters[0] = "New letter"
    var customNoteMode = "letter";
    var customIntervalSettings = angular.copy(defaultIntervalSettings);
    customIntervalSettings.root = "F";
    var customAnimationSpeed = 0;
    var customNoteCircles = defaultNoteCircles.slice(0, defaultNoteCircles.length - 1);
    var customDimensionsFunc = function () { return {}; };
    // customNotesClickedCallbacks are spies created in each test.
    var customClickedNoteForStandardTuning = [{
        string: {
            letter: "E",
            octave: 4
        }, notes: [{
            fret: 1,
            cssClass: "red"
        }]
    }];

    var expectedCustomClickedNoteForStandardTuning = [{
        string: {
            letter: "E",
            octave: 4
        },
        notes: [{
            letter: "F",
            octave: 4,
            fret: 1,
            intervalInfo: {
                root: "F",
                interval: "1"
            },
            // TODO: bind cssClass
        }]
    }];

    beforeEach(angular.mock.module('angularFretboard'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $element = angular.element("<div fretboard config='config'></div>");
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    afterEach(function () {
        $rootScope.config = null;
    });

    describe("Configuration", function () {
        it("should overwrite the controller's initial undefined config properties with the fretboard's default state", function () {
            $rootScope.config = {};

            $compile($element)($rootScope);
            $rootScope.$digest();

            expect($rootScope.config.tuning).toEqual(defaultTuning);
            expect($rootScope.config.numFrets).toEqual(defaultNumFrets);
            expect($rootScope.config.isChordMode).toEqual(defaultIsChordMode);
            expect($rootScope.config.noteClickingDisabled).toEqual(defaultNoteClickingDisabled);
            expect($rootScope.config.allNoteLetters).toEqual(defaultAllNoteLetters);
            expect($rootScope.config.noteMode).toEqual(defaultNoteMode);
            expect($rootScope.config.intervalSettings).toEqual(defaultIntervalSettings);
            expect($rootScope.config.animationSpeed).toEqual(defaultAnimationSpeed);
            expect($rootScope.config.noteCircles).toEqual(defaultNoteCircles);
            expect($rootScope.config.clickedNotes).toEqual(defaultClickedNotes);
            expect(typeof $rootScope.config.dimensionsFunc).toEqual("function");
            expect($rootScope.config.notesClickedCallbacks).toEqual(defaultNotesClickedCallbacks);
            verifyAllNotesOnFretboard($rootScope.config.allNotes, defaultTuning, defaultNumFrets, defaultAllNoteLetters);
        });

        it("should not overwrite the controller's initial defined config properties, but should update the initial clickedNotes on the config with additional information from the plugin before invoking the notesClickedCallbacks", function () {
            var clickedNotesDuringCallbacks;

            var tempObj = {
                func1: function () {
                    clickedNotesDuringCallbacks = $rootScope.config.clickedNotes;
                },
                func2: function () { }
            };

            spyOn(tempObj, 'func1').and.callThrough();
            spyOn(tempObj, 'func2').and.callThrough();

            var customNotesClickedCallbackSpies = [tempObj.func1, tempObj.func2];

            var customConfig = {
                tuning: customTuning,
                numFrets: customNumFrets,
                isChordMode: customIsChordMode,
                noteClickingDisabled: customNoteClickingDisabled,
                allNoteLetters: customAllNoteLetters,
                noteMode: customNoteMode,
                intervalSettings: customIntervalSettings,
                animationSpeed: customAnimationSpeed,
                noteCircles: customNoteCircles,
                clickedNotes: customClickedNoteForStandardTuning,
                dimensionsFunc: customDimensionsFunc,
                notesClickedCallbacks: customNotesClickedCallbackSpies
            };

            $rootScope.config = customConfig;

            $compile($element)($rootScope);
            $rootScope.$digest();

            expect($rootScope.config.tuning).toEqual(customTuning);
            expect($rootScope.config.numFrets).toEqual(customNumFrets);
            expect($rootScope.config.isChordMode).toEqual(customIsChordMode);
            expect($rootScope.config.noteClickingDisabled).toEqual(customNoteClickingDisabled);
            expect($rootScope.config.allNoteLetters).toEqual(customAllNoteLetters);
            expect($rootScope.config.noteMode).toEqual(customNoteMode);
            expect($rootScope.config.intervalSettings).toEqual(customIntervalSettings);
            expect($rootScope.config.animationSpeed).toEqual(customAnimationSpeed);
            expect($rootScope.config.noteCircles).toEqual(customNoteCircles);
            expect($rootScope.config.dimensionsFunc).toEqual(customDimensionsFunc);
            expect($rootScope.config.notesClickedCallbacks).toEqual(customNotesClickedCallbackSpies);
            expect(tempObj.func1).toHaveBeenCalled();
            expect(tempObj.func2).toHaveBeenCalled();
            expect(clickedNotesDuringCallbacks).toEqual(expectedCustomClickedNoteForStandardTuning);
            expect($rootScope.config.clickedNotes).toEqual(expectedCustomClickedNoteForStandardTuning);
            verifyAllNotesOnFretboard($rootScope.config.allNotes, customTuning, customNumFrets, customAllNoteLetters);
        });

        it("should change the tuning, numFrets, and intervalSettings in the plugin, before updating existing clickedNotes and allNotes on the config and invoking the notesClickedCallbacks, while not changing all other config properties", function () {
            var bFlatMaj7ChordForStandardATuningCopy = angular.copy(bFlatMaj7ChordForStandardATuning);
            var customNumFrets = 3;
            var customIntervalSettings = angular.copy(defaultIntervalSettings);

            customIntervalSettings.root = "C#/Db";
            customIntervalSettings.intervals[4] = "Major third";;

            var expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow3rdFret = [
                bFlatMaj7ChordForStandardATuningCopy[0],
                bFlatMaj7ChordForStandardATuningCopy[4],
                bFlatMaj7ChordForStandardATuningCopy[5]
            ];

            expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow3rdFret[0].notes[0].letter = "F";
            expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow3rdFret[0].notes[0].octave = 4;
            expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow3rdFret[0].notes[0].intervalInfo = {
                root: "C#/Db",
                interval: "Major third"
            };

            expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow3rdFret[1].notes[0].letter = "A#/Bb";
            expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow3rdFret[1].notes[0].octave = 2;
            expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow3rdFret[1].notes[0].intervalInfo = {
                root: "C#/Db",
                interval: "6"
            };

            expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow3rdFret[2].notes[0].letter = "F";
            expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow3rdFret[2].notes[0].octave = 2;
            expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow3rdFret[2].notes[0].intervalInfo = {
                root: "C#/Db",
                interval: "Major third"
            };

            $rootScope.config = {
                clickedNotes: cMaj7ChordForStandardTuning
            };

            $compile($element)($rootScope);
            $rootScope.$digest();

            var clickedNotesDuringCallbacks;

            var tempObj = {
                func1: function () {
                    clickedNotesDuringCallbacks = $rootScope.config.clickedNotes;
                },
                func2: function () { }
            };

            spyOn(tempObj, 'func1').and.callThrough();
            spyOn(tempObj, 'func2').and.callThrough();

            var customNotesClickedCallbackSpies = [tempObj.func1, tempObj.func2];

            // Things that can affect clickedNotes.
            $rootScope.config.tuning = standardATuning;
            $rootScope.config.numFrets = customNumFrets;
            $rootScope.config.intervalSettings = customIntervalSettings;
            $rootScope.config.notesClickedCallbacks = customNotesClickedCallbackSpies;

            $rootScope.config.isChordMode = customIsChordMode;
            $rootScope.config.noteClickingDisabled = customNoteClickingDisabled;
            $rootScope.config.allNoteLetters = customAllNoteLetters;
            $rootScope.config.noteMode = customNoteMode;
            $rootScope.config.animationSpeed = customAnimationSpeed;
            $rootScope.config.noteCircles = customNoteCircles;
            $rootScope.config.dimensionsFunc = customDimensionsFunc;

            $rootScope.$digest();

            expect($rootScope.config.notesClickedCallbacks).toEqual(customNotesClickedCallbackSpies);
            expect(tempObj.func1).toHaveBeenCalled();
            expect(tempObj.func2).toHaveBeenCalled();
            expect(clickedNotesDuringCallbacks).toEqual(expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow3rdFret);
            expect($rootScope.config.clickedNotes).toEqual(expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow3rdFret);
            expect($rootScope.config.tuning).toEqual(standardATuning);
            expect($rootScope.config.numFrets).toEqual(customNumFrets);
            expect($rootScope.config.intervalSettings).toEqual(customIntervalSettings);

            expect($rootScope.config.isChordMode).toEqual(customIsChordMode);
            expect($rootScope.config.noteClickingDisabled).toEqual(customNoteClickingDisabled);
            expect($rootScope.config.allNoteLetters).toEqual(customAllNoteLetters);
            expect($rootScope.config.noteMode).toEqual(customNoteMode);
            expect($rootScope.config.animationSpeed).toEqual(customAnimationSpeed);
            expect($rootScope.config.noteCircles).toEqual(customNoteCircles);
            expect($rootScope.config.dimensionsFunc).toEqual(customDimensionsFunc);
            verifyAllNotesOnFretboard($rootScope.config.allNotes, standardATuning, customNumFrets, defaultAllNoteLetters);
        });

        it("should change the tuning, numFrets, intervalSettings, and then clicked notes in the plugin, before updating clickedNotes and allNotes on the config and invoking the notesClickedCallbacks", function () {
            var cMaj7ChordForStandardTuningCopy = angular.copy(cMaj7ChordForStandardTuning);
            var bFlatMaj7ChordForStandardATuningCopy = angular.copy(bFlatMaj7ChordForStandardATuning);
            var originalNumFrets = 3;
            var newNumFrets = originalNumFrets + 1;
            var customIntervalSettings = angular.copy(defaultIntervalSettings);

            customIntervalSettings.root = "C#/Db";
            customIntervalSettings.intervals[4] = "Major third";;

            var cMaj7ChordForStandardTuningAtOrBelow3rdFret = [
                cMaj7ChordForStandardTuningCopy[0],
                cMaj7ChordForStandardTuningCopy[4],
                cMaj7ChordForStandardTuningCopy[5]
            ];

            var bFlatMaj7ChordForStandardATuningAtOrBelow4thFret = [
                bFlatMaj7ChordForStandardATuningCopy[0],
                bFlatMaj7ChordForStandardATuningCopy[2],
                bFlatMaj7ChordForStandardATuningCopy[4],
                bFlatMaj7ChordForStandardATuningCopy[5]
            ];

            var expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow4thFret = angular.copy(bFlatMaj7ChordForStandardATuningAtOrBelow4thFret);

            expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow4thFret[0].notes[0].letter = "F";
            expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow4thFret[0].notes[0].octave = 4;
            expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow4thFret[0].notes[0].intervalInfo = {
                root: "C#/Db",
                interval: "Major third"
            };

            expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow4thFret[1].notes[0].letter = "A";
            expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow4thFret[1].notes[0].octave = 3;
            expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow4thFret[1].notes[0].intervalInfo = {
                root: "C#/Db",
                interval: "b6"
            };

            expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow4thFret[2].notes[0].letter = "A#/Bb";
            expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow4thFret[2].notes[0].octave = 2;
            expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow4thFret[2].notes[0].intervalInfo = {
                root: "C#/Db",
                interval: "6"
            };

            expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow4thFret[3].notes[0].letter = "F";
            expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow4thFret[3].notes[0].octave = 2;
            expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow4thFret[3].notes[0].intervalInfo = {
                root: "C#/Db",
                interval: "Major third"
            };

            $rootScope.config = {
                numFrets: originalNumFrets,
                clickedNotes: cMaj7ChordForStandardTuningAtOrBelow3rdFret
            };

            $compile($element)($rootScope);
            $rootScope.$digest();

            var clickedNotesDuringCallbacks;

            var tempObj = {
                func1: function () {
                    clickedNotesDuringCallbacks = $rootScope.config.clickedNotes;
                },
                func2: function () { }
            };

            spyOn(tempObj, 'func1').and.callThrough();
            spyOn(tempObj, 'func2').and.callThrough();

            var customNotesClickedCallbackSpies = [tempObj.func1, tempObj.func2];

            $rootScope.config.clickedNotes = bFlatMaj7ChordForStandardATuningAtOrBelow4thFret;
            $rootScope.config.tuning = standardATuning;
            $rootScope.config.numFrets = newNumFrets;
            $rootScope.config.intervalSettings = customIntervalSettings;
            $rootScope.config.notesClickedCallbacks = customNotesClickedCallbackSpies;

            $rootScope.$digest();

            expect(tempObj.func1).toHaveBeenCalled();
            expect(tempObj.func2).toHaveBeenCalled();
            expect(clickedNotesDuringCallbacks).toEqual(expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow4thFret);
            expect($rootScope.config.clickedNotes).toEqual(expectedBFlatMaj7ChordFromFretboardForStandardATuningAtOrBelow4thFret);
            verifyAllNotesOnFretboard($rootScope.config.allNotes, standardATuning, newNumFrets, defaultAllNoteLetters);
        });
    });

    // It would be best to create each note by hand for verification, but this should do for now.
    function verifyAllNotesOnFretboard(allNotesToVerify, tuning, numFrets, allNoteLetters) {
        expect(allNotesToVerify.length).toEqual(tuning.length);

        for (var i = 0; i < allNotesToVerify.length; i++) {
            expect(allNotesToVerify[i].notes.length).toEqual(numFrets + 1);
            verifyNotesOnString(allNotesToVerify[i], tuning[i], allNoteLetters);
        }
    }

    function verifyNotesOnString(stringToVerify, tuningNote, allNoteLetters) {
        expect(stringToVerify.string).toEqual(tuningNote);

        for (var i = 0; i < stringToVerify.notes.length; i++) {
            var currentNote = stringToVerify.notes[i];
            var currentNoteLetterIndex = allNoteLetters.indexOf(currentNote.letter);

            expect(currentNote.fret).toEqual(i);

            if (i === 0) {
                expect(currentNote.letter).toEqual(tuningNote.letter);
                expect(currentNote.octave).toEqual(tuningNote.octave);
                expect(currentNoteLetterIndex).not.toEqual(-1);
            } else {
                var lastNote = stringToVerify.notes[i - 1];
                var lastNoteIndex = allNoteLetters.indexOf(lastNote.letter);

                expect(currentNoteLetterIndex).toEqual(lastNoteIndex === 11 ? 0 : lastNoteIndex + 1);
                expect(currentNote.octave).toEqual(lastNoteIndex === 11 ? lastNote.octave + 1 : lastNote.octave);
            }
        }
    }
});