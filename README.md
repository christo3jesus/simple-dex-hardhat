# Simple DEX - Decentralized Exchange

## 📜 Description

Simple DEX is a decentralized exchange platform built to demonstrate token liquidity management and token swapping functionality on the Ethereum blockchain. The DApp allows users to connect their MetaMask wallet, view contract data, add/remove liquidity, and swap tokens seamlessly.

This project is deployed on the **Sepolia Test Network** and leverages a combination of **Solidity** for smart contracts and **ethers.js** for frontend integration.

---

## 🚀 Features

- **Connect MetaMask**: Interact with the Ethereum blockchain using your MetaMask wallet.
- **Liquidity Management**: Add or remove liquidity for Token A and Token B.
- **Token Swapping**: Swap between Token A and Token B.
- **Live Contract Data**: View current reserves, prices, and contract owner details.

---

## 🛠️ Technologies Used

### Backend:

- **Solidity**: Smart contract language for Ethereum.
- **Hardhat**: Development environment for compiling, deploying, and testing smart contracts.

### Frontend:

- **HTML, JavaScript, TailwindCSS**: User interface for interacting with the smart contracts.
- **ethers.js**: Ethereum JavaScript library for connecting and interacting with contracts.

---

## 📦 Project Structure

```plaintext
├── contracts/          # Solidity smart contracts
│   ├── SimpleDEX.sol
│   ├── TokenA.sol
│   ├── TokenB.sol
├── ignition/modules/   # Deployment and setup scripts for Hardhat
│   ├── SimpleDEX.ts
│   ├── TokenA.ts
│   ├── TokenB.ts
├── public/             # Frontend files
│   ├── index.html
│   ├── scripts.js
├── test/               # Test cases for smart contracts
│   ├── SimpleDEX.ts
│   ├── TokenA.ts
│   ├── TokenB.ts
├── example.env         # Example .env configuration
├── hardhat.config.ts   # Hardhat configuration
└── README.md           # Project documentation
```

---

## ⚡ Getting Started

### Prerequisites

1. **Node.js** (v16 or higher)
2. **MetaMask Wallet** (Browser Extension)
3. **Sepolia Test Network** (Setup in MetaMask)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/christo3jesus/simple-dex-hardhat.git
   cd simple-dex-hardhat
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure `.env` for deployment:

   ```plaintext
   INFURA_API_KEY=<your-infura-api-key>
   SEPOLIA_PRIVATE_KEY=<your-wallet-private-key>
   ETHERSCAN_API_KEY=<your-etherscan-api-key>
   ```

   Replace `<your-infura-api-key>` with your Infura API key, `<your-wallet-private-key>` with your wallet's private and `<your-etherscan-api-key>` with your Etherscan API key.

4. Launch DApp:

   ```bash
   npm run start
   ```

---

## 🧪 Hardhat Commands

### Compile the smart contracts:

```bash
npx hardhat compile
```

### Start local node:

```bash
npx hardhat node
```

### Deploy the contracts:

```bash
npx hardhat ignition deploy --network sepolia --verify
```

### Run tests:

```bash
npx hardhat test
```

---

## 🌐 Live Deployment

- **DApp URL**: [Simple DEX DApp](https://christo3jesus.github.io/simple-dex-hardhat)
- **Token Contract on Sepolia**:
  - **SimpleDEX Contract**: [0x639D16C51bE7dd92886880061894eCA58C7B0b61](https://sepolia.etherscan.io/address/0x639D16C51bE7dd92886880061894eCA58C7B0b61)
  - **Token A**: [0x668ab401D832371FA7a46B03a44aF14D3C8ce257](https://sepolia.etherscan.io/address/0x668ab401D832371FA7a46B03a44aF14D3C8ce257)
  - **Token B**: [0x77B8E95b56190E6e9BeB45CBB6CF39bae946Ce5a](https://sepolia.etherscan.io/address/0x77B8E95b56190E6e9BeB45CBB6CF39bae946Ce5a)

---

## 🎥 Demonstration Video

Watch the full demonstration on YouTube: [Simple DEX Demo](https://youtu.be/M91Jq_xksOU)

---

## 🌟 Contribution

Contributions are welcome! Feel free to fork the repository and submit a pull request.

---

## 📜 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 🔗 Additional Links

- **Hardhat Documentation**: [https://hardhat.org](https://hardhat.org)
- **ethers.js Documentation**: [https://docs.ethers.io](https://docs.ethers.io)
