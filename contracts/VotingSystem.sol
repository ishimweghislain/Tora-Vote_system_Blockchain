// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract VotingSystem is Ownable, ReentrancyGuard {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
        bool exists;
    }
    
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedCandidateId;
    }
    
    mapping(address => Voter) public voters;
    mapping(uint256 => Candidate) public candidates;
    
    uint256 public candidatesCount;
    uint256 public totalVotes;
    bool public votingActive;
    
    event VoterRegistered(address indexed voter);
    event CandidateAdded(uint256 indexed candidateId, string name);
    event VoteCast(address indexed voter, uint256 indexed candidateId);
    event VotingStarted();
    event VotingEnded();
    
    modifier onlyRegisteredVoter() {
        require(voters[msg.sender].isRegistered, "You are not registered to vote");
        _;
    }
    
    modifier onlyDuringVoting() {
        require(votingActive, "Voting is not active");
        _;
    }
    
    modifier hasNotVoted() {
        require(!voters[msg.sender].hasVoted, "You have already voted");
        _;
    }
    
    constructor() {
        votingActive = false;
    }
    
    // Register a voter (only owner can register voters)
    function registerVoter(address _voter) external onlyOwner {
        require(!voters[_voter].isRegistered, "Voter is already registered");
        
        voters[_voter] = Voter({
            isRegistered: true,
            hasVoted: false,
            votedCandidateId: 0
        });
        
        emit VoterRegistered(_voter);
    }
    
    // Add a candidate (only owner can add candidates)
    function addCandidate(string memory _name) external onlyOwner {
        require(bytes(_name).length > 0, "Candidate name cannot be empty");
        require(!votingActive, "Cannot add candidates during active voting");
        
        candidatesCount++;
        candidates[candidatesCount] = Candidate({
            id: candidatesCount,
            name: _name,
            voteCount: 0,
            exists: true
        });
        
        emit CandidateAdded(candidatesCount, _name);
    }
    
    // Start voting (only owner)
    function startVoting() external onlyOwner {
        require(!votingActive, "Voting is already active");
        require(candidatesCount > 0, "No candidates available");
        
        votingActive = true;
        emit VotingStarted();
    }
    
    // End voting (only owner)
    function endVoting() external onlyOwner {
        require(votingActive, "Voting is not active");
        
        votingActive = false;
        emit VotingEnded();
    }
    
    // Cast a vote
    function vote(uint256 _candidateId) external 
        onlyRegisteredVoter 
        onlyDuringVoting 
        hasNotVoted 
        nonReentrant 
    {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");
        require(candidates[_candidateId].exists, "Candidate does not exist");
        
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedCandidateId = _candidateId;
        
        candidates[_candidateId].voteCount++;
        totalVotes++;
        
        emit VoteCast(msg.sender, _candidateId);
    }
    
    // Get candidate details
    function getCandidate(uint256 _candidateId) external view returns (
        uint256 id,
        string memory name,
        uint256 voteCount
    ) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");
        require(candidates[_candidateId].exists, "Candidate does not exist");
        
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.id, candidate.name, candidate.voteCount);
    }
    
    // Get all candidates
    function getAllCandidates() external view returns (
        uint256[] memory ids,
        string[] memory names,
        uint256[] memory voteCounts
    ) {
        ids = new uint256[](candidatesCount);
        names = new string[](candidatesCount);
        voteCounts = new uint256[](candidatesCount);
        
        for (uint256 i = 1; i <= candidatesCount; i++) {
            if (candidates[i].exists) {
                ids[i-1] = candidates[i].id;
                names[i-1] = candidates[i].name;
                voteCounts[i-1] = candidates[i].voteCount;
            }
        }
    }
    
    // Get winner (can only be called after voting ends)
    function getWinner() external view returns (
        uint256 winnerId,
        string memory winnerName,
        uint256 winnerVoteCount
    ) {
        require(!votingActive, "Voting is still active");
        require(candidatesCount > 0, "No candidates available");
        
        uint256 maxVotes = 0;
        uint256 winningCandidateId = 0;
        
        for (uint256 i = 1; i <= candidatesCount; i++) {
            if (candidates[i].exists && candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winningCandidateId = i;
            }
        }
        
        require(winningCandidateId > 0, "No winner found");
        
        return (
            winningCandidateId,
            candidates[winningCandidateId].name,
            candidates[winningCandidateId].voteCount
        );
    }
    
    // Check if voter is registered
    function isVoterRegistered(address _voter) external view returns (bool) {
        return voters[_voter].isRegistered;
    }
    
    // Check if voter has voted
    function hasVoterVoted(address _voter) external view returns (bool) {
        return voters[_voter].hasVoted;
    }
    
    // Get voting status
    function getVotingStatus() external view returns (
        bool isActive,
        uint256 totalCandidates,
        uint256 totalVotesCast
    ) {
        return (votingActive, candidatesCount, totalVotes);
    }
}
