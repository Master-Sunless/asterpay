// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { createAppKit } from '@reown/appkit/react'
// import { WagmiProvider } from 'wagmi'
// import { mainnet, sepolia } from '@reown/appkit/networks'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// import Index from "./pages/Index";
// import Subscriptions from "./pages/Subscriptions";
// import Settings from "./pages/Settings";
// import NewSubscription from "./pages/NewSubscription";
// import UpgradeSubscription from "./pages/UpgradeSubscription";

// // / 0. Setup queryClient
// const queryClient = new QueryClient()

// // 1. Get projectId from https://cloud.reown.com
// const projectId = '612505aa4c4b5494c81fcf295bc5b512'

// // 2. Create a metadata object - optional
// const metadata = {
//   name: 'AsterPay',
//   description: 'AppKit Example',
//   url: 'localhost:8080', // origin must match your domain & subdomain
//   icons: ['https://assets.reown.com/reown-profile-pic.png']
// }

// // 3. Set the networks
// const networks = [mainnet, sepolia]


// // 4. Create Wagmi Adapter
// const wagmiAdapter = new WagmiAdapter({
//   networks,
//   projectId,
//   ssr: true
// });

// // 5. Create modal
// createAppKit({
//   adapters: [wagmiAdapter],
//   networks,
//   projectId,
//   metadata,
//   features: {
//     analytics: true // Optional - defaults to your Cloud configuration
//   }
// })

// function App() {
//   return (
//     <WagmiProvider config={wagmiAdapter.wagmiConfig}>
//       <Router>
//         <Routes>
//           <Route path="/" element={<Index />} />
//           <Route path="/subscriptions" element={<Subscriptions />} />
//           <Route path="/subscriptions/:id/upgrade" element={<UpgradeSubscription />} />
//           <Route path="/settings" element={<Settings />} />
//           <Route path="/new-subscription" element={<NewSubscription />} />
//         </Routes>
//       </Router>
//     </WagmiProvider>
//   );
// }

// export default App;import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mainnet, sepolia } from 'viem/chains';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { createAppKit } from '@reown/appkit/react';
import { type AppKitNetwork } from '@reown/appkit/networks';

import Index from "./pages/Index";
import Subscriptions from "./pages/Subscriptions";
import Settings from "./pages/Settings";
import NewSubscription from "./pages/NewSubscription";
import UpgradeSubscription from "./pages/UpgradeSubscription";

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId from https://cloud.reown.com
const projectId = 'YOUR_PROJECT_ID';

// 2. Create a metadata object
const metadata = {
  name: 'AsterPay',
  description: 'AppKit Example',
  url: 'localhost:8080',
  icons: ['https://assets.reown.com/reown-profile-pic.png']
};

// 3. Set up networks with proper typing
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
  {
    ...mainnet,
    name: 'Ethereum',
    network: 'mainnet',
  } as AppKitNetwork,
  {
    ...sepolia,
    name: 'Sepolia',
    network: 'sepolia',
  } as AppKitNetwork,
];

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
});

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/subscriptions/:id/upgrade" element={<UpgradeSubscription />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/new-subscription" element={<NewSubscription />} />
          </Routes>
        </Router>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

export default App;