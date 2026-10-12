// @ts-check
import { defineConfig } from 'astro/config';

// Static site: `npm run build` → dist/, shipped by ../deploy/deploy.sh.
// SITE_URL changes when Joey's own domain replaces the axon preview address.
export default defineConfig({
  site: process.env.SITE_URL || 'https://askjoey.axon.commun.cloud',
  build: { format: 'directory', inlineStylesheets: 'always' },
  server: { host: true, port: 4321 },
  devToolbar: { enabled: false },
});
