import React from "react";
import mainimg from "../app/assets/Degen Casino.gif";
import SlotMachine from "../components/SlotMachine";
import Image from "next/image"; // Import Next.js Image
import { useEffect, useCallback, useState, useMemo } from "react";
import { Input } from "../components/ui/input";
import { signIn, signOut, getCsrfToken } from "next-auth/react";
import sdk, {
  AddFrame,
  FrameNotificationDetails,
  SignIn as SignInCore,
  type Context,
} from "@farcaster/frame-sdk";

import { config } from "~/components/providers/WagmiProvider";
import { Button } from "~/components/ui/Button";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, optimism } from "wagmi/chains";
import { BaseError, UserRejectedRequestError } from "viem";
import { useSession } from "next-auth/react";
import { createStore } from "mipd";
import { Label } from "~/components/ui/label";

const Main: React.FC = () => {
  const { status: farcasterStatus, data: session } = useSession();

  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const [added, setAdded] = useState(false);
  const [notificationDetails, setNotificationDetails] =
    useState<FrameNotificationDetails | null>(null);

  const [lastEvent, setLastEvent] = useState("");

  const [addFrameResult, setAddFrameResult] = useState("");
  const [sendNotificationResult, setSendNotificationResult] = useState("");

  useEffect(() => {
    setNotificationDetails(context?.client.notificationDetails ?? null);
  }, [context]);

  //   switchChain({ chainId: chainId === base.id ? optimism.id : base.id });
  // }, [switchChain, chainId]);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);
      setAdded(context.client.added);

      sdk.on("frameAdded", ({ notificationDetails }) => {
        setLastEvent(
          `frameAdded${!!notificationDetails ? ", notifications enabled" : ""}`
        );

        setAdded(true);
        if (notificationDetails) {
          setNotificationDetails(notificationDetails);
        }
      });

      sdk.on("frameAddRejected", ({ reason }) => {
        setLastEvent(`frameAddRejected, reason ${reason}`);
      });

      sdk.on("frameRemoved", () => {
        setLastEvent("frameRemoved");
        setAdded(false);
        setNotificationDetails(null);
      });

      sdk.on("notificationsEnabled", ({ notificationDetails }) => {
        setLastEvent("notificationsEnabled");
        setNotificationDetails(notificationDetails);
      });
      sdk.on("notificationsDisabled", () => {
        setLastEvent("notificationsDisabled");
        setNotificationDetails(null);
      });

      sdk.on("primaryButtonClicked", () => {
        console.log("primaryButtonClicked");
      });

      console.log("Calling ready");
      sdk.actions.ready({});

      // Set up a MIPD Store, and request Providers.
      const store = createStore();

      // Subscribe to the MIPD Store.
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
        // => [EIP6963ProviderDetail, EIP6963ProviderDetail, ...]
      });
    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);

  const openUrl = useCallback(() => {
    sdk.actions.openUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  }, []);

  const openWarpcastUrl = useCallback(() => {
    sdk.actions.openUrl("https://warpcast.com/~/compose");
  }, []);

  const close = useCallback(() => {
    sdk.actions.close();
  }, []);

  const addFrame = useCallback(async () => {
    try {
      setNotificationDetails(null);

      const result = await sdk.actions.addFrame();

      if (result.notificationDetails) {
        setNotificationDetails(result.notificationDetails);
      }
      setAddFrameResult(
        result.notificationDetails
          ? `Added, got notificaton token ${result.notificationDetails.token} and url ${result.notificationDetails.url}`
          : "Added, got no notification details"
      );
    } catch (error) {
      if (error instanceof AddFrame.RejectedByUser) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      if (error instanceof AddFrame.InvalidDomainManifest) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      setAddFrameResult(`Error: ${error}`);
    }
  }, []);

  const renderUserInfo = () => {
    return (
      <div className="mb-4 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-xl font-bold mb-2">User Info</h3>
        <div className="space-y-2">
          {/* <p>Wallet Status: {isConnected ? "Connected" : "Not Connected"}</p>
          <p>Wallet Address: {address || "Not Connected"}</p> */}
          <p>Farcaster Status: {farcasterStatus}</p>
          {session?.user && (
            <div>
              <p>FID: {session.user.fid}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const toggleContext = useCallback(() => {
    setIsContextOpen((prev) => !prev);
  }, []);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <div className=" min-h-screen flex items-center justify-center  text-white bg-[#2C0653] bg-[url(/DegenCasinoBg.gif)] bg-cover bg-no-repeat bg-center">
      <div className="container flex flex-col">
        {renderUserInfo()}

        {/* Uncomment the below code if ConnectButton is needed */}
        {/*
      <div className="container flex justify-end mt-4 z-10">
        <ConnectButton />
      </div>
      */}
        <div
          style={{
            paddingTop: context?.client.safeAreaInsets?.top ?? 0,
            paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
            paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
            paddingRight: context?.client.safeAreaInsets?.right ?? 0,
          }}
        >
          <div className="w-[300px] mx-auto py-2 px-2">
            <div>
              {/* <h2 className="font-2xl font-bold">Actions</h2> */}

              <div className="p-4 mt-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
                  {/* {JSON.stringify(context, null, 2)} */}
                  {context?.user?.fid}
                </pre>
              </div>

              <div className="mb-4">
                {/* <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
                  <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
                    sdk.actions.signIn
                  </pre>
                </div> */}
                <SignIn />
              </div>
            </div>
            <div className="mb-20"></div>
          </div>
        </div>
        <div className="container flex flex-col gap-y-12 items-center -mt-16">
          <div className="h-1/4">
            <Image
              src={mainimg}
              alt="mainimg"
              className="w-[20rem] h-full object-cover"
            />
          </div>
          <div className="container h-3/4">
            <SlotMachine />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;

function SignIn() {
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
    </>
  );
}
const renderError = (error: Error | null) => {
  if (!error) return null;
  if (error instanceof BaseError) {
    const isUserRejection = error.walk(
      (e) => e instanceof UserRejectedRequestError
    );

    if (isUserRejection) {
      return <div className="text-red-500 text-xs mt-1">Rejected by user.</div>;
    }
  }

  return <div className="text-red-500 text-xs mt-1">{error.message}</div>;
};
