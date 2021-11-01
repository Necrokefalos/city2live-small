import { QueryClient, QueryClientProvider } from 'react-query';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';

// ----------------------------------------------------------------------

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeConfig>
        <ScrollToTop />
        <GlobalStyles />
        <BaseOptionChartStyle />
        <Router />
      </ThemeConfig>
    </QueryClientProvider>
  );
}
