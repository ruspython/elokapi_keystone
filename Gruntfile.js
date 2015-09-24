module.exports = function (grunt) {

	grunt.initConfig({
		less: {
			options: {
				paths: ["assets/css"]
			},
			files: {
				"public/styles/site.min.css": "public/styles/site.less"
			}
		},
		concat: {
			production: {
				src: [
					'bower_components/jquery/dist/jquery.js',
					'bower_components/responsive-nav/responsive-nav.js',
					'bower_components/whatsapp-sharing/dist/whatsapp-button.js',
					'public/js/custom/script.js'
				],
				dest: 'public/js/script.js'
			}
		},
		uglify: {
			production: {
				files: {
					'public/js/script.js': 'public/js/script.js'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');


	grunt.registerTask('version-assets', 'version the static assets just created', function() {

		var Version = require("node-version-assets");
		var versionInstance = new Version({
			assets: ['public/styles/site.min.css', 'public/js/script.js'],
			grepFiles: ['templates/views/layouts/default.hbs']
		});

		var cb = this.async(); // grunt async callback
		versionInstance.run(cb);
	});
	
	grunt.registerTask('default', ['less', 'concat', 'uglify']);

};
