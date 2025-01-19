// import React from 'react';
// import { useAccount, useConnect, useDisconnect } from 'wagmi';
// import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
// import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
// import { Wallet, LogOut } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// const WalletConnect = () => {
//   const { address, isConnected } = useAccount();
//   const { connect } = useConnect({
//     connector: new MetaMaskConnector(),
//   });
//   const { disconnect } = useDisconnect();

//   const connectWalletConnect = useConnect({
//     connector: new WalletConnectConnector({
//       options: {
//         projectId: '612505aa4c4b5494c81fcf295bc5b512', // Replace with your WalletConnect project ID
//       },
//     }),
//   });

//   const connectCoinbase = useConnect({
//     connector: new CoinbaseWalletConnector({
//       options: {
//         appName: 'AsterPay',
//       },
//     }),
//   });

//   if (isConnected) {
//     return (
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Wallet className="h-5 w-5" />
//             Connected Wallet
//           </CardTitle>
//           <CardDescription>
//             {address?.slice(0, 6)}...{address?.slice(-4)}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Button 
//             variant="destructive"
//             className="w-full"
//             onClick={() => disconnect()}
//           >
//             <LogOut className="mr-2 h-4 w-4" />
//             Disconnect
//           </Button>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card className="w-full max-w-md">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Wallet className="h-5 w-5" />
//           Connect Wallet
//         </CardTitle>
//         <CardDescription>
//           Choose your preferred wallet to connect
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="flex flex-col gap-2">
//         <Button 
//           className="w-full"
//           onClick={() => connect()}
//         >
//           MetaMask
//         </Button>
//         <Button 
//           className="w-full"
//           onClick={() => connectWalletConnect.connect()}
//         >
//           WalletConnect
//         </Button>
//         <Button 
//           className="w-full"
//           onClick={() => connectCoinbase.connect()}
//         >
//           Coinbase Wallet
//         </Button>
//       </CardContent>
//     </Card>
//   );
// };
// // import { mainnet, sepolia } from '@reown/appkit/networks'
// export default WalletConnect;