import esbuild from 'esbuild';

esbuild
  .build({
    entryPoints: ['./post-manager/main.ts'], // Adjust this to your entry TypeScript file
    bundle: true,
    platform: 'node',
    target: 'node20',
    external: ['sharp'], // Externalize the "sharp" package
    outfile: './post-manager/dist/main.js',
    sourcemap: true,
    tsconfig: './tsconfig.json',
    loader: {
      '.ts': 'ts', // Use the 'ts' loader for TypeScript files
      '.js': 'ts', // Also use the 'ts' loader for JavaScript files (CommonJS modules)
    },
  })
  .catch(() => process.exit(1));
