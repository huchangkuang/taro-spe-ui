import NodePath from 'path'
import RollupJson from '@rollup/plugin-json'
import RollupNodeResolve from '@rollup/plugin-node-resolve'
import RollupCommonjs from '@rollup/plugin-commonjs'
import RollupTypescript from 'rollup-plugin-typescript2'
import RollupCopy from 'rollup-plugin-copy'
import RollupScss from 'rollup-plugin-scss'
import RollupPluginClear from 'rollup-plugin-clear'
import RollupImage from '@rollup/plugin-image'
import { terser } from 'rollup-plugin-terser'
import RollupAlias from '@rollup/plugin-alias'
import RollupBabel from 'rollup-plugin-babel'

import Package from '../package.json'

const resolveFile = path => NodePath.resolve(__dirname, path)
const relativeFile = path => NodePath.relative(__dirname, path)

const externalPackages = [
  'react',
  'react-dom',
  '@tarojs/components',
  '@tarojs/runtime',
  '@tarojs/taro',
  '@tarojs/react'
]

export default {
  input: resolveFile(relativeFile(Package.source)),
  output: [
    {
      file: resolveFile(relativeFile(Package.main)),
      format: 'cjs',
      sourcemap: true
    },
    {
      file: resolveFile(relativeFile(Package.module)),
      format: 'es',
      sourcemap: true
    },
    {
      file: resolveFile(relativeFile(Package.browser)),
      format: 'umd',
      name: 'taro-spe-ui',
      sourcemap: true,
      globals: {
        react: 'React',
        '@tarojs/components': 'components',
        '@tarojs/taro': 'Taro'
      }
    }
  ],
  external: externalPackages,
  plugins: [
    RollupNodeResolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    RollupCommonjs({
      include: /\/node_modules\//
    }),
    RollupAlias({
      entries: [{ find: '@', replacement: resolveFile('../src') }],
    }),
    RollupJson(),
    RollupScss(),
    RollupImage({
      include: ['**/*.png', '**/*.jpg', '**/*.svg']
    }),
    RollupPluginClear({
      targets: ['dist'],
      watch: true
    }),
    RollupBabel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      "presets": [
        [
          "taro", {
          framework: 'react'
        }
        ]
      ],
      "plugins": ["@babel/plugin-transform-runtime"]
    }),
    RollupTypescript({
      tsconfig: resolveFile('../tsconfig.rollup.json')
    }),
    terser(),
    RollupCopy({
      targets: [
        {
          src: resolveFile('../src/styles'),
          dest: resolveFile('../dist')
        }
      ]
    })
  ]
}
