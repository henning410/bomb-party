$(document).ready(function () {
    // Update rounds value on slider change
    $('#roundSlider').on('input', function () {
        console.log("VALUE")
        $('#sliderValue').text($(this).val());
    });
});

function incrementNumber() {
    var roundInput = $('#roundNumber');
    var currentValue = parseInt(roundInput.val());
    if (currentValue < 20) {
        roundInput.val(currentValue + 1);
    }
}

function decrementNumber() {
    var roundInput = $('#roundNumber');
    var currentValue = parseInt(roundInput.val());
    if (currentValue > 4) {
        roundInput.val(currentValue - 1);
    }
}

function startGame() {
    if ($('#voiceRecognitionCheckbox').is(":checked")){
        localStorage.setItem('voiceRecognition', true);
    } else {
        localStorage.setItem('voiceRecognition', false);
    }
    localStorage.setItem('numberOfRounds', $('#roundNumber').val());
    window.location = './game.html'
}
