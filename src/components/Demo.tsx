// import React from "react";
// import mainimg from "../app/assets/Degen Casino.gif";
// import SlotMachine from "../components/SlotMachine";
// import Image from "next/image"; // Import Next.js Image
// import { useEffect, useCallback, useState, useMemo } from "react";
// import { Input } from "../components/ui/input";
// import { signIn, signOut, getCsrfToken } from "next-auth/react";
// import sdk, {
//   AddFrame,
//   FrameNotificationDetails,
//   SignIn as SignInCore,
//   type Context,
// } from "@farcaster/frame-sdk";
// import {
//   useAccount,
//   useSendTransaction,
//   useSignMessage,
//   useSignTypedData,
//   useWaitForTransactionReceipt,
//   useDisconnect,
//   useConnect,
//   useSwitchChain,
//   useChainId,
// } from "wagmi";

// import { config } from "~/components/providers/WagmiProvider";
// import { Button } from "~/components/ui/Button";
// import { truncateAddress } from "~/lib/truncateAddress";
// import { base, optimism } from "wagmi/chains";
// import { BaseError, UserRejectedRequestError } from "viem";
// import { useSession } from "next-auth/react";
// import { createStore } from "mipd";
// import { Label } from "~/components/ui/label";

// const Main: React.FC = () => {
//   const [isSDKLoaded, setIsSDKLoaded] = useState(false);
//   const [context, setContext] = useState<Context.FrameContext>();
//   const [isContextOpen, setIsContextOpen] = useState(false);
//   const [txHash, setTxHash] = useState<string | null>(null);

//   const [added, setAdded] = useState(false);
//   const [notificationDetails, setNotificationDetails] =
//     useState<FrameNotificationDetails | null>(null);

//   const [lastEvent, setLastEvent] = useState("");

//   const [addFrameResult, setAddFrameResult] = useState("");
//   const [sendNotificationResult, setSendNotificationResult] = useState("");

//   useEffect(() => {
//     setNotificationDetails(context?.client.notificationDetails ?? null);
//   }, [context]);

//   const { address, isConnected } = useAccount();
//   const chainId = useChainId();

//   const {
//     sendTransaction,
//     error: sendTxError,
//     isError: isSendTxError,
//     isPending: isSendTxPending,
//   } = useSendTransaction();

//   const { isLoading: isConfirming, isSuccess: isConfirmed } =
//     useWaitForTransactionReceipt({
//       hash: txHash as `0x${string}`,
//     });

//   const {
//     signTypedData,
//     error: signTypedError,
//     isError: isSignTypedError,
//     isPending: isSignTypedPending,
//   } = useSignTypedData();

//   const { disconnect } = useDisconnect();
//   const { connect } = useConnect();

//   const {
//     switchChain,
//     error: switchChainError,
//     isError: isSwitchChainError,
//     isPending: isSwitchChainPending,
//   } = useSwitchChain();

//   const handleSwitchChain = useCallback(() => {
//     switchChain({ chainId: chainId === base.id ? optimism.id : base.id });
//   }, [switchChain, chainId]);

//   useEffect(() => {
//     const load = async () => {
//       const context = await sdk.context;
//       setContext(context);
//       setAdded(context.client.added);

//       sdk.on("frameAdded", ({ notificationDetails }) => {
//         setLastEvent(
//           `frameAdded${!!notificationDetails ? ", notifications enabled" : ""}`
//         );

//         setAdded(true);
//         if (notificationDetails) {
//           setNotificationDetails(notificationDetails);
//         }
//       });

//       sdk.on("frameAddRejected", ({ reason }) => {
//         setLastEvent(`frameAddRejected, reason ${reason}`);
//       });

//       sdk.on("frameRemoved", () => {
//         setLastEvent("frameRemoved");
//         setAdded(false);
//         setNotificationDetails(null);
//       });

//       sdk.on("notificationsEnabled", ({ notificationDetails }) => {
//         setLastEvent("notificationsEnabled");
//         setNotificationDetails(notificationDetails);
//       });
//       sdk.on("notificationsDisabled", () => {
//         setLastEvent("notificationsDisabled");
//         setNotificationDetails(null);
//       });

//       sdk.on("primaryButtonClicked", () => {
//         console.log("primaryButtonClicked");
//       });

//       console.log("Calling ready");
//       sdk.actions.ready({});

//       // Set up a MIPD Store, and request Providers.
//       const store = createStore();

//       // Subscribe to the MIPD Store.
//       store.subscribe((providerDetails) => {
//         console.log("PROVIDER DETAILS", providerDetails);
//         // => [EIP6963ProviderDetail, EIP6963ProviderDetail, ...]
//       });
//     };
//     if (sdk && !isSDKLoaded) {
//       console.log("Calling load");
//       setIsSDKLoaded(true);
//       load();
//       return () => {
//         sdk.removeAllListeners();
//       };
//     }
//   }, [isSDKLoaded]);

//   const openUrl = useCallback(() => {
//     sdk.actions.openUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
//   }, []);

//   const openWarpcastUrl = useCallback(() => {
//     sdk.actions.openUrl("https://warpcast.com/~/compose");
//   }, []);

//   const close = useCallback(() => {
//     sdk.actions.close();
//   }, []);

//   const addFrame = useCallback(async () => {
//     try {
//       setNotificationDetails(null);

//       const result = await sdk.actions.addFrame();

//       if (result.notificationDetails) {
//         setNotificationDetails(result.notificationDetails);
//       }
//       setAddFrameResult(
//         result.notificationDetails
//           ? `Added, got notificaton token ${result.notificationDetails.token} and url ${result.notificationDetails.url}`
//           : "Added, got no notification details"
//       );
//     } catch (error) {
//       if (error instanceof AddFrame.RejectedByUser) {
//         setAddFrameResult(`Not added: ${error.message}`);
//       }

//       if (error instanceof AddFrame.InvalidDomainManifest) {
//         setAddFrameResult(`Not added: ${error.message}`);
//       }

//       setAddFrameResult(`Error: ${error}`);
//     }
//   }, []);

//   const sendNotification = useCallback(async () => {
//     setSendNotificationResult("");
//     if (!notificationDetails || !context) {
//       return;
//     }

//     try {
//       const response = await fetch("/api/send-notification", {
//         method: "POST",
//         mode: "same-origin",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           fid: context.user.fid,
//           notificationDetails,
//         }),
//       });

//       if (response.status === 200) {
//         setSendNotificationResult("Success");
//         return;
//       } else if (response.status === 429) {
//         setSendNotificationResult("Rate limited");
//         return;
//       }

//       const data = await response.text();
//       setSendNotificationResult(`Error: ${data}`);
//     } catch (error) {
//       setSendNotificationResult(`Error: ${error}`);
//     }
//   }, [context, notificationDetails]);

//   const sendTx = useCallback(() => {
//     sendTransaction(
//       {
//         // call yoink() on Yoink contract
//         to: "0x4bBFD120d9f352A0BEd7a014bd67913a2007a878",
//         data: "0x9846cd9efc000023c0",
//       },
//       {
//         onSuccess: (hash) => {
//           setTxHash(hash);
//         },
//       }
//     );
//   }, [sendTransaction]);

//   const signTyped = useCallback(() => {
//     signTypedData({
//       domain: {
//         name: "Frames v2 Demo",
//         version: "1",
//         chainId,
//       },
//       types: {
//         Message: [{ name: "content", type: "string" }],
//       },
//       message: {
//         content: "Hello from Frames v2!",
//       },
//       primaryType: "Message",
//     });
//   }, [chainId, signTypedData]);

//   const toggleContext = useCallback(() => {
//     setIsContextOpen((prev) => !prev);
//   }, []);

//   if (!isSDKLoaded) {
//     return <div>Loading...</div>;
//   }
//   return (
//     <div className="container flex flex-col">
//       {/* Uncomment the below code if ConnectButton is needed */}
//       {/*
//       <div className="container flex justify-end mt-4 z-10">
//         <ConnectButton />
//       </div>
//       */}
//       <div
//         style={{
//           paddingTop: context?.client.safeAreaInsets?.top ?? 0,
//           paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
//           paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
//           paddingRight: context?.client.safeAreaInsets?.right ?? 0,
//         }}
//       >
//         <div className="w-[300px] mx-auto py-2 px-2">
//           <div>
//             <h2 className="font-2xl font-bold">Actions</h2>

//             <div className="mb-4">
//               <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
//                 <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
//                   sdk.actions.signIn
//                 </pre>
//               </div>
//               <SignIn />
//             </div>
//           </div>
//           <div className="mb-20"></div>
//           {/* <div>
//             <h2 className="font-2xl font-bold">Wallet</h2>

//             {address && (
//               <div className="my-2 text-xs">
//                 Address:{" "}
//                 <pre className="inline">{truncateAddress(address)}</pre>
//               </div>
//             )}

//             {chainId && (
//               <div className="my-2 text-xs">
//                 Chain ID: <pre className="inline">{chainId}</pre>
//               </div>
//             )}

//             <div className="mb-4">
//               <Button
//                 onClick={() =>
//                   isConnected
//                     ? disconnect()
//                     : connect({ connector: config.connectors[0] })
//                 }
//               >
//                 {isConnected ? "Disconnect" : "Connect"}
//               </Button>
//             </div>

//             <div className="mb-4">
//               <SignMessage />
//             </div>
//           </div> */}
//         </div>
//       </div>
//       <div className="container flex flex-col gap-y-20 items-center -mt-16">
//         <div className="h-1/4">
//           {/* <img
//             src={mainimg}
//             alt="mainimg"
//             className="w-[25rem] h-full object-cover"
//           /> */}
//           <Image
//             src={mainimg}
//             alt="mainimg"
//             className="w-[25rem] h-full object-cover"
//           />
//         </div>
//         <div className="container h-3/4">
//           <SlotMachine />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Main;

// function SignMessage() {
//   const { isConnected } = useAccount();
//   const { connectAsync } = useConnect();
//   const {
//     signMessage,
//     data: signature,
//     error: signError,
//     isError: isSignError,
//     isPending: isSignPending,
//   } = useSignMessage();

//   const handleSignMessage = useCallback(async () => {
//     if (!isConnected) {
//       await connectAsync({
//         chainId: base.id,
//         connector: config.connectors[0],
//       });
//     }

//     signMessage({ message: "Hello from Frames v2!" });
//   }, [connectAsync, isConnected, signMessage]);

//   return (
//     <>
//       <Button
//         onClick={handleSignMessage}
//         disabled={isSignPending}
//         isLoading={isSignPending}
//       >
//         Sign Message
//       </Button>
//       {isSignError && renderError(signError)}
//       {signature && (
//         <div className="mt-2 text-xs">
//           <div>Signature: {signature}</div>
//         </div>
//       )}
//     </>
//   );
// }

// function SignIn() {
//   const [signingIn, setSigningIn] = useState(false);
//   const [signingOut, setSigningOut] = useState(false);
//   const [signInResult, setSignInResult] = useState<SignInCore.SignInResult>();
//   const [signInFailure, setSignInFailure] = useState<string>();
//   const { data: session, status } = useSession();

//   const getNonce = useCallback(async () => {
//     const nonce = await getCsrfToken();
//     if (!nonce) throw new Error("Unable to generate nonce");
//     return nonce;
//   }, []);

//   const handleSignIn = useCallback(async () => {
//     try {
//       setSigningIn(true);
//       setSignInFailure(undefined);
//       const nonce = await getNonce();
//       const result = await sdk.actions.signIn({ nonce });
//       setSignInResult(result);

//       await signIn("credentials", {
//         message: result.message,
//         signature: result.signature,
//         redirect: false,
//       });
//     } catch (e) {
//       if (e instanceof SignInCore.RejectedByUser) {
//         setSignInFailure("Rejected by user");
//         return;
//       }

//       setSignInFailure("Unknown error");
//     } finally {
//       setSigningIn(false);
//     }
//   }, [getNonce]);

//   const handleSignOut = useCallback(async () => {
//     try {
//       setSigningOut(true);
//       await signOut({ redirect: false });
//       setSignInResult(undefined);
//     } finally {
//       setSigningOut(false);
//     }
//   }, []);

//   return (
//     <>
//       {status !== "authenticated" && (
//         <Button onClick={handleSignIn} disabled={signingIn}>
//           Sign In with Farcaster
//         </Button>
//       )}
//       {status === "authenticated" && (
//         <Button onClick={handleSignOut} disabled={signingOut}>
//           Sign out
//         </Button>
//       )}
//       {session && (
//         <div className="my-2 p-2 text-xs overflow-x-scroll bg-gray-100 rounded-lg font-mono">
//           <div className="font-semibold text-gray-500 mb-1">Session</div>
//           <div className="whitespace-pre">
//             {JSON.stringify(session, null, 2)}
//           </div>
//         </div>
//       )}
//       {signInFailure && !signingIn && (
//         <div className="my-2 p-2 text-xs overflow-x-scroll bg-gray-100 rounded-lg font-mono">
//           <div className="font-semibold text-gray-500 mb-1">SIWF Result</div>
//           <div className="whitespace-pre">{signInFailure}</div>
//         </div>
//       )}
//       {signInResult && !signingIn && (
//         <div className="my-2 p-2 text-xs overflow-x-scroll bg-gray-100 rounded-lg font-mono">
//           <div className="font-semibold text-gray-500 mb-1">SIWF Result</div>
//           <div className="whitespace-pre">
//             {JSON.stringify(signInResult, null, 2)}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
// const renderError = (error: Error | null) => {
//   if (!error) return null;
//   if (error instanceof BaseError) {
//     const isUserRejection = error.walk(
//       (e) => e instanceof UserRejectedRequestError
//     );

//     if (isUserRejection) {
//       return <div className="text-red-500 text-xs mt-1">Rejected by user.</div>;
//     }
//   }

//   return <div className="text-red-500 text-xs mt-1">{error.message}</div>;
// };
import React, { useState, useCallback } from "react";
import { Button } from "~/components/ui/Button";
import { signIn, signOut, useSession, getCsrfToken } from "next-auth/react";
import sdk, { SignIn as SignInCore } from "@farcaster/frame-sdk";
import SlotMachine from "../components/SlotMachine";

export default function SignIn() {
  const [signingIn, setSigningIn] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signInResult, setSignInResult] = useState<SignInCore.SignInResult>();
  const [signInFailure, setSignInFailure] = useState<string>();
  const { data: session, status } = useSession();

  const getNonce = useCallback(async () => {
    const nonce = await getCsrfToken();
    if (!nonce) throw new Error("Unable to generate nonce");
    return nonce;
  }, []);

  const handleSignIn = useCallback(async () => {
    try {
      setSigningIn(true);
      setSignInFailure(undefined);
      const nonce = await getNonce();
      const result = await sdk.actions.signIn({ nonce });
      setSignInResult(result);

      await signIn("credentials", {
        message: result.message,
        signature: result.signature,
        redirect: false,
      });
    } catch (e) {
      if (e instanceof SignInCore.RejectedByUser) {
        setSignInFailure("Rejected by user");
        return;
      }

      setSignInFailure("Unknown error");
    } finally {
      setSigningIn(false);
    }
  }, [getNonce]);

  const handleSignOut = useCallback(async () => {
    try {
      setSigningOut(true);
      await signOut({ redirect: false });
      setSignInResult(undefined);
    } finally {
      setSigningOut(false);
    }
  }, []);

  return (
    <>
      {status !== "authenticated" && (
        <Button onClick={handleSignIn} disabled={signingIn}>
          Sign In with Farcaster
        </Button>
      )}
      {status === "authenticated" && (
        <Button onClick={handleSignOut} disabled={signingOut}>
          Sign out
        </Button>
      )}
      {session && (
        <div className="my-2 p-2 text-xs overflow-x-scroll bg-gray-100 rounded-lg font-mono">
          <div className="font-semibold text-gray-500 mb-1">Session</div>
          <div className="whitespace-pre">
            {JSON.stringify(session, null, 2)}
          </div>
        </div>
      )}
      {signInFailure && !signingIn && (
        <div className="my-2 p-2 text-xs overflow-x-scroll bg-gray-100 rounded-lg font-mono">
          <div className="font-semibold text-gray-500 mb-1">SIWF Result</div>
          <div className="whitespace-pre">{signInFailure}</div>
        </div>
      )}
      {signInResult && !signingIn && (
        <div className="my-2 p-2 text-xs overflow-x-scroll bg-gray-100 rounded-lg font-mono">
          <div className="font-semibold text-gray-500 mb-1">SIWF Result</div>
          <div className="whitespace-pre">
            {JSON.stringify(signInResult, null, 2)}
          </div>
        </div>
      )}
      <div className="container h-3/4">
        <SlotMachine />
      </div>
    </>
  );
}
