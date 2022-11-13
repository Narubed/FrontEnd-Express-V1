import 'primereact/resources/themes/bootstrap4-light-purple/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
// routes
import useCurrentUser from './hooks/useCurrentUser';

import Router from './routes';
import RouterNoToken from './routes.notoken';
// theme

import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';

// ----------------------------------------------------------------------

export default function App() {
  const { currentUser } = useCurrentUser();
  console.log(currentUser);
  if (!currentUser) {
    return (
      <ThemeProvider>
        <ScrollToTop />
        <StyledChart />
        <RouterNoToken />
      </ThemeProvider>
    );
  }
  return (
    <ThemeProvider>
      <ScrollToTop />
      <StyledChart />
      <Router />
    </ThemeProvider>
  );
}
