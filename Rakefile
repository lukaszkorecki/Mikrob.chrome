require 'fileutils'

desc "Run QUnit tests, requires phantomjs"
task :tests do
  STDOUT << `phantomjs test/runner.js file://#{FileUtils.pwd}/test.html`
end
