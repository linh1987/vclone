import typescript from 'rollup-plugin-typescript';

export default {
    name: 'vclone',
    input: 'src/index.ts',
    output: {
      file: 'dist/bundle.js',
      format: 'iife'
    },
    plugins: [ typescript() ]    
  };