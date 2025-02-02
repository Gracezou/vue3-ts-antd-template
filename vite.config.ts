/// <reference types="vitest" />
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { createVitePlugins } from './plugins'
import { OUTPUT_DIR } from './plugins/constants'

const baseSrc = fileURLToPath(new URL('./src', import.meta.url))
// https://vitejs.dev/config/
export default defineConfig({
  plugins: createVitePlugins(),
  define: {
    // eslint-disable-next-line node/prefer-global/process
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  resolve: {
    alias: [
      {
        find: 'dayjs',
        replacement: 'dayjs/esm',
      },
      {
        find: /^dayjs\/locale/,
        replacement: 'dayjs/esm/locale',
      },
      {
        find: /^dayjs\/plugin/,
        replacement: 'dayjs/esm/plugin',
      },
      {
        find: /^ant-design-vue\/es$/,
        replacement: 'ant-design-vue/es',
      },
      {
        find: /^ant-design-vue\/dist$/,
        replacement: 'ant-design-vue/dist',
      },
      {
        find: /^ant-design-vue\/lib$/,
        replacement: 'ant-design-vue/es',
      },
      {
        find: /^ant-design-vue$/,
        replacement: 'ant-design-vue/es',
      },
      {
        find: 'lodash',
        replacement: 'lodash-es',
      },
      {
        find: '~@',
        replacement: baseSrc,
      },
      {
        find: '~',
        replacement: baseSrc,
      },
      {
        find: '@',
        replacement: baseSrc,
      },
      {
        find: '~#',
        replacement: resolve(baseSrc, './enums'),
      },
    ],
  },
  build: {
    chunkSizeWarningLimit: 4096,
    outDir: OUTPUT_DIR,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia', 'vue-i18n', '@vueuse/core'],
          antd: ['ant-design-vue', '@ant-design/icons-vue', 'dayjs'],
        },
      },
    },
  },
  server: {
    port: 5000,
    host: '0.0.0.0',
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
