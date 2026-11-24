// Unlock audio context on first global interaction
window.addEventListener('click', () => {
  const audio = document.querySelector('#pot');
  if (audio && audio.paused && audio.currentTime === 0) {
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
    }).catch(e => {});
  }
}, { once: true });

// Component supporting both mouse clicks and mobile touches
AFRAME.registerComponent('play-audio-on-tap', {
  schema: { type: 'string' },
  init: function () {
    let el = this.el;
    let audioId = this.data;

    const triggerAudio = (evt) => {
      evt.stopPropagation();
      let audioElement = document.querySelector(audioId);
      if (audioElement) {
        audioElement.currentTime = 0; 
        audioElement.play().then(() => {
          console.log("Audio triggered successfully via 3D model click!");
        }).catch(err => {
          console.error("Playback blocked:", err);
        });
      }
    };

    el.addEventListener('click', triggerAudio);
    el.addEventListener('touchstart', triggerAudio);
  }
});

// Helper component to ensure complex GLTF sub-meshes register raycast hits
AFRAME.registerComponent('make-model-clickable', {
  init: function () {
    let el = this.el;
    el.addEventListener('model-loaded', () => {
      let mesh = el.getObject3D('mesh');
      if (mesh) {
        mesh.traverse((node) => {
          if (node.isMesh) {
            // Bind the raycast target back to the main element
            node.el = el;
          }
        });
      }
    });
  }
});