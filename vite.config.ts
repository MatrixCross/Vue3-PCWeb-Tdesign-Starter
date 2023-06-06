import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import unocss from 'unocss/vite';
import autoImport from 'unplugin-auto-import/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import IconsResolver from 'unplugin-icons/resolver';
import icons from 'unplugin-icons/vite';
import { TDesignResolver } from 'unplugin-vue-components/resolvers';
import components from 'unplugin-vue-components/vite';
import { fileURLToPath, URL } from 'url';
import { ConfigEnv, loadEnv, UserConfig } from 'vite';
import { viteMockServe } from 'vite-plugin-mock';

const CWD = process.cwd();

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const { VITE_BASE_URL, VITE_API_URL_PREFIX } = loadEnv(mode, CWD);
  return {
    base: VITE_BASE_URL,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${path.resolve('src/style/variables.less')}";`,
          },
          math: 'strict',
          javascriptEnabled: true,
        },
      },
    },

    plugins: [
      vue(),
      vueJsx(),
      unocss(),
      viteMockServe({
        mockPath: 'mock',
        enable: true,
      }),
      autoImport({
        dts: './src/types/auto-imports.d.ts',
        imports: [
          'vue',
          'vue-router',
          'pinia',
          '@vueuse/core',
          {
            'tdesign-vue-next': ['MessagePlugin'],
          },
        ],
        dirs: ['./src/store', './src/hooks/**'],
        eslintrc: {
          enabled: true,
        },
      }),
      components({
        dts: './src/types/components.d.ts',
        types: [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }],
        resolvers: [
          TDesignResolver({
            library: 'vue-next',
          }),
          IconsResolver({
            customCollections: ['custom'],
          }),
        ],
      }),
      icons({
        autoInstall: true,
        compiler: 'vue3',
        customCollections: {
          custom: FileSystemIconLoader(fileURLToPath(new URL('./src/assets', import.meta.url))),
        },
      }),
    ],

    server: {
      port: 3002,
      host: '0.0.0.0',
      proxy: {
        [VITE_API_URL_PREFIX]: 'http://127.0.0.1:3000/',
      },
    },
  };
};
