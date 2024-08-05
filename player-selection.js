$(document).ready(function () {
    let storedPlayers = JSON.parse(localStorage.getItem("playerNames"));

    if (storedPlayers && storedPlayers.length > 0) {
        console.log("Player names are available:", storedPlayers);
        $('#firstField').val(storedPlayers[0]);

        for (var playerName of storedPlayers.slice(1)) {
            var newInput = `
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Spielername eingeben" value="${playerName}">
                <div class="input-group-append">
                    <button onclick="removePlayer(this)" class="btn btn-danger remove-input" type="button"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        `;
            $('#input-container').append(newInput);
        }
    }
});

function appendPlayer() {
    console.log('Append player')
    var newInput = `
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Spielername eingeben">
                <div class="input-group-append">
                    <button onclick="removePlayer(this)" class="btn btn-danger remove-input" type="button"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        `;
    $('#input-container').append(newInput);
}

function savePlayers() {
    var playerNames = [];
    var isEmpty = false;
    $('#alert-container').empty(); // Clear previous alerts

    $('.form-control').each(function () {
        var value = $(this).val();
        if (value.trim() === "") {
            isEmpty = true;
            return false; // Exit the loop
        }
        playerNames.push(value);
    });

    if (isEmpty) {
        console.log("EMPTY")
        var alert = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert" id="tempAlert">
                        <strong>Fehler!</strong> Jeder Spieler muss einen Namen haben.
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                `;
        $('#alert-container').append(alert);
        setTimeout(function() {
            $('#tempAlert').alert('close');
        }, 5000);
    } else {
        const categories = [
            "Werkzeuge",
            "Olympische Sportart",
            "Wörter die mit 'sch' anfangen",
            "Findet man im Kühlschrank",
            "Schulfächer",
            "Haustiere",
            "Sportmarken",
            "Sportausrüstung",
            "Sehenswürdigkeiten",
            "Filmtitel",
            "Fortbewegungsmittel",
            "Schauspieler",
            "Wörter die mit 'e' enden",
            "Getränke",
            "Tiere im Meer",
            "Brettspiele",
            "Computer- oder Handyspiele",
            "Technische Geräte",
            "Alkoholisches Getränk",
            "Möbel",
            "Küchengeräte",
            "Verben, die mit 'p' anfangen",
            "Flüsse"
        ];
        localStorage.setItem('categories', JSON.stringify(categories));
        localStorage.setItem('playerNames', JSON.stringify(playerNames));
        window.location = "./settings.html"
    }
}

function removePlayer(button) {
    console.log("Remove player", $(button).closest('.input-group'))
    $(button).closest('.input-group').remove();
}
