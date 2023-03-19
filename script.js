let Myaudio = document.getElementById("audioFile");
let play = document.getElementById('play')
let prev =  document.getElementById('prev')
let next =  document.getElementById('next')



let allsongs = [
  'one.mp3','two.mp3','three.mp3'
]


let count = 0
 


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x100C0C)

// Create a new perspective camera
const camera = new THREE.PerspectiveCamera(
  75, // field of view
  window.innerWidth / window.innerHeight, // aspect ratio
  0.1, // near clipping plane
  1000 // far clipping plane
);

// Set camera position
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const dodeGeometry = new THREE.DodecahedronGeometry(0.5,5);

// Create a material
const material1 = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe:true});

// Create a cube mesh
const dode = new THREE.Mesh(dodeGeometry, material1);

const cubegeometry = new THREE.BoxGeometry(20,10,20);
const material2 = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe:true });
const cube =   new THREE.Mesh(cubegeometry,material2);
scene.add(cube)


scene.add(dode);
 

 

var sphereGeometry = new THREE.SphereGeometry(1, 20, 20);

var sphereMesh = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({color: 0xff0000,wireframe:true}));
scene.add(sphereMesh);
 




let audioContext = null;
let sourceNode = null;
let analyser = null;
let bufferLength = null;
let dataArray = null;

 

function initAudioContext() {
  if (audioContext === null) {
    audioContext = new AudioContext();
    audioContext.resume();

    // Create the source node and analyser
    sourceNode = audioContext.createMediaElementSource(Myaudio);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    sourceNode.connect(analyser);
    analyser.connect(audioContext.destination);

    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
  }
}

function plays() {
  function render() {
    if (Myaudio.paused) {
      analyser.disconnect();
      sourceNode.disconnect();
      return;
    };

    requestAnimationFrame(render);
     

    
    


    analyser.getByteFrequencyData(dataArray);



    const frequencies =  dataArray[100] / 32;
    const frequencies1 =  dataArray[100] / 130;
    const frequencies2 =  dataArray[100] / 80;
     



    dode.scale.set(frequencies, frequencies);

    sphereMesh.scale.set(frequencies1, frequencies1);
    cube.scale.set(frequencies2, frequencies2, frequencies2)

    renderer.render(scene, camera);

    

  }

  // Connect the source node to the analyser and destination
  sourceNode.connect(analyser);
  analyser.connect(audioContext.destination);

  render();
}

 





function loadSong(count){
     Myaudio.src = allsongs[count]
    //  Myaudio.play()
     initAudioContext(); // start the audio context when the user clicks the button
     if (Myaudio.paused) {
       Myaudio.play();
       plays();
    play.classList.replace('fa-play', 'fa-pause')

     } else {
       Myaudio.pause();

     }
}


play.addEventListener("click", () => {
  if(Myaudio.paused){
    Myaudio.play()
    // play.classList.replace('fa-play', 'fa-pause')
  loadSong(count)

  }
  else{
    Myaudio.pause()
    play.classList.replace('fa-pause', 'fa-play')
    
  }
 
})



prev.addEventListener('click',()=>{
  initAudioContext()
  plays()
    if(count == 0){
      count = allsongs.length
    }
    count--
    loadSong(count)
    console.log('click')
})

next.addEventListener('click',()=>{
  initAudioContext()
  plays()
    count++;
    if(count == allsongs.length){
      count = 0
    }
    loadSong(count)
})


window.addEventListener('resize', () => {
  // update display width and height
 let width = window.innerWidth
 let height = window.innerHeight
  // update camera aspect
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  // update renderer
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.render(scene, camera)
})


renderer.render(scene, camera);

 