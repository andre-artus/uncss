'use strict';

var expect    = require('chai').expect,
    uncss     = require('./../src/uncss.js');

var invalidCss = 'We need to create a string longer than 40 characters to ' +
                 'check if the error string we are creating is helpful';

describe('Error reporting', function () {

    it('No callback', function () {
        var throwTest = function () {
            uncss('<html></html>', { stylesheets: ['nonexistant'] });
        };
        expect(throwTest).to.throw(TypeError);
    });

    it('Invalid options.stylesheets', function (done) {
        uncss('<html></html>', { stylesheets: ['nonexistent'] }, function (error, output) {
            expect(output).to.not.exist;
            expect(error).to.exist;
            done();
        });
    });

    it('Invalid options.stylesheets with URL', function (done) {
        uncss('<html></html>', { stylesheets: ['http://invalid'] }, function (error, output) {
            expect(output).to.not.exist;
            expect(error).to.exist;
            done();
        });
    });

    it('Invalid options.raw', function (done) {
        uncss('<html></html>', { raw: ['.test { margin: 0 }'] }, function (error, output) {
            expect(output).to.not.exist;
            expect(error).to.exist;
            done();
        });
    });

    it('No stylesheet found', function (done) {
        uncss('<html><body></body></html>', function (error, output) {
            expect(output).to.not.exist;
            expect(error).to.exist;
            done();
        });
    });

    it('PhantomJS errors', function (done) {
        uncss(['nonexistent.html'], function (error, output) {
            expect(output).to.not.exist;
            expect(error).to.exist;
            done();
        });
    });

    it('css-parse errors', function (done) {
        uncss(
            ['tests/selectors/index.html'],
            { raw: invalidCss },
            function (error, output) {
                expect(output).to.not.exist;
                expect(error.message).to.contain('unable to parse');
                done();
            }
        );
    });

    it('css-parse errors (minified stylesheet)', function (done) {
        uncss(
            ['tests/selectors/index.html'],
            { stylesheets: ['../coverage/minified.css'] },
            function (error, output) {
                expect(output).to.not.exist;
                expect(error.message).to.contain('unable to parse');
                done();
            }
        );
    });

    it('Report should be generated only if specified', function (done) {
        uncss(['tests/selectors/index.html'], function (error, output, report) {
            expect(report).to.be.undefined;
            done();
        });
    });

    it('Reports when the uncssrc file does not exist', function (done) {
        uncss(['selectors/index.html'], { uncssrc: 'nonexistent'}, function (err) {
            expect(err.code).to.equal('ENOENT');

            done();
        });
    });

    it('Reports errors in the uncssrc file', function (done) {
        uncss(['selectors/index.html'], { uncssrc: 'tests/coverage/.invaliduncssrc' }, function (err) {
            expect(err).to.be.an.instanceOf(SyntaxError);
            expect(err.message).to.equal('UnCSS: uncssrc file is invalid JSON.');

            done();
        });
    });
});
