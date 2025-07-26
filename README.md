# DecentralVote - Decentralized Voting System (DApp)

A secure, transparent, and tamper-proof voting system built on the Ethereum blockchain using Solidity smart contracts and a modern React frontend.

## 🚀 Features

### Smart Contract Features
- **Voter Registration**: Only registered voters can participate
- **Candidate Management**: Admin can add candidates before voting starts
- **Secure Voting**: Prevents double voting and ensures vote integrity
- **Automatic Winner Calculation**: Determines winner after voting ends
- **Access Control**: Owner-only functions for admin operations
- **Real-time Results**: Live vote counting and results display

### Frontend Features
- **MetaMask Integration**: Seamless wallet connection
- **Modern UI**: Built with React, Vite, and Tailwind CSS
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Live voting results and status updates
- **Admin Panel**: Complete admin interface for managing elections
- **Vote Interface**: Intuitive voting experience for users
- **Results Display**: Beautiful charts and winner announcements

## 🛠 Tech Stack

- **Blockchain**: Ethereum, Solidity ^0.8.19
- **Smart Contract Framework**: Hardhat
- **Frontend**: React 19, Vite, Tailwind CSS
- **Web3 Integration**: Ethers.js v6, MetaMask
- **Testing**: Hardhat Test Suite with Chai
- **Security**: OpenZeppelin Contracts (Ownable, ReentrancyGuard)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v20.17.0 or higher)
- MetaMask browser extension
- Git

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Compile Smart Contract

```bash
npx hardhat compile
```

### 3. Run Tests

```bash
npx hardhat test
```

### 4. Start Local Blockchain

```bash
# In terminal 1 - keep this running
npx hardhat node
```

### 5. Deploy Contract

```bash
# In terminal 2
npx hardhat run scripts/deploy.js --network localhost
```

### 6. Start Frontend

```bash
# In terminal 3
cd frontend
npm run dev
```

### 7. Configure MetaMask

1. Open MetaMask and add a new network:
   - **Network Name**: Localhost 8545
   - **RPC URL**: http://localhost:8545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH

2. Import one of the test accounts from Hardhat node output using the private key

## 🎯 Usage Guide

### For Administrators

1. **Connect Wallet**: Connect your MetaMask wallet (must be the contract deployer)
2. **Add Candidates**: Use the Admin panel to add candidates
3. **Register Voters**: Add voter addresses to the registration list
4. **Start Voting**: Begin the voting process
5. **Monitor Results**: View live voting results
6. **End Voting**: Close voting and announce winner

### For Voters

1. **Connect Wallet**: Connect your registered MetaMask wallet
2. **View Candidates**: Browse available candidates
3. **Cast Vote**: Select and submit your vote (one vote per address)
4. **View Results**: Check live results and final winner

## 🔧 Smart Contract Functions

### Admin Functions (Owner Only)
- `registerVoter(address _voter)`: Register a voter
- `addCandidate(string _name)`: Add a candidate
- `startVoting()`: Start the voting process
- `endVoting()`: End voting and enable winner calculation

### Voter Functions
- `vote(uint256 _candidateId)`: Cast a vote for a candidate

### View Functions
- `getAllCandidates()`: Get all candidates with vote counts
- `getVotingStatus()`: Get current voting status
- `getWinner()`: Get winner (only after voting ends)
- `isVoterRegistered(address)`: Check if address is registered
- `hasVoterVoted(address)`: Check if address has voted

## 🧪 Testing

The project includes comprehensive tests covering:

- Voter registration and validation
- Candidate management
- Voting process and restrictions
- Winner calculation
- Access control and security

Run tests with:
```bash
npx hardhat test
```

## 🔒 Security Features

- **Access Control**: Owner-only admin functions
- **Reentrancy Protection**: Prevents reentrancy attacks
- **Double Voting Prevention**: Each address can only vote once
- **Input Validation**: Comprehensive input validation
- **Secure State Management**: Proper state transitions

## 📱 Frontend Components

- **WalletConnection**: MetaMask integration and network management
- **AdminPanel**: Complete admin interface for election management
- **VotingInterface**: User-friendly voting experience
- **ResultsDisplay**: Real-time results with charts and winner display

## 🌐 Network Configuration

### Local Development
- **Network**: Hardhat Local Network
- **Chain ID**: 1337
- **RPC URL**: http://localhost:8545

### Testnet Deployment (Optional)
The contract can be deployed to testnets like Goerli or Sepolia by updating the Hardhat configuration.

## 🚨 Important Notes

1. **Private Keys**: Never share private keys or deploy with real funds on mainnet
2. **Testing**: Always test thoroughly before any production deployment
3. **Gas Costs**: Consider gas optimization for mainnet deployment
4. **Security Audit**: Conduct security audits before production use

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **MetaMask Connection Issues**
   - Ensure MetaMask is installed and unlocked
   - Check network configuration (localhost:8545, Chain ID: 1337)

2. **Contract Not Found**
   - Ensure Hardhat node is running
   - Redeploy the contract if needed

3. **Transaction Failures**
   - Check if you have enough ETH for gas
   - Ensure you're on the correct network

4. **Voting Restrictions**
   - Ensure your address is registered as a voter
   - Check if voting is currently active
   - Verify you haven't already voted

## 📞 Support

For issues and questions, please create an issue in the repository or contact the development team.

---

**Built with ❤️ using Ethereum, React, and modern web technologies**
