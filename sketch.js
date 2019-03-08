

let nets = {};
let modelNames = ['la_muse', 'rain_princess', 'udnie', 'wreck', 'scream', 'wave', 'mathura', 'fuchun', 'zhangdaqian'];
let inputImg, styleImg;
let outputImgData;
let outputImg;
let modelNum = 0;
let currentModel = 'wave';
let uploader;
let webcam = false;
let modelReady = false;
let video;
let start = false;
let isLoading = true;
let isSafa = false;

function setup() {
  

  noCanvas();
  inputImg = select('#input-img').elt;
  styleImg = select('#style-img').elt;

  modelNames.forEach(n => {
    nets[n] = new ml5.TransformNet('models/' + n + '/', modelLoaded);
  });

  uploader = select('#uploader').elt;
  uploader.addEventListener('change', gotNewInputImg);


  outputImgContainer = createImg('images/loading.gif', 'image');
  outputImgContainer.parent('output-img-container');

  
}


function modelLoaded() {
  modelNum++;
  if (modelNum >= modelNames.length) {
    modelReady = true;
    predictImg(currentModel);
  }
}

function predictImg(modelName) {
  isLoading = true;
  if (!modelReady) return;
  if (webcam && video) {
    outputImgData = nets[modelName].predict(video.elt);
  } else if (inputImg) {
    outputImgData = nets[modelName].predict(inputImg);
  }
  outputImg = ml5.array3DToImage(outputImgData);
  outputImgContainer.elt.src = outputImg.src;
  isLoading = false;
}

function draw() {
  if (modelReady && webcam && video && video.elt && start) {
    predictImg(currentModel);
  }
}

function updateStyleImg(ele) {
  if (ele.src) {
    styleImg.src = ele.src;
    currentModel = ele.id;
  }
  if (currentModel) {
    predictImg(currentModel);
  }
}

function updateInputImg(ele) {
  deactiveWebcam();
  if (ele.src) inputImg.src = ele.src;
  predictImg(currentModel);
}

function uploadImg() {
  uploader.click();
  deactiveWebcam();
}

function gotNewInputImg() {
  if (uploader.files && uploader.files[0]) {
    let newImgUrl = window.URL.createObjectURL(uploader.files[0]);
    inputImg.src = newImgUrl;
    inputImg.style.width = '250px';
    inputImg.style.height = '250px';
  }
}

function useWebcam() {
  if (!video) {
    
    video = createCapture(VIDEO);
    video.size(250, 250);
    video.parent('input-source');
  }
  webcam = true;
  select('#input-img').hide();
  outputImgContainer.addClass('reverse-img');
}

function deactiveWebcam() {
  start = false;
  select('#input-img').show();
  outputImgContainer.removeClass('reverse-img');
  webcam = false;
  if (video) {
    video.hide();
    video = '';
  }
}

function onPredictClick() {
  if (webcam) start = true;
  predictImg(currentModel);
}

