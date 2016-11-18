const ctx = new AudioContext();

const osc = ctx.createOscillator();
osc.frequency = 440;

const envelope = ctx.createGain();
osc.connect(envelope);
envelope.connect(ctx.destination);

const recorderDest = ctx.createMediaStreamDestination();
const recorder = new MediaRecorder(recorderDest.stream);
const chunks = [];
recorder.ondataavailable = (e) => {
  chunks.push(e.data);
};
recorder.onstop = (e) => {
  const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
  const reader = new FileReader();
  reader.addEventListener('loadend', () => {
    const buffer = new Uint8Array(reader.result);
    const floatArray = new Float32Array(buffer);
    console.log(floatArray);
  });
  reader.readAsArrayBuffer(blob);
  // const href = URL.createObjectURL(blob);
  // const a = document.createElement('a');
  // a.href = href;
  // a.download = 'foo.ogg';
  // a.click();

};


osc.connect(recorderDest);
// recorder.connect(ctx.destination);

// const buffer = createBuffer(2, frameCount, audioCtx.sampleRate);
const buffer = ctx.createBuffer(2, 22050, 44100);
buffer.buffer = recorder.stream;

recorder.start();
osc.start(0);

setTimeout(() => {
  osc.stop();
  recorder.stop();
}, 100);
