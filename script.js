function appendPlayer() {
    console.log('Append player')
        var newInput = `
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Enter name">
                <div class="input-group-append">
                    <button onclick="removePlayer(this)" class="btn btn-danger remove-input" type="button"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        `;
        $('#input-container').append(newInput);
}

function removePlayer(button) {
    console.log("Remove player", $(button).closest('.input-group'))
    $(button).closest('.input-group').remove();
}