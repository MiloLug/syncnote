module.exports = {
    pwa: {
        workboxPluginMode: 'GenerateSW',
        workboxOptions: {
            navigateFallback: '/index.html',
            runtimeCaching: [
                {
                    urlPattern: new RegExp('^http://localhost:8100/'),
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