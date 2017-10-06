
/**
Length of a tick in milliseconds. The denominator is your desired framerate.
e.g. 1000 / 20 = 20 fps,  1000 / 60 = 60 fps
*/
var tickLengthMs = 1000
function bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};
/* gameLoop related variables */
// timestamp of each loop
var previousTick = Date.now()
// number of times gameLoop gets called
var actualTicks = 0

//&& npm install socket.io-client && npm install https://github.com/kcbanner/node-cas && npm install browserify
var gameLoop = function () {
  var now = Date.now()

  actualTicks++
  if (previousTick + tickLengthMs <= now) {
    var delta = (now - previousTick) / 1000
    previousTick = now

    update(delta)
    console.log(bytesToSize(process.cpuUsage().user))
    console.log(bytesToSize(process.cpuUsage().system));
 console.log(bytesToSize(process.memoryUsage().heapTotal));
  console.log(bytesToSize(process.memoryUsage().heapUsed));
    console.log('delta', delta, '(target: ' + tickLengthMs +' ms)', 'node ticks', actualTicks)
    actualTicks = 0
  }

  if (Date.now() - previousTick < tickLengthMs - 16) {
    setTimeout(gameLoop)
  } else {
    setImmediate(gameLoop)
  }
}


/**
Update is normally where all of the logic would go. In this case we simply call
a function that takes 10 milliseconds to complete thus simulating that our game
had a very busy time.
*/
var update = function(delta) {
  aVerySlowFunction(10)
}

/**
A function that wastes time, and occupies 100% CPU while doing so.
Suggested use: simulating that a complex calculation took time to complete.
*/
var aVerySlowFunction = function(milliseconds) {
  // waste time
  var start = Date.now()
  while (Date.now() < start + milliseconds) { }  
}

// begin the loop !
gameLoop()