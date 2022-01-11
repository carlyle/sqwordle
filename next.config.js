const { withPlausibleProxy } = require('next-plausible');

/** @type import('next').NextConfig */
const config = {
  reactStrictMode: true,
  trailingSlash: true,
};

module.exports = withPlausibleProxy({ subdirectory: 'plausible' })(config);
