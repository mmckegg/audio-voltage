audio-voltage
===

Automatable DC voltage for modulation of Web Audio API AudioParams.

## Install via [npm](https://npmjs.org/package/audio-voltage)

```bash
$ npm install audio-voltage
```

## Example

```js
var audioContext = new AudioContext()
var AudioVoltage = require('audio-voltage')

function createOscillatorWithMidiNote(audioContext){
  var oscillator = audioContext.createOscillator()

  // use input
  var midiVoltage = AudioVoltage(audioContext)
  midiVoltage.gain.value = 69 // set base note (440hz middle A)

  // normalize to 0
  var offset = AudioVoltage(audioContext)
  offset.gain.value = -69
  midiVoltage.connect(offset.gain)

  // multiply by 100 and connect to oscillator detune
  var centMultiplier = audioContext.createGain()
  centMultiplier.gain.value = 100
  offset.connect(centMultiplier)
  centMultiplier.connect(oscillator.detune)

  // export param
  oscillator.midiNote = midiVoltage.gain

  return oscillator
}

// create an instance
var oscillator = createOscillatorWithMidiNote(audioContext)
oscillator.connect(audioContext.destination)
oscillator.start()

// automate the midi note with a slider
var slider = document.createElement('input')
slider.type = 'range'
slider.min = 0; slider.max = 127
slider.value = oscillator.midiNote.value
slider.oninput = function(e){
  oscillator.midiNote.value = parseFloat(this.value)
}
document.body.appendChild(slider)
```

To run the example clone the repo and `npm install && npm run example` then navigate to [http://localhost:9966/](http://localhost:9966/).