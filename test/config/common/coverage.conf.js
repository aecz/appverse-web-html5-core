'use strict';

module.exports = {

    reporters: ['progress', 'coverage'],

    preprocessors: {
        // source files, that you wanna generate coverage for
        // do not include tests or libraries
        // (these files will be instrumented by Istanbul)
        'src/directives/*.js': ['coverage'],
        'src/modules/*.js': ['coverage'],
    },

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    }
};