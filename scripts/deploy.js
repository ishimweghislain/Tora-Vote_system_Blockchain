const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying VotingSystem contract...");

  // Get the ContractFactory and Signers here.
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy the contract
  const VotingSystem = await ethers.getContractFactory("VotingSystem");
  const votingSystem = await VotingSystem.deploy();
  
  await votingSystem.waitForDeployment();
  
  console.log("VotingSystem deployed to:", await votingSystem.getAddress());
  
  // Save the contract address and ABI for frontend
  const fs = require("fs");
  const contractsDir = "./frontend/src/contracts";
  
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }
  
  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ VotingSystem: await votingSystem.getAddress() }, undefined, 2)
  );
  
  const VotingSystemArtifact = await ethers.getContractFactory("VotingSystem");
  fs.writeFileSync(
    contractsDir + "/VotingSystem.json",
    JSON.stringify(VotingSystemArtifact.interface.format('json'), null, 2)
  );
  
  console.log("Contract address and ABI saved to frontend/src/contracts/");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
