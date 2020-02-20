# Development

## Pre-requisites
- XCode
- Ruby
- Bundler

## Development

1. Run `yarn run-ios` in `/mobile` directory
2. Go to apps on emulator and click TruDev

## Release

```
bundle install --path vendor/bundle
bundle exec fastlane beta
```

## Code Push

Each commit to master sends the JS bundle to each users phone via Code Push. This means that any JS change will automatically
deploy to users without needing to release a new version of the app through the app store

## App Store

When native changes are made to the application, the version number should also be incremented resulting in a new binary upload
that needs to be released via the App Store. CodePush will automatically stop pushing JS bundles to any device running the old
binary version to prevent crashes related to JS code calling across the native bridge to native code that's not in the binary
