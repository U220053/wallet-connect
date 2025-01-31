import { useEffect, useState, useCallback } from "react";
import { Button } from "./ui/Button";
import degen from "../app/assets/image 9.svg";
import Image1 from "../../public/Group16.png";
import "./Slot.css";
import globe from "../app/assets/image 26.png";
import bomb from "../app/assets/image 27.png";
import book from "../app/assets/image 28.png";
import broom from "../app/assets/image 29.png";
import tonic from "../app/assets/image 30.png";
import gem from "../app/assets/image 31.png";
import key from "../app/assets/image 32.png";
import champion from "../app/assets/image 33.png";
import coin from "../app/assets/image 34.png";
import hat from "../app/assets/image 24.png";
import { Dialog } from "primereact/dialog";
import "./Modal.css";
import Image from "next/image";
import { Button2 } from "./ui/Button2";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

const CASINO_CONTRACT =
  "0x9e43FE516317FD888E863EEd0562D97f2901943c" as `0x${string}`;
const CASINO_ABI = [
  {
    type: "function",
    name: "buySpinsErc20",
    inputs: [{ name: "_SpinNums", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "buySpins",
    inputs: [
      { name: "_SpinNums", type: "uint256", internalType: "uint256" },
      { name: "_amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "users",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [
      { name: "isOpen", type: "bool", internalType: "bool" },
      { name: "spins", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
] as const;

interface SlotMachineProps {
  fid: number | undefined;
}

const SlotMachine: React.FC<SlotMachineProps> = ({ fid }) => {
  const { address, isConnected } = useAccount();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [spinCount, setSpinCount] = useState<number>(1);

  // Updated contract reads
  const { data: userData, refetch: refetchUserData } = useReadContract({
    address: CASINO_CONTRACT,
    abi: CASINO_ABI,
    functionName: "users",
    args: [address as `0x${string}`],
    // enabled: Boolean(address),
  });

  // Updated contract writes
  const { writeContract: buySpins, isPending: isBuyingSpins } =
    useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

  const handleBuySpins = async () => {
    try {
      const result = await buySpins({
        abi: CASINO_ABI,
        address: CASINO_CONTRACT,
        functionName: "buySpins",
        args: [BigInt(spinCount), BigInt(1e18)],
        value: BigInt(1e18),
      });
      console.log("result", result);
      if (result !== undefined) {
        setTxHash(result); // Set the transaction hash
        console.log("Transaction hash:", result);

        // Wait for transaction confirmation
        const receipt = await useWaitForTransactionReceipt(result);
        if (receipt.status === "success") {
          await refetchUserData(); // Refresh user data after confirmation
          console.log("Transaction confirmed, user data refreshed");
        }
      }
    } catch (error) {
      console.error("Error buying spins:", error);
    }
  };
  useEffect(() => {
    if (userData) {
      console.log("User data updated:", userData);
      // userData[1] contains the spins count
      const spinsCount = Number(userData[1]);
      console.log("Current spins count:", spinsCount);
    }
  }, [userData]);
  const symbolMapping = {
    globe: 0,
    bomb: 1,
    book: 2,
    broom: 3,
    tonic: 4,
    gem: 5,
    key: 6,
    champion: 7,
    coin: 8,
    hat: 9,
  };

  const winningCombinations = [
    { combination: [1, 8, 2], prize: 1000 }, // globe-champion-bomb
    { combination: [6, 6, 6], prize: 5000 }, // gem-gem-gem
    { combination: [9, 9, 9], prize: 10000 }, // coin-coin-coin
    { combination: [8, 8, 8], prize: 7500 }, // champion-champion-champion
    { combination: [1, 1, 1], prize: 2500 }, // globe-globe-globe
  ];

  // Modified items array to ensure each item has both element and value
  // const baseItems = [
  //   {
  //     element: (
  //       <Image
  //         src={globe}
  //         alt="globe"
  //         className="w-full h-8rem object-contain"
  //       />
  //     ),
  //     value: symbolMapping.globe,
  //   },
  //   {
  //     element: (
  //       <Image src={bomb} alt="bomb" className="w-full h-8rem object-contain" />
  //     ),
  //     value: symbolMapping.bomb,
  //   },
  //   {
  //     element: (
  //       <Image src={book} alt="book" className="w-full h-8rem object-contain" />
  //     ),
  //     value: symbolMapping.book,
  //   },
  //   {
  //     element: (
  //       <Image
  //         src={broom}
  //         alt="broom"
  //         className="w-full h-8rem object-contain"
  //       />
  //     ),
  //     value: symbolMapping.broom,
  //   },
  //   {
  //     element: (
  //       <Image
  //         src={tonic}
  //         alt="tonic"
  //         className="w-full h-8rem object-contain"
  //       />
  //     ),
  //     value: symbolMapping.tonic,
  //   },
  //   {
  //     element: (
  //       <Image src={gem} alt="gem" className="w-full h-8rem object-contain" />
  //     ),
  //     value: symbolMapping.gem,
  //   },
  //   {
  //     element: (
  //       <Image src={key} alt="key" className="w-full h-8rem object-contain" />
  //     ),
  //     value: symbolMapping.key,
  //   },
  //   {
  //     element: (
  //       <Image
  //         src={champion}
  //         alt="champion"
  //         className="w-full h-8rem object-contain"
  //       />
  //     ),
  //     value: symbolMapping.champion,
  //   },
  //   {
  //     element: (
  //       <Image src={coin} alt="coin" className="w-full h-8rem object-contain" />
  //     ),
  //     value: symbolMapping.coin,
  //   },
  //   {
  //     element: (
  //       <Image src={hat} alt="coin" className="w-full h-8rem object-contain" />
  //     ),
  //     value: symbolMapping.hat,
  //   },
  // ];
  const baseItems = [
    {
      element: (
        <div className="flex items-center justify-center w-full h-full p-2">
          <Image
            src={globe}
            alt="globe"
            width={60}
            height={60}
            className="object-contain max-w-full max-h-full"
          />
        </div>
      ),
      value: symbolMapping.globe,
    },
    {
      element: (
        <div className="flex items-center justify-center w-full h-full p-2">
          <Image
            src={bomb}
            alt="bomb"
            width={60}
            height={60}
            className="object-contain max-w-full max-h-full"
          />
        </div>
      ),
      value: symbolMapping.bomb,
    },
    {
      element: (
        <div className="flex items-center justify-center w-full h-full p-2">
          <Image
            src={book}
            alt="book"
            width={60}
            height={60}
            className="object-contain max-w-full max-h-full"
          />
        </div>
      ),
      value: symbolMapping.book,
    },
    {
      element: (
        <div className="flex items-center justify-center w-full h-full p-2">
          <Image
            src={broom}
            alt="broom"
            width={60}
            height={60}
            className="object-contain max-w-full max-h-full"
          />
        </div>
      ),
      value: symbolMapping.broom,
    },
    {
      element: (
        <div className="flex items-center justify-center w-full h-full p-2">
          <Image
            src={tonic}
            alt="tonic"
            width={60}
            height={60}
            className="object-contain max-w-full max-h-full"
          />
        </div>
      ),
      value: symbolMapping.tonic,
    },
    {
      element: (
        <div className="flex items-center justify-center w-full h-full p-2">
          <Image
            src={gem}
            alt="gem"
            width={60}
            height={60}
            className="object-contain max-w-full max-h-full"
          />
        </div>
      ),
      value: symbolMapping.gem,
    },
    {
      element: (
        <div className="flex items-center justify-center w-full h-full p-2">
          <Image
            src={key}
            alt="key"
            width={60}
            height={60}
            className="object-contain max-w-full max-h-full"
          />
        </div>
      ),
      value: symbolMapping.key,
    },
    {
      element: (
        <div className="flex items-center justify-center w-full h-full p-2">
          <Image
            src={champion}
            alt="champion"
            width={60}
            height={60}
            className="object-contain max-w-full max-h-full"
          />
        </div>
      ),
      value: symbolMapping.champion,
    },
    {
      element: (
        <div className="flex items-center justify-center w-full h-full p-2">
          <Image
            src={coin}
            alt="coin"
            width={60}
            height={60}
            className="object-contain max-w-full max-h-full"
          />
        </div>
      ),
      value: symbolMapping.coin,
    },
    {
      element: (
        <div className="flex items-center justify-center w-full h-full p-2">
          <Image
            src={hat}
            alt="hat"
            width={60}
            height={60}
            className="object-contain max-w-full max-h-full"
          />
        </div>
      ),
      value: symbolMapping.hat,
    },
  ];

  const SPIN_DURATION = 1;
  const STOP_DELAY = 150;
  const TRANSITION_DURATION = 250;
  const ITEMS_TO_SCROLL = 50;

  const [doors, setDoors] = useState([
    { currentIndex: 0, items: baseItems, spinning: false, stopped: false },
    { currentIndex: 0, items: baseItems, spinning: false, stopped: false },
    { currentIndex: 0, items: baseItems, spinning: false, stopped: false },
  ]);

  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(false);
  const [prizeAmount, setPrizeAmount] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [amount, setAmount] = useState<string>("");

  useEffect(() => {
    console.log("input", amount);
  }, [amount]);

  const checkWinningCombination = async (finalSymbols: any[]) => {
    const combination = finalSymbols.map((item) => item.value);
    console.log("Checking combination:", combination); // Debug log

    const winningCombo = winningCombinations.find(
      (combo) =>
        JSON.stringify(combo.combination) === JSON.stringify(combination)
    );

    if (winningCombo) {
      setWinner(true);
      setPrizeAmount(winningCombo.prize);

      try {
        await fetch("YOUR_API_ENDPOINT", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            combination: combination,
            prize: winningCombo.prize,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error("Failed to record prize:", error);
      }
    } else {
      setWinner(false);
      setPrizeAmount(0);
    }
  };

  // Update the spin function to correctly handle the outcome
  const spin = async () => {
    if (spinning) return;

    try {
      const response = await fetch("http://localhost:80/api/spin");
      const { outcome } = await response.json();
      console.log("Spin outcome:", outcome);

      // Convert outcome to 3-digit array
      const symbols = String(outcome).padStart(3, "0").split("").map(Number);

      console.log("Mapped symbols:", symbols);

      setSpinning(true);
      setWinner(false);
      setPrizeAmount(0);
      setTransitionEnabled(false);

      // Create deterministic animation pattern
      setDoors((prevDoors) =>
        prevDoors.map((door, index) => {
          const targetSymbol = symbols[index];
          const middleIndex = Math.floor(ITEMS_TO_SCROLL / 2);

          // Validate symbol index
          if (targetSymbol < 0 || targetSymbol >= baseItems.length) {
            console.error(`Invalid symbol index: ${targetSymbol}`);
            return door;
          }

          // Create smooth animation pattern
          const newItems = Array.from({ length: ITEMS_TO_SCROLL }, (_, i) => {
            // Target position
            if (i === middleIndex) return baseItems[targetSymbol];

            // Create cyclic pattern before and after target
            const cyclicIndex = (i + targetSymbol) % baseItems.length;
            return baseItems[cyclicIndex];
          });

          return {
            ...door,
            items: newItems,
            spinning: true,
            stopped: false,
            currentIndex: 0,
          };
        })
      );

      // Animate reels
      setTimeout(() => {
        setTransitionEnabled(true);

        doors.forEach((_, i) => {
          setTimeout(() => {
            setDoors((prevDoors) =>
              prevDoors.map((door, di) => {
                if (di === i) {
                  return {
                    ...door,
                    spinning: false,
                    stopped: true,
                    currentIndex: Math.floor(ITEMS_TO_SCROLL / 2),
                  };
                }
                return door;
              })
            );

            // Check result after last reel stops
            if (i === doors.length - 1) {
              setTimeout(() => {
                const finalSymbols = doors.map(
                  (door) => door.items[Math.floor(ITEMS_TO_SCROLL / 2)]
                );
                checkWinningCombination(finalSymbols);
                setSpinning(false);
              }, 500);
            }
          }, SPIN_DURATION + i * STOP_DELAY);
        });
      }, 50);
    } catch (error) {
      console.error("Spin failed:", error);
      setSpinning(false);
    }
  };

  const openDialog = () => {
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="font-redhat text-2xl font-black leading-[60.24px] text-left animate-bounce flex flex-col items-center">
        <p className="mr-2 bg-gradient-to-b from-white to-[#8B5CF6] bg-clip-text text-transparent">
          JACKPOT
        </p>
        <div className="flex flex-row">
          <Image src={degen} alt="wallet" className="w-10 h-10 mr-2" />
          <p className="bg-gradient-to-b from-white to-[#8B5CF6] bg-clip-text text-transparent -mt-3">
            100,000 DEGENS
          </p>
        </div>
      </div>

      {winner && (
        <div className="animate-fadeIn text-green-500 text-xl font-bold mb-4">
          You won {prizeAmount} DEGENS!
        </div>
      )}

      {/* <div className="flex flex-col items-center px-8 bg-[url('/box_mobile.png')] bg-contain bg-no-repeat bg-center w-[26rem]">
        <div className="flex gap-4 p-12 rounded-lg shadow-lg">
          {doors.map((door, index) => (
            <div
              key={index}
              className="door w-28 h-8rem overflow-hidden relative bg-opacity-50 backdrop-blur-sm rounded-lg"
            >
              <div
                className={`boxes flex flex-col transition-transform ease-in-out will-change-transform`}
                style={{
                  transitionDuration: transitionEnabled
                    ? `${TRANSITION_DURATION}ms`
                    : "0ms",
                  transform:
                    door.spinning || !door.stopped
                      ? `translateY(-${door.currentIndex * 60}px)`
                      : `translateY(-${
                          Math.floor(ITEMS_TO_SCROLL / 2) * 60
                        }px)`,
                }}
              >
                {door.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`box flex items-center justify-center text-6xl bg-white border-2 
                    ${
                      itemIndex === Math.floor(ITEMS_TO_SCROLL / 2)
                        ? "border-purple-500 shadow-lg"
                        : "border-gray-200"
                    }
                    h-[85px] transition-all duration-200
                    ${
                      door.stopped &&
                      itemIndex === Math.floor(ITEMS_TO_SCROLL / 2)
                        ? "scale-105"
                        : "scale-100"
                    }`}
                  >
                    {item.element}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div> */}
      <div className="flex flex-col items-center px-8 bg-[url('/box_mobile.png')] bg-contain bg-no-repeat bg-center w-[26rem]">
        <div className="flex gap-4 p-12 rounded-lg shadow-lg">
          {doors.map((door, index) => (
            <div
              key={index}
              className="door w-28 h-[120px] overflow-hidden relative bg-opacity-50 backdrop-blur-sm rounded-lg"
            >
              <div
                className={`boxes flex flex-col transition-transform ease-in-out will-change-transform`}
                style={{
                  transitionDuration: transitionEnabled
                    ? `${TRANSITION_DURATION}ms`
                    : "0ms",
                  transform:
                    door.spinning || !door.stopped
                      ? `translateY(-${door.currentIndex * 120}px)`
                      : `translateY(-${
                          Math.floor(ITEMS_TO_SCROLL / 2) * 120
                        }px)`,
                }}
              >
                {door.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`box flex items-center justify-center bg-white border-2 
                    ${
                      itemIndex === Math.floor(ITEMS_TO_SCROLL / 2)
                        ? "border-purple-500 shadow-lg"
                        : "border-gray-200"
                    }
                    h-[120px] w-full transition-all duration-200
                    ${
                      door.stopped &&
                      itemIndex === Math.floor(ITEMS_TO_SCROLL / 2)
                        ? "scale-105"
                        : "scale-100"
                    }`}
                  >
                    {item.element}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-md text-center flex flex-col items-center justify-center mt-4">
        <p className="mb-2 text-lg font-medium">
          Available Spins: {userData ? Number(userData[1]) : 0}
          {userData && !userData[0] ? " (Closed)" : ""}
        </p>

        <div className="mb-4 w-[300px]">
          <input
            type="number"
            placeholder="Number of spins to buy"
            value={spinCount}
            onChange={(e) => setSpinCount(Number(e.target.value))}
            className="w-full bg-white text-black placeholder-black border-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
            min="1"
            step="1"
          />
        </div>

        <Button
          onClick={handleBuySpins}
          disabled={isBuyingSpins || !isConnected}
          className="mb-4 w-full transition-transform active:scale-95"
        >
          {isBuyingSpins ? "Buying..." : "Buy Spins"}
        </Button>

        {txHash && (
          <div className="mt-2 text-xs bg-gray-800 rounded-lg p-3 w-full">
            <div className="truncate">Hash: {txHash}</div>
            <div className="mt-1">
              Status:{" "}
              <span
                className={isConfirmed ? "text-green-400" : "text-yellow-400"}
              >
                {isConfirming
                  ? "Confirming..."
                  : isConfirmed
                  ? "Confirmed!"
                  : "Pending"}
              </span>
            </div>
          </div>
        )}

        <Button2
          onClick={spin}
          className="text-lg text-white w-[300px] h-[50px] bg-gradient-to-r from-[#D9D9D9] to-[#8B5CF6] 
          shadow-[0_8px_#264BAC,0_60px_25px_rgba(66,112,234,0.19)] transform transition-all
          hover:shadow-[0_6px_#264BAC,0_50px_20px_rgba(66,112,234,0.19)]
          active:shadow-[0_4px_#264BAC,0_40px_15px_rgba(66,112,234,0.19)]
          active:translate-y-1"
          style={{
            clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
          }}
        >
          {spinning ? "SPINNING..." : "SPIN"}
        </Button2>
      </div>

      <div className="w-full flex flex-row gap-4 h-1/3 items-center justify-between mb-2 mt-8 px-2">
        <div className="w-1/2 flex items-center -mb-8">
          <div className="flex items-center">
            <div
              className="w-[10rem] h-[3rem] rounded-r-[0.875rem] rounded-l-[2rem] bg-purple-700 
            text-right flex items-center justify-center text-white relative
            hover:bg-purple-600 transition-colors"
            >
              <Image
                src={degen}
                alt="wallet"
                className="w-[3rem] absolute left-0 top-1/2 -translate-y-1/2"
              />
              <div className="-mr-8 text-sm font-medium">Wallet Balance</div>
            </div>
          </div>
        </div>

        <div
          className="w-1/2 text-center flex items-center justify-center -mb-8 cursor-pointer
          transition-transform hover:scale-105 active:scale-95"
          onClick={openDialog}
        >
          <Image src={Image1} alt="wallet" className="w-25" />
        </div>
      </div>

      <Dialog
        visible={dialogVisible}
        onHide={hideDialog}
        closable={false}
        showHeader={false}
        className="border-none rounded-lg overflow-hidden"
      />
    </div>
  );
};

export default SlotMachine;
