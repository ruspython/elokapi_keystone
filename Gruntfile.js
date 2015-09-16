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
					'bower_components/whatsapp-sharing/dist/whatsapp-button.js'
					//'public/js/custom/script.js',
				],
				dest: '.tmp/js/script.js'
			}
		},
		uglify: {
			production: {
				files: {
					'public/js/script.js': '.tmp/js/script.js'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	

	grunt.registerTask('default', ['less', 'concat', 'uglify']);

};
