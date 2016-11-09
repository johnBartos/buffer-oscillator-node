const ctx = new AudioContext();

const osc = ctx.createOscillator();
osc.frequency = 440;

const envelope = ctx.createGain();
osc.connect(envelope);
// envelope.connect(ctx.destination);

const recorder = ctx.createMediaStreamDestination();
envelope.connect(recorder);
// recorder.connect(ctx.destination);

// const buffer = createBuffer(2, frameCount, audioCtx.sampleRate);
const buffer = ctx.createBuffer(2, 22050, 44100);
buffer.buffer = recorder.stream;

osc.start(0);


setTimeout(() => {
  console.log('stob')
  osc.stop();
  // console.log(recorder.stream);
  recorder.connect(ctx.destination);
}, 2000);
