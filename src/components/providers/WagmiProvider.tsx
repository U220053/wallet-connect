import { createConfig, http, WagmiProvider } from "wagmi";
import { base, optimism } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";

const degen = {
  id: 666666666,
  name: "Degen L3",
  network: "DEGEN",
  iconUrl: "../img/degen01.svg",
  //iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: "degen",
    symbol: "DEGEN",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.degen.tips"],
    },
    public: {
      http: ["https://rpc.degen.tips"],
    },
  },
  blockExplorers: {
    default: { name: "SnowTrace", url: "https://explorer.degen.tips/" },
  },
};
export const config = createConfig({
  chains: [degen],
  transports: {
    [degen.id]: http(),
    // [optimism.id]: http(),
  },
  connectors: [farcasterFrame()],
});

const queryClient = new QueryClient();

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
