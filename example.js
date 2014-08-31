var audioContext = new AudioContext()
var AudioVoltage = require('./')

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

// output channel
var output = audioContext.createGain()
output.gain.value = 0.2
output.connect(audioContext.destination)

// create an instance
var oscillator = createOscillatorWithMidiNote(audioContext)
oscillator.type = 'sawtooth'
oscillator.connect(output)
oscillator.start()

// automate the midi note with a slider
var slider = document.createElement('input')
var label = document.createElement('span')
slider.style.width = '600px'
slider.type = 'range'
slider.min = 20; slider.max = 100
slider.value = oscillator.midiNote.value
label.textContent = oscillator.midiNote.value
slider.oninput = function(e){
  oscillator.midiNote.value = parseFloat(this.value)
  label.textContent = this.value
}
document.body.appendChild(slider)
document.body.appendChild(label)