import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
    input: 'js/utils/app.js',
    output: {
        file: 'dist/bundle.js',
        format: 'es',
        sourcemap: true
    },
    plugins: [
        nodeResolve(),
        terser({
            format: {
                comments: false
            }
        })
    ],
    watch: {
        include: 'js/**'
    }
};
