import { cloudflare } from '@cloudflare/vite-plugin';
import { sites } from '@openai/sites-vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isVercelBuild = mode === 'vercel';

  return {
    plugins: [
      react(),
      ...(!isVercelBuild ? [
        sites(),
        cloudflare({
          viteEnvironment: { name: 'server' },
          config: {
            main: './worker/index.ts',
            compatibility_date: '2026-05-22',
            assets: {
              not_found_handling: 'single-page-application' as const,
              run_worker_first: ['/api/*'],
            },
          },
        }),
      ] : []),
    ],
    server: { port: 4173 },
    preview: { port: 4173 },
  };
});
