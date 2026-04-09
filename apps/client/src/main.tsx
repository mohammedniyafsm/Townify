import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from "@/components/ui/sonner"
import { Provider } from 'react-redux'
import store from './Redux/stroe.ts'

import { LiveKitProvider } from './contexts/LiveKitContext.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <LiveKitProvider>
      <Toaster />
      <App />
    </LiveKitProvider>
  </Provider>
)

