module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            options: {
                dateFormat: function (time) {
                    grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
                    grunt.log.writeln('Waiting for more changes...');
                }
            },
            scripts: {
                files: ['cos.js', 'lib/**/*.js', 'test/*.js'],
                tasks: ''
            },
            cos: {
                files: ['cos.js', 'lib/**/*.js', 'test/*.js'],
                tasks: 'nodeunit:cos'
            },
            upload: {
                files: ['cos.js', 'lib/**/*.js', 'test/*.js'],
                tasks: 'nodeunit:upload'
            }
        },

        nodeunit: {
            cos: 'test/cos_test.js',
            bucket: 'test/bucket_test.js',
            bucketuri: 'test/bucketuri_test.js',
            file: 'test/file_test.js',
            prototype: 'test/prototype_test.js',
            sign: 'test/sign_test.js',
            upload: 'test/upload_test.js'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ["watch"]);

    // Test task(s).
    grunt.registerTask('test', ["nodeunit"]);
    grunt.registerTask('test-cos', ["nodeunit:cos", "watch:cos"]);
    grunt.registerTask('test-upload', ["nodeunit:upload", "watch:upload"]);
    grunt.registerTask('test-file', ["nodeunit:file", "watch:file"]);
    grunt.registerTask('test-bucket', ["nodeunit:bucket", "watch:bucket"]);
};