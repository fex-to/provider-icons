import fs from 'fs'
import { getRollupPlugins } from '../../.build/build-icons.mjs'

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'))

import sizes from '@atomico/rollup-plugin-sizes';
import { createRequire } from 'module';

const packageName = '@fex.to/provider-icons-react';

const require = createRequire(import.meta.url);
const outputFileName = 'provider-icons-react';
const outputDir = 'dist';
const inputs = ['./src/provider-icons-react.js'];
const bundles = [
  {
    format: 'umd',
    inputs,
    outputDir,
    minify: true,
  },
  {
    format: 'umd',
    inputs,
    outputDir,
  },
  {
    format: 'cjs',
    inputs,
    outputDir,
  },
  {
    format: 'es',
    inputs,
    outputDir,
  },
  {
    format: 'esm',
    inputs,
    outputDir,
    preserveModules: true,
  },
];

const configs = bundles
    .map(({ inputs, outputDir, format, minify, preserveModules }) =>
        inputs.map(input => ({
          input,
          plugins: getRollupPlugins(pkg, minify),
          external: ['react', 'prop-types'],
          output: {
            name: packageName,
            ...(preserveModules
                ? {
                  dir: `${outputDir}/${format}`,
                }
                : {
                  file: `${outputDir}/${format}/${outputFileName}${minify ? '.min' : ''}.js`,
                }),
            format,
            sourcemap: true,
            preserveModules,
            globals: {
              react: 'react',
              'prop-types': 'PropTypes'
            },
          },
        })),
    )
    .flat();

export default configs;