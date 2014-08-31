// reuse base voltage for all instances
var voltage = null

module.exports = AudioVoltage

function AudioVoltage(context){
  if (!voltage){
    voltage = getVoltage(context, 1)
  }

  var node = context.createGain()
  voltage.connect(node)
  return node
}


function getVoltage(audioContext, voltage){
  var arr = new Float32Array(4096)
  for (var i=0;i<4096;i++){
    arr[i] = voltage
  }
  var node = audioContext.createScriptProcessor(4096, 0, 1)
  node.onaudioprocess = function(e){
    var output = e.outputBuffer
    for (var i=0;i<output.numberOfChannels;i++){
      output.getChannelData(i).set(arr)
    }
  }
  return node
}