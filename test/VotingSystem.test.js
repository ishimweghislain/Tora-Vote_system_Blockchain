const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingSystem", function () {
  let votingSystem;
  let owner;
  let voter1;
  let voter2;
  let voter3;

  beforeEach(async function () {
    [owner, voter1, voter2, voter3] = await ethers.getSigners();
    
    const VotingSystem = await ethers.getContractFactory("VotingSystem");
    votingSystem = await VotingSystem.deploy();
    await votingSystem.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await votingSystem.owner()).to.equal(owner.address);
    });

    it("Should initialize with voting inactive", async function () {
      const [isActive] = await votingSystem.getVotingStatus();
      expect(isActive).to.be.false;
    });
  });

  describe("Voter Registration", function () {
    it("Should allow owner to register voters", async function () {
      await votingSystem.registerVoter(voter1.address);
      expect(await votingSystem.isVoterRegistered(voter1.address)).to.be.true;
    });

    it("Should not allow non-owner to register voters", async function () {
      await expect(
        votingSystem.connect(voter1).registerVoter(voter2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not allow registering the same voter twice", async function () {
      await votingSystem.registerVoter(voter1.address);
      await expect(
        votingSystem.registerVoter(voter1.address)
      ).to.be.revertedWith("Voter is already registered");
    });
  });

  describe("Candidate Management", function () {
    it("Should allow owner to add candidates", async function () {
      await votingSystem.addCandidate("Alice");
      const [id, name, voteCount] = await votingSystem.getCandidate(1);
      
      expect(id).to.equal(1);
      expect(name).to.equal("Alice");
      expect(voteCount).to.equal(0);
    });

    it("Should not allow adding candidates with empty names", async function () {
      await expect(
        votingSystem.addCandidate("")
      ).to.be.revertedWith("Candidate name cannot be empty");
    });

    it("Should not allow non-owner to add candidates", async function () {
      await expect(
        votingSystem.connect(voter1).addCandidate("Bob")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not allow adding candidates during active voting", async function () {
      await votingSystem.addCandidate("Alice");
      await votingSystem.startVoting();
      
      await expect(
        votingSystem.addCandidate("Bob")
      ).to.be.revertedWith("Cannot add candidates during active voting");
    });
  });

  describe("Voting Process", function () {
    beforeEach(async function () {
      // Setup candidates and voters
      await votingSystem.addCandidate("Alice");
      await votingSystem.addCandidate("Bob");
      await votingSystem.registerVoter(voter1.address);
      await votingSystem.registerVoter(voter2.address);
    });

    it("Should allow starting voting when candidates exist", async function () {
      await votingSystem.startVoting();
      const [isActive] = await votingSystem.getVotingStatus();
      expect(isActive).to.be.true;
    });

    it("Should not allow starting voting without candidates", async function () {
      const VotingSystem = await ethers.getContractFactory("VotingSystem");
      const emptyVotingSystem = await VotingSystem.deploy();
      
      await expect(
        emptyVotingSystem.startVoting()
      ).to.be.revertedWith("No candidates available");
    });

    it("Should allow registered voters to vote", async function () {
      await votingSystem.startVoting();
      await votingSystem.connect(voter1).vote(1);
      
      expect(await votingSystem.hasVoterVoted(voter1.address)).to.be.true;
      const [, , voteCount] = await votingSystem.getCandidate(1);
      expect(voteCount).to.equal(1);
    });

    it("Should not allow unregistered voters to vote", async function () {
      await votingSystem.startVoting();
      
      await expect(
        votingSystem.connect(voter3).vote(1)
      ).to.be.revertedWith("You are not registered to vote");
    });

    it("Should not allow voting twice", async function () {
      await votingSystem.startVoting();
      await votingSystem.connect(voter1).vote(1);
      
      await expect(
        votingSystem.connect(voter1).vote(2)
      ).to.be.revertedWith("You have already voted");
    });

    it("Should not allow voting when voting is inactive", async function () {
      await expect(
        votingSystem.connect(voter1).vote(1)
      ).to.be.revertedWith("Voting is not active");
    });

    it("Should not allow voting for invalid candidate", async function () {
      await votingSystem.startVoting();
      
      await expect(
        votingSystem.connect(voter1).vote(999)
      ).to.be.revertedWith("Invalid candidate ID");
    });
  });

  describe("Results and Winner", function () {
    beforeEach(async function () {
      // Setup candidates and voters
      await votingSystem.addCandidate("Alice");
      await votingSystem.addCandidate("Bob");
      await votingSystem.addCandidate("Charlie");
      
      await votingSystem.registerVoter(voter1.address);
      await votingSystem.registerVoter(voter2.address);
      await votingSystem.registerVoter(voter3.address);
      
      await votingSystem.startVoting();
      
      // Cast votes
      await votingSystem.connect(voter1).vote(1); // Alice
      await votingSystem.connect(voter2).vote(1); // Alice
      await votingSystem.connect(voter3).vote(2); // Bob
    });

    it("Should correctly calculate winner", async function () {
      await votingSystem.endVoting();
      
      const [winnerId, winnerName, winnerVoteCount] = await votingSystem.getWinner();
      expect(winnerId).to.equal(1);
      expect(winnerName).to.equal("Alice");
      expect(winnerVoteCount).to.equal(2);
    });

    it("Should not allow getting winner during active voting", async function () {
      await expect(
        votingSystem.getWinner()
      ).to.be.revertedWith("Voting is still active");
    });

    it("Should return all candidates with vote counts", async function () {
      const [ids, names, voteCounts] = await votingSystem.getAllCandidates();
      
      expect(ids.length).to.equal(3);
      expect(names[0]).to.equal("Alice");
      expect(names[1]).to.equal("Bob");
      expect(names[2]).to.equal("Charlie");
      expect(voteCounts[0]).to.equal(2);
      expect(voteCounts[1]).to.equal(1);
      expect(voteCounts[2]).to.equal(0);
    });
  });

  describe("Voting Status", function () {
    it("Should return correct voting status", async function () {
      await votingSystem.addCandidate("Alice");
      await votingSystem.addCandidate("Bob");
      await votingSystem.registerVoter(voter1.address);
      
      let [isActive, totalCandidates, totalVotesCast] = await votingSystem.getVotingStatus();
      expect(isActive).to.be.false;
      expect(totalCandidates).to.equal(2);
      expect(totalVotesCast).to.equal(0);
      
      await votingSystem.startVoting();
      await votingSystem.connect(voter1).vote(1);
      
      [isActive, totalCandidates, totalVotesCast] = await votingSystem.getVotingStatus();
      expect(isActive).to.be.true;
      expect(totalCandidates).to.equal(2);
      expect(totalVotesCast).to.equal(1);
    });
  });
});
