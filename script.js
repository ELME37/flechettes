if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").then(() => {
        console.log("Service Worker enregistré !");
    }).catch((error) => {
        console.log("Service Worker erreur :", error);
    });
}

document.getElementById('generatePlayers').addEventListener('click', generatePlayerInputs);
document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('submitScores').addEventListener('click', submitScores);
document.getElementById('resetScores').addEventListener('click', resetScores);
document.getElementById('newGame').addEventListener('click', newGame);

let players = [];
let currentPlayerIndex = 0;
let startScore = 301;

function generatePlayerInputs() {
    let numPlayers = parseInt(document.getElementById('numPlayers').value);
    let playerNamesDiv = document.getElementById('playerNames');
    playerNamesDiv.innerHTML = '';

    for (let i = 1; i <= numPlayers; i++) {
        playerNamesDiv.innerHTML += `<label>Nom du Joueur ${i} :</label>
                                     <input type="text" id="player${i}" required><br>`;
    }
    
    document.getElementById('startGame').style.display = 'inline-block';
}

function startGame() {
    let numPlayers = parseInt(document.getElementById('numPlayers').value);
    startScore = parseInt(document.getElementById('startScore').value);

    players = [];
    for (let i = 1; i <= numPlayers; i++) {
        let playerName = document.getElementById(`player${i}`).value.trim();
        if (playerName === '') playerName = `Joueur ${i}`;
        players.push({ name: playerName, score: startScore });
    }

    document.getElementById('setup').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    document.getElementById('winnerMessage').innerHTML = '';
    
    currentPlayerIndex = 0;
    updateScoreBoard();
    updateCurrentPlayer();
    resetDartInputs();
}

function updateScoreBoard() {
    let scoreBoardHTML = '<h3>Scores actuels :</h3><ul>';
    players.forEach(player => {
        scoreBoardHTML += `<li>${player.name} : ${player.score}</li>`;
    });
    scoreBoardHTML += '</ul>';
    document.getElementById('scoreBoard').innerHTML = scoreBoardHTML;
}

function updateCurrentPlayer() {
    document.getElementById('currentPlayer').innerText = `Au tour de ${players[currentPlayerIndex].name}`;
}

function submitScores() {
    let dart1 = parseInt(document.getElementById('dart1').value) || 0;
    let dart2 = parseInt(document.getElementById('dart2').value) || 0;
    let dart3 = parseInt(document.getElementById('dart3').value) || 0;

    // Vérification : aucune fléchette ne doit dépasser 60 points
    if (dart1 > 60 || dart2 > 60 || dart3 > 60) {
        alert("Erreur : une fléchette ne peut pas dépasser 60 points !");
        return;
    }

    // Vérification : aucune fléchette ne doit être négative
    if (dart1 < 0 || dart2 < 0 || dart3 < 0) {
        alert("Erreur : une fléchette ne peut être inférieur à 0 !");
        return;
    }

    let roundScore = dart1 + dart2 + dart3;
    let newScore = players[currentPlayerIndex].score - roundScore;

    if (newScore < 0) {
        alert("Dépassement ! Score non validé.");
    } else {
        players[currentPlayerIndex].score = newScore;

        if (newScore === 0) {
            document.getElementById('gameArea').style.display = 'none'; // Cache tout sauf winnerMessage
            document.getElementById('winnerMessage').innerHTML = `
                <p>${players[currentPlayerIndex].name} a gagné ! 🎯</p>
                <button onclick="resetScores()">Réinitialiser les scores</button>
                <button onclick="newGame()">Nouvelle partie</button>
            `;
            return;
        }
    }

    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updateScoreBoard();
    updateCurrentPlayer();
    resetDartInputs();
}

function resetScores() {
    players.forEach(player => {
        player.score = startScore;
    });

    currentPlayerIndex = 0;
    document.getElementById('winnerMessage').innerHTML = ''; // Supprime le message du gagnant
    document.getElementById('gameArea').style.display = 'block'; // Réaffiche le jeu
    updateScoreBoard();
    updateCurrentPlayer();
    resetDartInputs();
}

function newGame() {
    document.getElementById('setup').style.display = 'block';
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('winnerMessage').innerHTML = '';
    document.getElementById('playerNames').innerHTML = '';
    document.getElementById('startGame').style.display = 'none';
    resetDartInputs();
}

function resetDartInputs() {
    document.getElementById('dart1').value = '';
    document.getElementById('dart2').value = '';
    document.getElementById('dart3').value = '';
}
