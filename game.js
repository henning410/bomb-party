
let categories = JSON.parse(localStorage.getItem("categories"));
const storedPlayers = JSON.parse(localStorage.getItem("playerNames"));
const numberOfRounds = localStorage.getItem("numberOfRounds");
let currentRound = 0;
let currentPlayer = 0;
let recognition;
let wordCount = {};

$(document).ready(function () {
    

    if (categories.length == 0) {
        $("#player-text").text("Hinweis: Du hast alle Kategorien durch");
    }

    // configure sound
    const primaryAudio = document.getElementById('primarySound');
    const secondaryAudio = document.getElementById('secondarySound');
    const minDuration = 6; // 1 minute
    const maxDuration = 12; // 2 minutes

    const startButton = document.getElementById('startButton');

    initializeClickCount();

    // Select random player
    currentPlayer = Math.floor(Math.random() * storedPlayers.length)
    showPlayer();


    // Check if the browser supports the Web Speech API
    if (localStorage.getItem('voiceRecognition') === "true") {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Your browser does not support Speech Recognition API');
        } else {
            console.log("Voice Recognition is supported")
            recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = false;
            recognition.lang = 'de-DE';

            recognition.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
                const words = transcript.split(' ');

                words.forEach(word => {
                    console.log(`Recognized word: ${word}`);
                    if (wordCount[word]) {
                        wordCount[word]++;
                    } else {
                        wordCount[word] = 1;
                    }

                    if (wordCount[word] === 2) {
                        console.log("Zweimal das Gleiche");
                        var alert = `
                        <div class="alert alert-danger alert-dismissible fade show" role="alert" id="tempAlert">
                            <strong>Fehler!</strong> Jeder Spieler muss einen Namen haben.
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    `;
                        $('#game-text').append(alert);
                        setTimeout(function () {
                            $('#tempAlert').alert('close');
                        }, 5000);
                    }
                });
                console.log(wordCount);  // For debugging purposes
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
            };

            recognition.onend = () => {
                console.log('Speech recognition service disconnected');
            };
        }
    }



    function showPlayer() {
        startPlayer = storedPlayers[currentPlayer];
        console.log("Startspieler: ", startPlayer)
        $("#player-text").text(startPlayer + " fängt an");
    }

    // Function to play the primary sound repeatedly
    function playPrimarySound() {
        primaryAudio.loop = true;
        primaryAudio.play().catch(error => {
            console.error('Playback failed:', error);
        });
    }


    // Function to play the secondary sound
    function playSecondarySound() {
        $("#game-text").text("");
        secondaryAudio.play().catch(error => {
            console.error('Playback failed:', error);
        });
        selectLooser();
        recognition.stop();
    }


    // Function to stop the primary sound and play the secondary sound
    function stopPrimaryAndPlaySecondary() {
        primaryAudio.pause();
        primaryAudio.currentTime = 0; // Reset to the start
        playSecondarySound();
    }


    // Function to get a random number between min and max
    function getRandomDuration(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    startButton.addEventListener('click', () => {
        if (recognition) {
            recognition.stop();  // Stop any ongoing recognition
        }
        wordCount = {};
        console.log('Reset Wordcount: ', wordCount);
        recognition.start();
        currentRound += 1;
        // Select category
        // Select a random index
        let randomIndex = Math.floor(Math.random() * categories.length);
        // Get the element at the random index
        let category = categories[randomIndex];
        // Remove the element from the array
        categories.splice(randomIndex, 1);
        localStorage.setItem('categories', JSON.stringify(categories));
        $("#player-text").text(category);

        $("#startButton").hide();
        $("#game-text").show();
        $("#game-text").text("Tick Tack ...");

        playPrimarySound();

        // Set a timeout to stop the sound and do something after a random duration
        const randomDuration = getRandomDuration(minDuration, maxDuration) * 1000; // Convert to milliseconds
        setTimeout(stopPrimaryAndPlaySecondary, randomDuration);
    });


    function selectLooser() {
        const looserText = `
            <h3>
                Wer hat verloren?
            </h3>
        `;
        $('#game-text').append(looserText);

        for (let i = 0; i < storedPlayers.length; i++) {
            const playerName = storedPlayers[i];
            const listItem = `
            <li class="list-group-item" id="looser${i}" data-player="${playerName}">
                ${playerName}
            </li>
        `;
            $('#game-text').append(listItem);
        }
    }


    function initializeClickCount() {
        let clickCounts = {};

        // Set initial click counts for each player
        storedPlayers.forEach(player => {
            clickCounts[player] = 0;
        });

        // Store the initialized click counts in local storage
        localStorage.setItem('clickCounts', JSON.stringify(clickCounts));
    }


    function updateClickCount(playerName) {
        let clickCounts = JSON.parse(localStorage.getItem('clickCounts')) || {};

        if (!clickCounts[playerName]) {
            clickCounts[playerName] = 0;
        }
        clickCounts[playerName] += 1;

        localStorage.setItem('clickCounts', JSON.stringify(clickCounts));
        $("#game-text").hide();
        $("#startButton").show();

        if (currentPlayer <= storedPlayers.length) {
            currentPlayer = 0;
        } else {
            currentPlayer += 1;
        }

        if (currentRound == numberOfRounds) {
            $("#startButton").hide();
            $("#player-text").hide();
            $("#game-text").hide();
            showResults();
        } else {
            showPlayer();
        }
    }


    $('#game-text').on('click', 'li', function () {
        const playerName = $(this).data('player');

        // Update click count in local storage
        updateClickCount(playerName);

        // Perform any other actions needed on click
        console.log(`Player ${playerName} was clicked.`);
    });


    function showResults() {
        console.log("ERGEBNIS: ", JSON.parse(localStorage.getItem('clickCounts')))

        const clickCounts = JSON.parse(localStorage.getItem('clickCounts')) || {};
        // Convert object to array and sort by click count (ascending order)
        const sortedPlayers = Object.entries(clickCounts).sort((a, b) => a[1] - b[1]);

        $('#game-text').text("Ergebnisse");
        $('#game-text').show();

        // Iterate over the sorted array to create list items with icons
        sortedPlayers.forEach(([playerName, clickCount], index) => {
            // Determine icon class based on ranking
            let iconClass = '';
            switch (index) {
                case 0:
                    iconClass = 'fa-trophy gold';
                    break;
                case 1:
                    iconClass = 'fa-trophy silver';
                    break;
                case 2:
                    iconClass = 'fa-trophy bronze';
                    break;
                default:
                    iconClass = ''; // No icon for players beyond third place
            }

            const listItem = `
                <li class="list-group-item" id="looser${index}">
                    <i class="fas ${iconClass} icon"></i>
                    ${playerName}: ${clickCount}
                </li>
            `;
            $('#game-text').append(listItem);
        });
        $('#restartButton').show();
    }
});
