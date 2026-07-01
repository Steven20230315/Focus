import { defineConfig } from 'npm-check-updates';

export default defineConfig({
  target: 'latest',
  upgrade: true,
  cooldown: '7d',
  packageManager: 'pnpm',
  filter: [/.*/],
});
