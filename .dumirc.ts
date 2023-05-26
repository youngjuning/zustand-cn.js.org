import { defineConfig } from 'dumi';

export default defineConfig({
  favicons: ['https://docs.pmnd.rs/zustand.ico'],
  autoAlias: false,
  themeConfig: {
    name: 'Zustand',
    logo: 'https://docs.pmnd.rs/zustand.ico',
    prefersColor: { default: 'auto' },
    socialLinks: {
      github: 'https://github.com/youngjuning/youngjuning.js.org',
      twitter: 'https://twitter.com/luozhu2021'
    },
    hd: { rules: [] },
  },
  theme: {
    '@c-primary': '#e5743f',
  },
  publicPath: '/',
  analytics: {
    // TODO 配置 Google Analytics 代码
    // ga_v2: '',
  },
  sitemap: {
    hostname: 'https://zustand.js.org',
  },
  hash: true,
  exportStatic: {},
  ...(process.env.NODE_ENV === 'development' ? {} : { ssr: {} }),
  headScripts: [
    {src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7029815294762181', async: true, crossorigin: 'anonymous'},
  ]
});
