/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/system-dynamics-editor/',
  test: {
    environment: 'node',
  },
});
