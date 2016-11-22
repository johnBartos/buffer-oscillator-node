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
  const blob = new Blob(chunks, { 'type' : 'audio/wav' });
  const reader = new FileReader();
  const source = ctx.createBufferSource()
  reader.addEventListener('loadend', () => {
    ctx.decodeAudioData(reader.result).then((buffer) => {
      console.log(buffer)
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
    });
  });
  reader.readAsArrayBuffer(blob);
};


osc.connect(recorderDest);
recorder.start();
osc.start(0);

setTimeout(() => {
  osc.stop();
  recorder.stop();
}, 100);


function download(blob) {
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = 'foo.ogg';
  a.click();
}