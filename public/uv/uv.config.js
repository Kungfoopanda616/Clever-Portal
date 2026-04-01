// uv.config.js
self.uvConfig = {
  paths: {
    prefix: '/uv/',          // base URL prefix for UV assets
    bundle: 'uv.bundle.js',  // bundle filename
    handler: 'uv.handler.js',// handler script filename
    worker: 'uv.sw.js',      // worker script filename
    config: 'uv.config.js'   // config filename
  },
  // add other configuration options as needed
};
