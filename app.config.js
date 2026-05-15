const base = require('./app.json');

module.exports = {
  expo: {
    ...base.expo,
    plugins: [
      ...(base.expo.plugins || []),
      '@react-native-firebase/auth',
    ],
    android: {
      ...base.expo.android,
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON || './google-services.json',
    },
  },
};
