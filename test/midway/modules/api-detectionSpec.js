/*jshint expr:true */
'use strict';

describe('Midway: Api Detection Module', function() {

    var DetectionProvider;
    var Detection;

    beforeEach(function() {
        module('AppDetection');
    });

    describe('when the provider is injected', function() {

        beforeEach(inject(function(_Detection_) {
            Detection = _Detection_;
        }));

        it ('it should have identified whether AppverseMobile is present', function() {

            expect(Detection.hasAppverseMobile).to.be.a('boolean');

        });

        it ('it should have identified whether the browser is mobile', function() {

            expect(Detection.isMobileBrowser).to.be.a('boolean');

        });

    });

});