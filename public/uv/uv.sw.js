// uv.sw.js
// Import UV bundle and config in order
importScripts('/uv/uv.bundle.js');
importScripts('/uv/uv.config.js');

// Initialize UVServiceWorker if available
if (self.UVServiceWorker) {
  self.uvWorker = new UVServiceWorker();
  console.log('UVServiceWorker instantiated.');
} else {
  console.error('UVServiceWorker is not defined.');
}
