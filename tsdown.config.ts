import { defineConfig } from 'tsdown';
import { preserveDirectives } from 'rollup-plugin-preserve-directives';

export default defineConfig({
  platform: 'neutral',
  clean: true,
  entry: 'src/**/*.ts',
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  unbundle: true,
  plugins: [
    preserveDirectives({
      include: ['use client', 'use server'],
    }),
  ],
  exports: {
    all: true,
  },
});
