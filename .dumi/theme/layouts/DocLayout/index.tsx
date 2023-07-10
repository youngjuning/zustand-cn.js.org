// @ts-nocheck
import { ReactComponent as IconSidebar } from '@ant-design/icons-svg/inline-svg/outlined/align-left.svg';
import animateScrollTo from 'animated-scroll-to';
import {
  Helmet,
  useIntl,
  useLocation,
  useOutlet,
  useRouteMeta,
  useSidebarData,
  useSiteData,
} from 'dumi';
import Content from 'dumi/theme-default/slots/Content';
import Features from 'dumi/theme-default/slots/Features';
import Footer from 'dumi/theme-default/slots/Footer';
import Header from 'dumi/theme-default/slots/Header';
import Hero from 'dumi/theme-default/slots/Hero';
import Sidebar from '../../slots/Sidebar';
import Adsense from '../../slots/Adsense';
import Toc from 'dumi/theme-default/slots/Toc';
import React, { useEffect, useState, type FC } from 'react';
import './index.less';

const DocLayout: FC = () => {
  const intl = useIntl();
  const outlet = useOutlet();
  const sidebar = useSidebarData();
  const { hash, pathname } = useLocation();
  const { loading } = useSiteData();
  const [activateSidebar, updateActivateSidebar] = useState(false);
  const { frontmatter: fm } = useRouteMeta();

  const showSidebar = fm.sidebar !== false && sidebar?.length > 0;

  // handle hash change or visit page hash after async chunk loaded
  useEffect(() => {
    const id = hash.replace('#', '');

    if (id) {
      setTimeout(() => {
        const elm = document.getElementById(decodeURIComponent(id));

        if (elm) {
          // animated-scroll-to instead of native scroll
          animateScrollTo(elm.offsetTop - 80, {
            maxDuration: 300,
          });
        }
      }, 1);
    }
  }, [loading, hash]);

  return (
    <div
      className="dumi-default-doc-layout"
      data-mobile-sidebar-active={activateSidebar || undefined}
      onClick={() => updateActivateSidebar(false)}
    >
      <Helmet>
        <html lang={intl.locale.replace(/-.+$/, '')} />
        {fm.title && <title>{fm.title} - Zustand</title>}
        {fm.title && <meta property="og:title" content={fm.title} />}
        {fm.description && <meta name="description" content={fm.description} />}
        {fm.description && (
          <meta property="og:description" content={fm.description} />
        )}
        {fm.keywords && fm.keywords.map(keyword => (<meta key={keyword} property="article:tag" content={keyword}></meta>))}
        <link rel="canonical" href={window.location.origin + pathname}></link>
      </Helmet>
      <Header />
      <Hero />
      <Features />
      {showSidebar && (
        <div className="dumi-default-doc-layout-mobile-bar">
          <button
            type="button"
            className="dumi-default-sidebar-btn"
            onClick={(ev) => {
              ev.stopPropagation();
              updateActivateSidebar((v) => !v);
            }}
          >
            <IconSidebar />
            {intl.formatMessage({ id: 'layout.sidebar.btn' })}
          </button>
        </div>
      )}
      <main>
        {showSidebar && <Sidebar />}
        <Content>
          <div className='markdown' style={{ marginBottom: '18px'}}>
            <center>
              <a href="https://cloud.tencent.com/act/cps/redirect?redirect=1040&cps_key=ea8068199c73a836ffe37e4ea4c2ddee&from=console" nofollow alt="腾讯云新客专属福利" target="_blank">腾讯云 - 新客专属福利</a> | <a href="https://www.cnouyi.careers/join/54171828" nofollow alt="欧易 - 注册开盲盒赢 BTC、ETH、DOGE" target="_blank">欧易 - 注册开盲盒赢 BTC、ETH、DOGE</a> | <a href="https://sockboom.shop/auth/register?affid=552052" nofollow alt="SockBoom - 科学上网 VPN 梯子" target="_blank">SockBoom - 稳定的科学上网梯子</a>
            </center>
          </div>
          {outlet}
          {pathname === '/' &&
            <Adsense
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-7029815294762181"
              data-ad-slot="2148104191"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          }
          {pathname !== '/' &&
            <Adsense
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-format="autorelaxed"
              data-ad-client="ca-pub-7029815294762181"
              data-ad-slot="4521975302"
            />
          }
          <Footer />
        </Content>
        {fm.toc === 'content' && (
          <div className="dumi-default-doc-layout-toc-wrapper">
            <h4>TABLE OF CONTENTS</h4>
            <Toc />
          </div>
        )}
      </main>
    </div>
  );
};

export default DocLayout;
