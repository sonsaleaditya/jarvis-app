module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',       // This is how you'll import env variables
      path: '.env',             // Path to your .env file
      blacklist: null,
      whitelist: null,
      safe: false,
      allowUndefined: true
    }]
  ],
};
