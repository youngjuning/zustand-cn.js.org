import { defineConfig } from 'dumi';

export default defineConfig({
  favicons: ['https://docs.pmnd.rs/zustand.ico'],
  autoAlias: false,
  themeConfig: {
    name: 'Zustand',
    logo: 'https://docs.pmnd.rs/zustand.ico',
    prefersColor: { default: 'auto' },
    editLink: "https://github.com/youngjuning/zustand-cn.js.org/edit/main/{filename}",
    socialLinks: {
      github: 'https://github.com/youngjuning/zustand-cn.js.org',
      twitter: 'https://twitter.com/luozhu2021'
    },
    hd: { rules: [] },
    footer: 'Made with ❤️ by <a href="https://github.com/zizhuspot" target="_blank">紫竹光点计划</a>'
  },
  theme: {
    '@c-primary': '#e5743f',
  },
  publicPath: '/',
  analytics: {
    ga_v2: 'G-6LFJYQB43N',
  },
  sitemap: {
    hostname: 'https://zustand-cn.js.org',
  },
  hash: true,
  exportStatic: {},
  ...(process.env.NODE_ENV === 'development' ? {} : { ssr: {} }),
  metas: [
    {
      name: 'monetag',
      content: '7b2a7831ac5964573bde2e021b7001f6',
    },
  ],
  headScripts: [
    {src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7029815294762181', async: true, crossorigin: 'anonymous'},
  ],
  scripts: [
    `(function(d,z,s){s.src='https://'+d+'/400/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('autchoog.net',6444996,document.createElement('script'))`
  ]
});
