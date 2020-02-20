/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path');

module.exports = {
  projectRoot: path.resolve(__dirname),
  watchFolders: [
    path.resolve(__dirname, "../shared"),
    path.resolve(__dirname, "../node_modules")
  ],
  transformer: {
    babelTransformerPath: require.resolve('react-native-typescript-transformer')
  },
  resolver: {
    extraNodeModules: {
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
      'react-native-vector-icons': path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
      'react-navigation': path.resolve(__dirname, 'node_modules/react-navigation'),
    },
  },
  maxWorkers: 2
};
