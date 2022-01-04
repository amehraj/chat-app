const socket = io();

const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $shareLocationButton = document.querySelector('#share-location');

socket.on('message', (message) => {
    console.log(message);
});

$messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    $messageFormButton.setAttribute('disabled','disabled');

    
    const message = event.target.elements.message.value;
    socket.emit('sendMessage', message, (error) => {

        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = "";
        $messageFormInput.focus();

        if(error){
            return console.log('Someting went wrong while delivering the message');
        }
        console.log('Message Delivered!');

    });
});

$shareLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation){
        alert('Your browser does not support geolocation');
    }
    $shareLocationButton.setAttribute('disabled','disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('shareLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $shareLocationButton.removeAttribute('disabled');
            console.log('Location Shared!');
        });
    });
});