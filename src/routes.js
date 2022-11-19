import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import Partners from './pages/Partners';
import IPAddress from './pages/IPAddress';
import CODExpress from './pages/CODExpress';
import CutAround from './pages/CutAround';
// NOT SHOW IN MENU -------------------------------
import PartnersStatistics from './pages/Partners/Statistics';
import CutAroundStatistics from './pages/CutAround/Statistics';
import Admins from './pages/Admins';

// Branch Dev
import PartnersDev from './pages/BranchDev/Partners';
import IPAddressDev from './pages/BranchDev/IPAddress';

import PartnersStatisticsDev from './pages/BranchDev/Partners/Statistics';
// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'partners', element: <Partners /> },
        { path: 'ip-address', element: <IPAddress /> },
        { path: 'cod-express', element: <CODExpress /> },
        { path: 'cut-around', element: <CutAround /> },
        { path: 'admins', element: <Admins /> },
        // NOT SHOW IN MENU -------------------------------
        { path: 'partners/statistics', element: <PartnersStatistics /> },
        { path: 'cut-around/statistics', element: <CutAroundStatistics /> },
        // Branch Dev
        { path: 'dev/partners', element: <PartnersDev /> },
        { path: 'dev/ip-address', element: <IPAddressDev /> },
        { path: 'dev/partners/statistics', element: <PartnersStatisticsDev /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
