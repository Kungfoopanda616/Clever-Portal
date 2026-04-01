// uv.config.js
self.uvConfig = {
  paths: {
    prefix: '/uv/',          // base URL prefix
    bundle: 'uv.bundle.js',  // bundle filename
    handler: 'uv.handler.js',// handler filename
    worker: 'uv.sw.js',      // worker filename
    config: 'uv.config.js'   // config filename
  },
  // add other options if needed
};
