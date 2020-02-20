# Development

## Pre-requisites
- Android Studio
- Ruby
- Bundler

## Development

1. Open `/android` directory with Android Studio
2. Start Android emulator through Android Studio
3. Run `yarn run-android` in `/mobile` directory
4. Go to apps on emulator and click TruDev

## Release

```
bundle install --path vendor/bundle
bundle exec fastlane beta
```

Note: This requires `key.json` (Play store authentication key) to be present in `/android` directory. Get from 1Pass.

## Play Store

The Play Store allows you to upload a new APK without changing the version number.Each commit to master uploads a newly build APK
to the Play Store. If you need to release a new native version of the binary, just go to Google Play Console and select a new APK to release. 
