import react from '@vitejs/plugin-react'
import {defineConfig} from 'vite'
import * as path from "node:path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server:{
        port:8080
    },
    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, './src'),
            '@components': path.resolve(import.meta.dirname, './src/components'),
        }
    }
})
