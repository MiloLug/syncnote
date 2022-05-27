module.exports = {
    pwa: {
        workboxPluginMode: 'GenerateSW',
        workboxOptions: {
            navigateFallback: '/index.html',
            runtimeCaching: [
                {
                    urlPattern: new RegExp(`^${process.env.VUE_APP_FRONTEND_BASE_URL}`),
                    handler: 'NetworkFirst',
                    options: {
                        networkTimeoutSeconds: 10,
                        cacheName: 'syncnote-cache',
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                }
            ]
        }
    }
}