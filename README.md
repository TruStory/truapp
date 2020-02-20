# TruApp
  - React-Native mobile application
  - React + React-Native + React-Native-Web Web Application
  - Configured to run only with `TruStory/truchain` and `TruStory/octopus`
  - Please use the master branch to run the most stable version of TruApp
  
### Web Client Installation

TruApp Web requires [Node.js](https://nodejs.org/) v10+ to run.

```sh
$ git clone git@github.com:TruStory/truapp
$ cd truapp
$ yarn install
$ cd web
$ yarn start
```

### Mobile Client Installation

TruApp Web requires [Node.js](https://nodejs.org/) v10+, XCode 10.6+ and Pods >1.74 to run.

```sh
$ git clone git@github.com:TruStory/truapp
$ cd truapp
$ yarn install
$ cd mobile
$ yarn install
$ cd ios
$ bundle install --path vendor
$ bundle exec pod install
$ cd ..
$ yarn run-ios
```