module.exports = {
  name: 'StationScout',
  version: '1.0.0',
  owner: 'wambs',
  extra: {
    clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    eas: {
      projectId: '89c8c7d3-8936-4d38-a764-6aa1e93aa1fd'
    }
  },
  android: {
    package: 'com.wambs.stationscout' // Make sure this is unique and correctly formatted
  }
};
