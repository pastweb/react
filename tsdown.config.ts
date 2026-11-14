import { defineConfig } from 'tsdown';
import { preserveDirectives } from 'rollup-plugin-preserve-directives';

/**
 * Dual ESM + CJS, unbundled modules, auto package exports:
 * { import: './dist/....js', require: './dist/....cjs' }
 */
export default defineConfig({
  platform: 'neutral',
  clean: true,
  entry: 'src/**/*.ts',
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  unbundle: true,
  deps: {
    neverBundle: ['react', /^react\//, 'react-dom', /^react-dom\//, '@pastweb/tools'],
  },
  plugins: [
    preserveDirectives({
      include: ['use client', 'use server'],
    }),
  ],
  exports: {
    all: true,
  },
});
