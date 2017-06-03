let socket = io();

socket.on('updateRoomList', function(rooms) {
    let select = jQuery('#dropdown');
    rooms.forEach( (room) => {
        select.append(jQuery(`<option>${room}</option>`));
    });
});

jQuery('#dropdown').on('change', function() {
    let room = jQuery(this).find('option:selected').val();
    jQuery('input[name=room]').val(room);
});