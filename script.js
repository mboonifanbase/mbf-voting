const eligibleIDs = [

  "36294899", "36923085", "22657612", "AK1183371", "36883654",

  "38822931", "37029280", "31177919", "226214660", "29991328",

  "29540066", "28866786", "27885423", "36916297", "28174656",

  "33122629", "33615979", "36070380", "30352043", "37820683",

  "27494173", "32015961"

];



// Mapping IDs to names

const voterData = {

  "36294899": "RUTH M. KIMEU",

  "36923085": "Elizabeth nduku Nzelu",

  "22657612": "RICHARD MUTINDA KIOKO",

  "AK1183371": "Kisia Nzuki",

  "36883654": "Ken Otiendeh",

  "38822931": "Felix Wambua",

  "37029280": "Muthoka katunge",

  "31177919": "Samuel Mutua Wambua",

  "226214660": "Shadrack mutuku mbithi",

  "29991328": "Stephen Seli",

  "29540066": "Dominic Nzangi",

  "28866786": "FIDELIX KILONZO WAMBUA",

  "27885423": "Jacinta nduku Mutula",

  "36916297": "Michael Pepsi",

  "28174656": "Alexander kalii kiswii",

  "33122629": "Stephen kimanthi",

  "33615979": "Kelvin Nthiwa",

  "36070380": "Sylvia wambua",

  "30352043": "Priscah kanini kimanthi",

  "37820683": "Denis Mwaka",

  "27494173": "Redempta Nzilani Nduku",

  "32015961": "JAMES WAMBUA MUTIE",

};



const adminID = "32015961";

let votes = { viceChairperson: {}, member: {} };

let candidates = { viceChairperson: [], member: [] };

let votingLocked = false;

const votingLogs = [];



// Login Button Click Event

document.getElementById("loginButton").addEventListener("click", async () => {

  const userID = document.getElementById("userID").value;



  // Check if the user has already voted

  const hasVoted = await checkVoteStatus(userID);



  if (userID === adminID) {

    // Admin Login

    document.getElementById("loginModal").style.display = "none";

    document.getElementById("adminContainer").style.display = "block";

    document.getElementById("votingContainer").style.display = "block"; // Admin can vote

    document.getElementById("greetingMessage").innerText = "Welcome, Admin! You can manage the system.";

  } else if (eligibleIDs.includes(userID)) {

    if (hasVoted) {

      document.getElementById("errorMessage").innerText = "You have already voted!";

    } else {

      // Greet the user and guide to voting process

      const userName = voterData[userID] || "Voter";

      document.getElementById("loginModal").style.display = "none";

      document.getElementById("votingContainer").style.display = "block";

      document.getElementById("voterGreeting").innerText = `Hello, ${userName}! Welcome to the voting process.`;

    }

  } else {

    // Invalid ID entered

    document.getElementById("errorMessage").innerText = "Invalid ID/Passport/Military Number!";

  }

});



// Submit Votes Button Click Event

document.getElementById("submitVotes").addEventListener("click", async () => {

  const viceSelection = document.querySelector('input[name="viceChairperson"]:checked');

  const memberSelection = document.querySelector('input[name="member"]:checked');

  const userID = document.getElementById("userID").value;



  if (votingLocked) {

    alert("Voting is currently locked. Please try again later.");

    return;

  }



  if (!viceSelection || !memberSelection) {

    alert("Please select a candidate for both positions!");

    return;

  }



  const success = await submitVote(userID, {

    viceChairperson: viceSelection.value,

    member: memberSelection.value

  });



  if (success) {

    logVote(userID, { viceChairperson: viceSelection.value, member: memberSelection.value });

    displayResults();

  } else {

    alert("Error submitting vote. Please try again.");

  }

});



// Admin Reset Votes Button Click Event

document.getElementById("resetVotes").addEventListener("click", async () => {

  const success = await resetVotesOnServer();

  if (success) {

    votes = { viceChairperson: {}, member: {} };

    localStorage.clear();

    alert("All votes have been reset!");

  } else {

    alert("Error resetting votes. Please try again.");

  }

});



// Admin Add Candidate

document.getElementById("addCandidateButton").addEventListener("click", () => {

  const candidateName = document.getElementById("candidateName").value;

  const position = document.getElementById("positionSelect").value;



  if (!candidates[position].includes(candidateName)) {

    candidates[position].push(candidateName);

    alert(`${candidateName} added as a candidate for ${position}.`);

  } else {

    alert(`${candidateName} is already a candidate for ${position}.`);

  }

});



// Admin Remove Candidate

document.getElementById("removeCandidateButton").addEventListener("click", () => {

  const candidateName = document.getElementById("candidateName").value;

  const position = document.getElementById("positionSelect").value;



  const index = candidates[position].indexOf(candidateName);

  if (index > -1) {

    candidates[position].splice(index, 1);

    alert(`${candidateName} removed from ${position}.`);

  } else {

    alert(`${candidateName} is not a candidate for ${position}.`);

  }

});



// Display Results

function displayResults() {

  const viceResults = document.getElementById("viceResults");

  const memberResults = document.getElementById("memberResults");



  viceResults.innerHTML = "<h3>Vice Chairperson</h3>";

  memberResults.innerHTML = "<h3>Member</h3>";



  Object.keys(votes.viceChairperson).forEach(candidate => {

    const count = votes.viceChairperson[candidate];

    viceResults.innerHTML += `<p>${candidate}: ${count} votes</p>`;

  });



  Object.keys(votes.member).forEach(candidate => {

    const count = votes.member[candidate];

    memberResults.innerHTML += `<p>${candidate}: ${count} votes</p>`;

  });



  document.getElementById("message").innerText = "Thank you for voting!";

}



// Simulated Server Functions

async function checkVoteStatus(userID) {

  return localStorage.getItem(`voted-${userID}`) !== null; // Placeholder logic

}



async function submitVote(userID, voteData) {

  if (!localStorage.getItem(`voted-${userID}`)) {

    votes.viceChairperson[voteData.viceChairperson] =

      (votes.viceChairperson[voteData.viceChairperson] || 0) + 1;

    votes.member[voteData.member] =

      (votes.member[voteData.member] || 0) + 1;

    localStorage.setItem(`voted-${userID}`, true);

    return true;

  }

  return false;

}



async function resetVotesOnServer() {

  return true; // Simulated server reset

}



function logVote(userID, voteData) {

  votingLogs.push({ userID, voteData, timestamp: new Date().toISOString() });

}



// Display current year in the footer

document.getElementById("currentYear").textContent = new Date().getFullYear();