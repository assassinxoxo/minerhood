import "./App.css";
import Web3 from "web3";
import { useState, useEffect } from "react";

const web3 = new Web3(window.ethereum);

const abi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "adr", type: "address" }],
    name: "beanRewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "ref", type: "address" }],
    name: "buyEggs",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "eth", type: "uint256" },
      { internalType: "uint256", name: "contractBalance", type: "uint256" },
    ],
    name: "calculateEggBuy",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "eth", type: "uint256" }],
    name: "calculateEggBuySimple",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "eggs", type: "uint256" }],
    name: "calculateEggSell",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "adr", type: "address" }],
    name: "getEggsSinceLastHatch",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "adr", type: "address" }],
    name: "getMyEggs",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "adr", type: "address" }],
    name: "getMyMiners",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "ref", type: "address" }],
    name: "hatchEggs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "seedMarket",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "sellEggs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const address = "0x4d35AD73Fa91c2B28D4B430D5FBe5b382b56Fbfc";
const web3Instance = new Web3();
web3Instance.setProvider(Web3.givenProvider);
const web3Contract = new web3Instance.eth.Contract(abi, address);

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  // const [connectButtonText, setConnectButtonText] = useState("CONNECT");
  const [currentContractVal, setCurrentContractVal] = useState(0);
  const [bakeBNB, setBakeBNB] = useState(0);
  const [refURL, setRefURL] = useState("");
  const [ref, setRef] = useState("0x0000000000000000000000000000000000000000");
  const [connection, setConnection] = useState(false);
  const [walletBalance, setWalletBalance] = useState({
    bnb: 0,
    beans: 0,
    rewards: 0,
  });

  useEffect(() => {
    console.log("connection", connection);
    if (window.location.search.includes("ref")) {
      setRef(window.location.search.split("ref=")[1]);
      setRefURL(window.location.href);
    }
  }, []);

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const connectionHandler = async () => {
    if (window.ethereum) {
      if (connection) {
        setWalletBalance({
          bnb: 0,
          beans: 0,
          rewards: 0,
        });
        setConnection(false);
        setRef("0x0000000000000000000000000000000000000000");
        setRefURL("");
        setWalletAddress("");
        return;
      }
      console.log("metamask detected");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("accounts", accounts);
      setWalletAddress(accounts[0]);
      // await sleep(3000);
      setConnection(true);
      connectWallet(accounts[0]);
    } else {
      alert("no metamask detected");
    }
  };

  const connectWallet = async (connectedAddress) => {
    try {
      if (typeof window.ethereum !== "undefined") {
        console.log("wallet address - ", walletAddress);

        const [contractBnb, bnbAmount, beansAmount, rewardsAmount] =
          await Promise.allSettled([
            web3.eth.getBalance(address),
            web3.eth.getBalance(connectedAddress),
            web3Contract.methods.getMyMiners(connectedAddress).call(),
            web3Contract.methods.beanRewards(connectedAddress).call(),
          ]);
        console.log("contract bnb", contractBnb);
        console.log("bnb amount", bnbAmount);
        console.log("beans amount", beansAmount);
        console.log("rewards amount", rewardsAmount);

        setCurrentContractVal(
          fromWei(contractBnb.status === "fulfilled" ? contractBnb.value : 0)
        );
        console.log("balance", {
          bnb: fromWei(
            `${bnbAmount.status === "fulfilled" ? bnbAmount.value : 0}`
          ),
          beans: fromWei(
            `${beansAmount.status === "fulfilled" ? beansAmount.value : 0}`
          ),
          rewards: fromWei(
            `${rewardsAmount.status === "fulfilled" ? rewardsAmount.value : 0}`
          ),
        });
        setWalletBalance({
          bnb: fromWei(
            `${bnbAmount.status === "fulfilled" ? bnbAmount.value : 0}`
          ),
          beans: fromWei(
            `${beansAmount.status === "fulfilled" ? beansAmount.value : 0}`
          ),
          rewards: fromWei(
            `${rewardsAmount.status === "fulfilled" ? rewardsAmount.value : 0}`
          ),
        });
        setRefURL(`${window.location.origin}/?ref=${connectedAddress}`);
        setRef(connectedAddress);
        // setConnectButtonText("DISCONNECT");
      }
    } catch (error) {
      setWalletBalance({
        bnb: 0,
        beans: 0,
        rewards: 0,
      });
      console.log("Error in connect wallet function", error);
    }
  };
  const fromWei = (wei, unit = "ether") => {
    return parseFloat(Web3.utils.fromWei(wei, unit)).toFixed(3);
  };

  const toWei = (amount, unit = "ether") => {
    return Web3.utils.toWei(amount, unit);
  };

  const onUpdateBakeBNB = (value) => {
    // console.log("onUpdateBake value", value);
    setBakeBNB(value);
  };
  const bake = async () => {
    try {
      console.log(
        await web3Contract.methods.buyEggs(ref).send({
          from: walletAddress,
          value: toWei(`${bakeBNB}`),
        })
      );
    } catch (err) {
      console.error(err);
    }
    // fetchWalletBalance();
    // fetchContractBNBBalance();
    // setLoading(false);
  };

  const reBake = async () => {
    try {
      console.log(
        await web3Contract.methods.hatchEggs(ref).send({
          from: walletAddress,
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const eatBeans = async () => {
    try {
      console.log(
        await web3Contract.methods.sellEggs().send({
          from: walletAddress,
        })
      );
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="App">
      <div className="connect-button absolute top-8 right-8">
        <button
          className="con-butt-1"
          onClick={connectionHandler}
          style={
            connection
              ? { fontSize: "16px", fontWeight: "bolder", padding: "5px" }
              : { fontWeight: "bolder" }
          }
        >
          {connection ? "DISCONNECT" : "CONNECT"}
        </button>
      </div>
      <div className=" flex flex-col items-center justify-center">
        <div className="w-[386px] ml-12 mb-1">
          <div className="w-[300px]">
            <img src="logo-removetransparentborders.png"></img>
          </div>
        </div>
        <div className="connect-button-mobile">
          <button
            onClick={connectionHandler}
            style={
              connection
                ? { fontSize: "15px", fontWeight: "bolder" }
                : { fontWeight: "bolder" }
            }
          >
            {connection ? "DISCONNECT" : "CONNECT"}
          </button>
        </div>
        <div className="w-[386px]">
          <div className="info">
            The BNB Reward Pool with the tastiest daily return and lowest dev
            fee
          </div>
        </div>

        <div className="w-96 h-[500px]  mt-6 pt-6 grid grid-cols-2 gap-x-28 justify-items-center rounded-xl shadow-lg shadow-black bg-regal-pink">
          <div className="decs "> Contract</div>
          <div className="balance">
            {" "}
            <span className="text-white">{currentContractVal}</span> BNB
          </div>
          <div className="decs"> Wallet</div>
          <div className="balance">
            {" "}
            <span className="text-white">{walletBalance.bnb}</span> BNB
          </div>
          <div className="decs"> Your Beans</div>
          <div className="balance">
            {" "}
            <span className="text-white">{walletBalance.beans}</span> Beans
          </div>
          <div className=" col-span-2 px-4">
            <input
              className="bake-input w-80"
              max={+walletBalance.bnb}
              value={bakeBNB}
              onChange={(e) => onUpdateBakeBNB(e.target.value)}
            />
            <hr class="MuiDivider-root MuiDivider-fullWidth css-39bbo6"></hr>
          </div>

          <div className="col-span-2 mb-4 flex flex-row justify-center">
            <button
              className="bake-beans-button  px-4 rounded-3xl shadow-md shadow-black bg-regal-pink"
              style={connection ? {} : { opacity: 0.5 }}
              onClick={bake}
              disabled={!connection}
            >
              Bake Beans
            </button>
          </div>
          <div className="rewards-decs pl-3">Your Rewards</div>
          <div className="balance">
            <span className="text-white">{walletBalance.rewards}</span> BNB
          </div>
          <div>
            <button
              className="reBake-button py-2 px-4 rounded-2xl shadow-md shadow-black bg-regal-pink"
              onClick={reBake}
              disabled={!connection}
              style={connection ? {} : { opacity: 0.5 }}
            >
              RE-BAKE
            </button>
          </div>
          <div>
            <button
              className="eat-button py-2 px-4 rounded-3xl shadow-md shadow-black bg-regal-pink"
              onClick={eatBeans}
              disabled={!connection}
              style={connection ? {} : { opacity: 0.5 }}
            >
              EAT BEANS
            </button>
          </div>
        </div>
        <div className="nutritions w-96  p-8 mt-10 grid grid-cols-2 gap-x-36 gap-y-5 justify-items-stretch rounded-xl shadow-lg shadow-black bg-regal-pink">
          <div className="col-span-2 ">Nutrition Facts</div>
          <div>Daily Return</div>
          <div className="text-regal-brown">8%</div>
          <div>APR</div>
          <div className="text-regal-brown">2,920%</div>
          <div>Dev Fee</div>
          <div className="text-regal-brown">3%</div>
        </div>
        <div className="w-96 p-4 mt-10 rounded-xl shadow-lg shadow-black bg-regal-brown">
          <div className="m-4 flex flex-row justify-center text-white">
            Referral Link
          </div>
          <div className="m-4 flex flex-row justify-center">
            <input readOnly={true} className="ref-input w-80" value={refURL} />
          </div>
          <div className="m-4 flex flex-row justify-center">
            <p className="w-72 text-white">
              Earn 12% of the BNB used to bake beans from anyone who uses your
              referral link
            </p>
          </div>
        </div>
        <div className="mt-10 w-96  bg-regal-pink"></div>
      </div>
    </div>
  );
}

export default App;
