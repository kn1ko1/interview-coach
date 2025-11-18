import React from 'react';
import '../styles/SidebarNav.css';

interface SidebarNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

interface SidebarNavProps {
  items: SidebarNavItem[];
  title?: string;
  logo?: React.ReactNode;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ items, title, logo }) => {
  return (
    <nav className="sidebar-nav">
      {logo && <div className="sidebar-logo">{logo}</div>}
      {title && <h2 className="sidebar-title">{title}</h2>}
      <ul className="sidebar-items">
        {items.map((item) => (
          <li key={item.id}>
            <button
              className={`sidebar-item ${item.active ? 'active' : ''}`}
              onClick={item.onClick}
              title={item.label}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNav;
