import { WorkspaceSwitcher } from "./workspace-switcher";
import { NavMain } from "./nav-main";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useTranslation } from "react-i18next";

const Asidebar = () => {
  const workspaceId = useWorkspaceId();
  const { t } = useTranslation();

  return (
    <nav className="sidebar sidebar-offcanvas bg-sidebar" id="sidebar">
      <div className="sidebar-brand-wrapper bg-sidebar d-none d-lg-flex align-items-center justify-content-center fixed-top">
        <a className="brand-logo" href={`/workspace/${workspaceId}`}>
          <img src="/images/taskmaster_logo2.png" alt="logo" className="img-fluid" />
        </a>
        <a className="sidebar-brand brand-logo-mini" href={`/workspace/${workspaceId}`}><img src="/taskmaster.png" alt="logo" /></a>
      </div>
      <div className="nav">
        <WorkspaceSwitcher />
        <li className="nav-item nav-category">
          <span className="nav-link">{t("nav-title")}</span>
        </li>
        <NavMain />
      </div>
    </nav>
  );
};

export default Asidebar;
