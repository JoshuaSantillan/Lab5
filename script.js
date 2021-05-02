// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
//============================
//Select Elements
//============================
let getMeme = document.getElementById("generate-meme");
let genButton = document.getElementsByTagName("button")[0];
let clrButton = document.getElementsByTagName("button")[1];
let readButton = document.getElementsByTagName("button")[2];
let loadImage = document.getElementById("image-input");
let voiceVolume = document.getElementById("input")[3];
let canvas = document.getElementById('user-image');
let ctx = canvas.getContext('2d');

//============
// State Variables
// ===========
let lang;
let vol = 1.0;
let getVoices = [];

//====================
// Speech API Speech Synthesis Helper Functions
//====================
speechSynthesis.addEventListener("voiceschanged", () => {
    getVoices = speechSynthesis.getVoices();
    let voiceSelection = document.getElementById("voice-selection");
    voiceSelection.innerHTML="";
    let i = 0;
    while(i < getVoices.length){
      let optionSelect = document.createElement('option');
      optionSelect.textContent = getVoices[i].name + ' (' +  getVoices[i].lang + ')';
      // for default case
      if(getVoices[i].default)
        optionSelect.textContent += ' -- DEFAULT';

      // set the langauge and name and append to DOM Tree
      optionSelect.setAttribute('data-lang', getVoices[i].lang);
      optionSelect.setAttribute('data-name', getVoices[i].name);
      voiceSelection.appendChild(optionSelect);
      i += 1;
    }

    // Set a default value for langauge 
    voiceSelection.disabled = false;
    lang = getVoices[0]; 
    //Change from default langauge:
    voiceSelection.addEventListener("change", () =>{
      let selectLangauge = getVoices.selectedOptions[0].getAttribute('data-name');
      let i = 0;
      while(i < getVoices.length){
        if(selectLangauge === getVoices[i].name)
            lang = getVoices[i]
        i++;
      }
    });
    
}); // END SpeechSynthesis

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  ctx.clearRect(0,0,400,400); // given size
  let topText = document.getElementById('text-top');
  let bottomText = document.getElementById('text-bottom');
  // set texts to empty
  topText.value="";
  bottomText.value="";
   //Change button state
  clrButton.disabled = true;
  readButton.disabled = true;
  genButton.disabled = false;
  
  // Cover cnavas with black then set the img. 
  ctx.fillStyle="black";
  ctx.fillRect(0,0,400,400);

  let imageDimension = getDimmensions(400,400,img.width,img.height);
  ctx.drawImage(img,imageDimension.startX,imageDimension.startY,imageDimension.width, imageDimension.height);

});

//Load Image EventListener
loadImage.addEventListener('change', ()=> {
  let path = URL.createObjectURL(loadImage.files[0]);
  let splice = path.split("\\");
  img.src = path;
  img.alt = splice[splice.length-1];  
});

// MemeText Event Listener
getMeme.addEventListener('submit', (event) =>{
  //if the event does not get explicitly handled, its default action should not be taken as it normally would be.
  event.preventDefault();
  let topText = document.getElementById('text-top');
  let bottomText = document.getElementById('text-bottom');

  //Font style for meme
  ctx.font = "30px impact";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.textAllign = "center";
  ctx.fillText(bottomText.value,200,385);
  ctx.fillText(topText.value,200,35);
  ctx.strokeText(bottomText.value,200,385);
  ctx.strokeText(topText.value,200,35);

  // now enable them
 clrButton.disabled = false; 
 readButton.disabled = false;

})

//Clear the Canvas now using clear button Event Listener
clrButton.addEventListener('click',()=>{
  let topText = document.getElementById('text-top');
  topText.value="";
  let bottomText = document.getElementById('text-bottom');
  bottomText.value="";
  ctx.clearRect(0,0,canvas.width,canvas.height);  
})

/*
// text to speech Event Listener
readButton.addEventListener('click', () => {
  let topText = documents.getElementById('text-top');
  let bottomText = document.getElementById('text-top');
  let tts  = new SpeechSynthesisUtterance(topText.value + " , " + bottomText.value);
  tts.voice = lang;
  tts.volume = lang;
});
*/
/*
//Change volume event listener
voiceVolume.addEventListener("input", () => {
  let voiceImage = document.getElementsByTagName('img')[0]; // no volume
  if(voiceVolume.value == 0){
    voiceImage.src="icons/volume-level-0.svg";
    voiceImage.alt="Volume Level 0: 0";
  }else if(voiceVolume.value>=1 && voiceVolume.value<=33){ // low volume
    voiceImage.src="icons/volume-level-1.svg";
    voiceImage.alt="Volume Level 1: 1-33";
  }else if(voiceVolume.value>=34 && voiceVolume.value<=66){ // medium volume
    voiceImage.src="icons/volume-level-2.svg";
    voiceImage.alt="Volume Level 2: 34-66";
  }else if(voiceVolume.value>=67 && voiceVolume.value<=100){ // high volume 
    voiceImage.src="icons/volume-level-3.svg";
    voiceImage.alt="Volume Level 3: 67-100";
  }
});
*/
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
