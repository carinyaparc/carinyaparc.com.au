const config = {
  plugins: [
    '@tailwindcss/postcss',
    'autoprefixer',
    // CSS optimization for production
    ...(process.env.NODE_ENV === 'production'
      ? [
          [
            'cssnano',
            {
              preset: [
                'default',
                {
                  discardComments: {
                    removeAll: true,
                  },
                  reduceIdents: false, // Keep this false to preserve CSS variables
                  normalizeUnicode: false, // Keep this false for better compatibility
                },
              ],
            },
          ],
        ]
      : []),
  ],
};

export default config;
