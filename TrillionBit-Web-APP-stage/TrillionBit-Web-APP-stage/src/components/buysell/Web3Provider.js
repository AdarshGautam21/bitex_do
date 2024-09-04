import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [sepolia],
    transports: {
      // RPC URL for each chain
      // [mainnet.id]: http(
      //   `https://eth-mainnet.g.alchemy.com/v2/m8nzzEyF6kRjrcWL7Ul3_dNc2yWRKoI2`
      // ),
      [sepolia.id]: http(
        `https://eth-sepolia.g.alchemy.com/v2/m8nzzEyF6kRjrcWL7Ul3_dNc2yWRKoI2`
      ),
    },
    // Required API Keys
    walletConnectProjectId: "e4013966eb3f5fe3b33c542ef8893e15",
    // Required App Info
    appName: "Trillion Bit",
    // Optional App Info
    appDescription: "Buy | Sell | Swap",
    appUrl: "https://trillionbit.com/", // your app's url
    appIcon: "https://trillionbit.com/static/media/white-logo.136afb58.webp", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
