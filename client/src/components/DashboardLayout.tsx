import React, { ReactNode } from 'react';
import '../styles/DashboardLayout.css';

interface DashboardLayoutProps {
  sidebar: ReactNode;
  main: ReactNode;
  footer?: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  sidebar,
  main,
  footer,
}) => {
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        {sidebar}
      </aside>
      <main className="dashboard-main">
        {main}
        {footer && <footer className="dashboard-footer">{footer}</footer>}
      </main>
    </div>
  );
};

export default DashboardLayout;
