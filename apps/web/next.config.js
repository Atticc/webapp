/** @type {import('next').NextConfig} */
// const { i18n } = require('./next-i18next.config');
const { withSentryConfig } = require('@sentry/nextjs');
// const withTM = require('next-transpile-modules')(['ui']);
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

const moduleExports = {
  // swcMinify: true,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  // trailingSlash: true,
  eslint: {
    dirs: ['src'],
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    
    if (!isServer) {
      config.resolve.fallback.fs = false
    }
    return config
  },
  // i18n,
}

module.exports = withBundleAnalyzer(withSentryConfig(moduleExports));
