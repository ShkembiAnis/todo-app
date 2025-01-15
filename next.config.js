/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: process.env.BASE_PATH,
  //assetPrefix: process.env.BASE_PATH,
  env: {
    BASE_PATH: process.env.BASE_PATH, // pulls from .env file
    CLOUDANT_URL: process.env.CLOUDANT_URL,
    CLOUDANT_APIKEY: process.env.CLOUDANT_APIKEY,
    CLOUDANT_DB_NAME: process.env.CLOUDANT_DB_NAME

  },
  rewrites: async () => {
    return [
      {
        source: '/health',
        destination: '/api/health',
      },
    ];
  }
}

module.exports = nextConfig
