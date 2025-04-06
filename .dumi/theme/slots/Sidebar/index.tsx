import { NavLink, useLocation, useRouteMeta, useSidebarData } from 'dumi';
import Toc from 'dumi/theme-default/slots/Toc';
import React, { type FC } from 'react';
import './index.less';

const Sidebar: FC = () => {
  const { pathname } = useLocation();
  const meta = useRouteMeta();
  const sidebar = useSidebarData();

  if (!sidebar) return null;

  return (
    <div className="dumi-default-sidebar">
      <div className="zanzhushang">
        <a href="https://immersivetranslate.com/?via=zisheng" target='_blank' rel="noopener noreferrer">
          <img src="/images/immersivetranslate.png" width={"100%"} alt="赞助商"></img>
        </a>
      </div>
      {sidebar.map((item, i) => (
        <dl className="dumi-default-sidebar-group" key={String(i)}>
          {item.title && <dt>{item.title}</dt>}
          {item.children.map((child) => (
            <dd key={child.link}>
              <NavLink
                to={child.link}
                title={child.title}
                end
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = e.currentTarget.href;
                }}
              >
                {child.title}
              </NavLink>
              {child.link === pathname && meta.frontmatter.toc === 'menu' && (
                <Toc />
              )}
            </dd>
          ))}
        </dl>
      ))}
    </div>
  );
};

export default Sidebar;
