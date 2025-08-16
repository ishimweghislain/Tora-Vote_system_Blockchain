// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract VotingSystem is Ownable, ReentrancyGuard {
    struct Candidate {
        uint256 id;
        string name;
        string imageUrl;
        uint256 voteCount;
        bool exists;
    }

    struct Voter {
        string rwandanId;
        string fullName;
        string gender;
        bool isRegistered;
        bool hasVoted;
        uint256 votedCandidateId;
    }

    mapping(string => Voter) public votersByID;
    mapping(address => string) public addressToID;
    mapping(uint256 => Candidate) public candidates;
    string[] public registeredIDs;
    
    uint256 public candidatesCount;
    uint256 public totalVotes;
    bool public votingActive;

    event VoterRegistered(string indexed rwandanId, string fullName);
    event CandidateAdded(uint256 indexed candidateId, string name);
    event VoteCast(string indexed rwandanId, uint256 indexed candidateId);
    event VotingStarted();
    event VotingEnded();

    modifier onlyRegisteredVoter() {
        string memory voterID = addressToID[msg.sender];
        require(bytes(voterID).length > 0 && votersByID[voterID].isRegistered, "You are not registered to vote");
        _;
    }
    
    modifier onlyDuringVoting() {
        require(votingActive, "Voting is not active");
        _;
    }
    
    modifier hasNotVoted() {
        string memory voterID = addressToID[msg.sender];
        require(!votersByID[voterID].hasVoted, "You have already voted");
        _;
    }

    constructor() {
        votingActive = false;
        // Initialize the three candidates for Rwanda election
        _addCandidate("KAGAME PAUL", "");
        _addCandidate("ANDY ISHIMWE", "");
        _addCandidate("ISHIMWE GHISLAIN", "");
    }
    
    // Register a voter with Rwandan ID (only owner can register voters)
    function registerVoter(
        string memory _rwandanId,
        string memory _fullName,
        string memory _gender,
        address _voterAddress
    ) external onlyOwner {
        require(bytes(_rwandanId).length == 16, "Rwandan ID must be 16 digits");
        require(bytes(_fullName).length > 0, "Full name cannot be empty");
        require(
            keccak256(abi.encodePacked(_gender)) == keccak256(abi.encodePacked("Male")) ||
            keccak256(abi.encodePacked(_gender)) == keccak256(abi.encodePacked("Female")),
            "Gender must be Male or Female"
        );
        require(!votersByID[_rwandanId].isRegistered, "Voter with this ID is already registered");
        require(bytes(addressToID[_voterAddress]).length == 0, "Address already linked to another ID");

        votersByID[_rwandanId] = Voter({
            rwandanId: _rwandanId,
            fullName: _fullName,
            gender: _gender,
            isRegistered: true,
            hasVoted: false,
            votedCandidateId: 0
        });

        addressToID[_voterAddress] = _rwandanId;
        registeredIDs.push(_rwandanId);

        emit VoterRegistered(_rwandanId, _fullName);
    }
    
    // Internal function to add a candidate
    function _addCandidate(string memory _name, string memory _imageUrl) internal {
        candidatesCount++;
        candidates[candidatesCount] = Candidate({
            id: candidatesCount,
            name: _name,
            imageUrl: _imageUrl,
            voteCount: 0,
            exists: true
        });

        emit CandidateAdded(candidatesCount, _name);
    }

    // Update candidate image URL (only owner)
    function updateCandidateImage(uint256 _candidateId, string memory _imageUrl) external onlyOwner {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");
        require(candidates[_candidateId].exists, "Candidate does not exist");

        candidates[_candidateId].imageUrl = _imageUrl;
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

        string memory voterID = addressToID[msg.sender];
        votersByID[voterID].hasVoted = true;
        votersByID[voterID].votedCandidateId = _candidateId;

        candidates[_candidateId].voteCount++;
        totalVotes++;

        emit VoteCast(voterID, _candidateId);
    }
    
    // Get candidate details
    function getCandidate(uint256 _candidateId) external view returns (
        uint256 id,
        string memory name,
        string memory imageUrl,
        uint256 voteCount
    ) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");
        require(candidates[_candidateId].exists, "Candidate does not exist");

        Candidate memory candidate = candidates[_candidateId];
        return (candidate.id, candidate.name, candidate.imageUrl, candidate.voteCount);
    }
    
    // Get all candidates
    function getAllCandidates() external view returns (
        uint256[] memory ids,
        string[] memory names,
        string[] memory imageUrls,
        uint256[] memory voteCounts
    ) {
        ids = new uint256[](candidatesCount);
        names = new string[](candidatesCount);
        imageUrls = new string[](candidatesCount);
        voteCounts = new uint256[](candidatesCount);

        for (uint256 i = 1; i <= candidatesCount; i++) {
            if (candidates[i].exists) {
                ids[i-1] = candidates[i].id;
                names[i-1] = candidates[i].name;
                imageUrls[i-1] = candidates[i].imageUrl;
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
    
    // Check if voter is registered by ID
    function isVoterRegisteredByID(string memory _rwandanId) external view returns (bool) {
        return votersByID[_rwandanId].isRegistered;
    }

    // Check if voter has voted by ID
    function hasVoterVotedByID(string memory _rwandanId) external view returns (bool) {
        return votersByID[_rwandanId].hasVoted;
    }

    // Get voter details by ID
    function getVoterByID(string memory _rwandanId) external view returns (
        string memory rwandanId,
        string memory fullName,
        string memory gender,
        bool isRegistered,
        bool hasVoted,
        uint256 votedCandidateId
    ) {
        Voter memory voter = votersByID[_rwandanId];
        return (
            voter.rwandanId,
            voter.fullName,
            voter.gender,
            voter.isRegistered,
            voter.hasVoted,
            voter.votedCandidateId
        );
    }

    // Get all registered voter IDs
    function getAllRegisteredIDs() external view returns (string[] memory) {
        return registeredIDs;
    }

    // Update voter information (only owner)
    function updateVoter(
        string memory _rwandanId,
        string memory _fullName,
        string memory _gender
    ) external onlyOwner {
        require(votersByID[_rwandanId].isRegistered, "Voter not found");
        require(bytes(_fullName).length > 0, "Full name cannot be empty");
        require(
            keccak256(abi.encodePacked(_gender)) == keccak256(abi.encodePacked("Male")) ||
            keccak256(abi.encodePacked(_gender)) == keccak256(abi.encodePacked("Female")),
            "Gender must be Male or Female"
        );

        votersByID[_rwandanId].fullName = _fullName;
        votersByID[_rwandanId].gender = _gender;
    }

    // Remove voter (only owner)
    function removeVoter(string memory _rwandanId) external onlyOwner {
        require(votersByID[_rwandanId].isRegistered, "Voter not found");

        delete votersByID[_rwandanId];

        // Remove from registeredIDs array
        for (uint256 i = 0; i < registeredIDs.length; i++) {
            if (keccak256(abi.encodePacked(registeredIDs[i])) == keccak256(abi.encodePacked(_rwandanId))) {
                registeredIDs[i] = registeredIDs[registeredIDs.length - 1];
                registeredIDs.pop();
                break;
            }
        }
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
