// script.js
const img = new Image(); // used to load image from <input> and draw to canvas
//============================
//Select Elements for Event Listening
//============================
const getMeme = document.getElementById("generate-meme");
const genButton = document.getElementsByTagName("button")[0];
const clrButton = document.getElementsByTagName("button")[1];
const readButton = document.getElementsByTagName("button")[2];
const loadImage = document.getElementById("image-input");
const voiceVolume = document.getElementsByTagName("input")[3];
const canvas = document.getElementById('user-image');
const ctx = canvas.getContext('2d');

//============
// State Variables
// ===========
let lang;
let vol = 1;
let getVoices = [];

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
    ctx.clearRect(0, 0, 400, 400); // given canvas Size
    const topText = document.getElementById('text-top');
    const bottomText = document.getElementById('text-bottom');
    // Iniitlaize empty test values 
    topText.value = "";
    bottomText.value = "";
    //Change button current state
    clrButton.disabled = true;
    readButton.disabled = true;
    genButton.disabled = false;

    // blackout the canvas and set the image. 
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 400, 400);
    const imageDimension = getDimmensions(400, 400, img.width, img.height);
    ctx.drawImage(img, imageDimension.startX, imageDimension.startY, imageDimension.width, imageDimension.height);
});

//Load Image EventListener
loadImage.addEventListener('change', () => {
    const path = URL.createObjectURL(loadImage.files[0]);
    const splice = path.split("\\");
    img.src = path;
    img.alt = splice[splice.length - 1];
});


// MemeText Event Listener
getMeme.addEventListener('submit', (event) => {
    //if the event does not get explicitly handled, its default action should not be taken as it normally would be.
    event.preventDefault();
    const topText = document.getElementById('text-top');
    const bottomText = document.getElementById('text-bottom');
    //Font style for meme
    ctx.font = "30px impact";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.textAllign = "center";
    ctx.fillText(bottomText.value, 100, 385);
    ctx.fillText(topText.value, 100, 35);
    ctx.strokeText(bottomText.value, 100, 385);
    ctx.strokeText(topText.value, 100, 35);

    // now enable them
    clrButton.disabled = false;
    readButton.disabled = false;

})

//Clear the Canvas now using clear button Event Listener
clrButton.addEventListener('click', () => {
    const topText = document.getElementById('text-top');
    topText.value = "";
    const bottomText = document.getElementById('text-bottom');
    bottomText.value = "";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
})

//====================
// Speech API Speech Synthesis Helper Functions
//====================
speechSynthesis.addEventListener('voiceschanged', () => {
    getVoices = speechSynthesis.getVoices();
    const voiceSelection = document.getElementById("voice-selection");
    voiceSelection.innerHTML = "";
    let i = 0;
    while (i < getVoices.length) {
        let optionSelect = document.createElement('option');
        optionSelect.textContent = getVoices[i].name + '(' + getVoices[i].lang + ')';
        // for first option in the list
        if (getVoices[i].default)
            optionSelect.textContent += ' [default]';

        // set the langauge and name and append to DOM Tree
        optionSelect.setAttribute('lang-voice', getVoices[i].lang);
        optionSelect.setAttribute('lang-name', getVoices[i].name);
        voiceSelection.appendChild(optionSelect);
        i += 1;
    }
    // Set a default value for langauge 
    voiceSelection.disabled = false;
    //Change from default langauge:
    voiceSelection.addEventListener("change", () => {
        let selectedLanguage = voiceSelection.selectedOptions[0].getAttribute('lang-name');
        let i = 0;
        while (i < getVoices.length) {
            if ( selectedLanguage === getVoices[i].lang)
                lang = getvoices[i].lang;
            i += 1;
        }
    });

}); // END SpeechSynthesis

// text to speech Event Listener
readButton.addEventListener('click', () => {
    const topText = document.getElementById('text-top');
    const bottomText = document.getElementById('text-bottom');
    const tts = new SpeechSynthesisUtterance(topText.value + "..." + bottomText.value);
    tts.voice = lang;
    tts.volume = vol;
    speechSynthesis.speak(tts);
});

//Change volume event listener
voiceVolume.addEventListener("input", () => {
    vol = (voiceVolume.value / 100);
    let soundIcon = document.getElementsByTagName('img')[0]; // no volume
    if (voiceVolume.value == 0) {
        soundIcon.src = "icons/volume-level-0.svg";
        soundIcon.alt = "Volume Level 0: 0";
    } else if (voiceVolume.value >= 1 && voiceVolume.value <= 33) { // low volume
        soundIcon.src = "icons/volume-level-1.svg";
        soundIcon.alt = "Volume Level 1: 1-33";
    } else if (voiceVolume.value >= 34 && voiceVolume.value <= 66) { // medium volume
        soundIcon.src = "icons/volume-level-2.svg";
        soundIcon.alt = "Volume Level 2: 34-66";
    } else if (voiceVolume.value >= 67 && voiceVolume.value <= 100) { // high volume 
        soundIcon.src = "icons/volume-level-3.svg";
        soundIcon.alt = "Volume Level 3: 67-100";
    }
});

//======
//GIVEN BELOW
//======
/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
    let aspectRatio, height, width, startX, startY;

    // Get the aspect ratio, used so the picture always fits inside the canvas
    aspectRatio = imageWidth / imageHeight;

    // If the apsect ratio is less than 1 it's a verical image
    if (aspectRatio < 1) {
        // Height is the max possible given the canvas
        height = canvasHeight;
        // Width is then proportional given the height and aspect ratio
        width = canvasHeight * aspectRatio;
        // Start the Y at the top since it's max height, but center the width
        startY = 0;
        startX = (canvasWidth - width) / 2;
        // This is for horizontal images now
    } else {
        // Width is the maximum width possible given the canvas
        width = canvasWidth;
        // Height is then proportional given the width and aspect ratio
        height = canvasWidth / aspectRatio;
        // Start the X at the very left since it's max width, but center the height
        startX = 0;
        startY = (canvasHeight - height) / 2;
    }

    return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}