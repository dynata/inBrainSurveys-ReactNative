require "json"
require "fileutils"
require "digest"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

ios_dir = File.join(__dir__, "ios")
xcframework_dir = File.join(ios_dir, "InBrainSurveys.xcframework")
xcframework_zip = File.join(ios_dir, "InBrainSurveys.xcframework.zip")
stamp_file = File.join(ios_dir, ".InBrainSurveys.xcframework.sha256")

if File.exist?(xcframework_zip)
  expected_sha = Digest::SHA256.file(xcframework_zip).hexdigest
  installed_sha = File.exist?(stamp_file) ? File.read(stamp_file).strip : nil

  if !Dir.exist?(xcframework_dir) || installed_sha != expected_sha
    tmp_dir = File.join(ios_dir, ".xcframework-extract-#{Process.pid}")
    FileUtils.rm_rf(tmp_dir)
    FileUtils.mkdir_p(tmp_dir)
    begin
      unless system("unzip", "-qo", xcframework_zip, "-d", tmp_dir)
        raise "Failed to unzip #{xcframework_zip}"
      end

      extracted = File.join(tmp_dir, "InBrainSurveys.xcframework")
      raise "Expected #{extracted} after unzipping" unless Dir.exist?(extracted)

      FileUtils.rm_rf(xcframework_dir)
      FileUtils.mv(extracted, xcframework_dir)
      File.write(stamp_file, expected_sha)
    ensure
      FileUtils.rm_rf(tmp_dir)
    end
  end
end

Pod::Spec.new do |s|
  s.name         = package["name"]
  s.version      = package["version"]
  s.description  = package["description"]
  s.summary      = "Monetization surveys for apps, powered by inBrain.ai."

  s.license      = package["license"]

  s.author       = package["author"]
  s.homepage     = "https://github.com/dynata/inBrainSurveys-ReactNative"

  
  s.platforms    = { :ios => "12.0" }
  s.source       = { :git => "https://github.com/dynata/inBrainSurveys-ReactNative.git", :tag => "#{s.version}" }

  s.source_files = "ios/*.{h,m,swift}"
  s.vendored_frameworks = "ios/InBrainSurveys.xcframework"
  s.ios.frameworks = "UIKit", "Foundation", "SystemConfiguration", "WebKit"
  s.static_framework = true

  s.dependency "React"

end
