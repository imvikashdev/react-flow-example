import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from './pages/ErrorPage.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ErrorBoundary
      FallbackComponent={ErrorPage}
      onReset={() => {
        // reset the state of your app here
      }}
    >
      <App />
    </ErrorBoundary>
  </Provider>,
);
