/*http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript*/
var moment = require('moment')
var tz = require('moment-timezone')
var os = require("os");
const random = () => {
  var text = "";
  var possible = "0123456789"; //ABCDEFGHIJKLMNOPQRSTUVWXYZ
  for( var i=0; i < 7; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

const timezone = () => {
  let fecha = moment();
  let current_time_guayaquil = moment(fecha.tz('America/Guayaquil').format())
  return current_time_guayaquil
}



const cpu = () => {
  //Create function to get CPU information
function cpuAverage(){

  //Initialise sum of idle and time of cores and fetch CPU info
  var totalIdle = 0, totalTick = 0;
  var cpus = os.cpus();

  //Loop through CPU cores
  for(var i = 0, len = cpus.length; i < len; i++) {

    //Select CPU core
    var cpu = cpus[i];

    //Total up the time in the cores tick
    for(type in cpu.times) {
      totalTick += cpu.times[type];
   }     

    //Total up the idle time of the core
    totalIdle += cpu.times.idle;
  }

  //Return the average Idle and Tick times
  return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
}

//Grab first CPU Measure
var startMeasure = cpuAverage();

//Set delay for second Measure
setTimeout(function() { 

  //Grab second Measure
  var endMeasure = cpuAverage(); 

  //Calculate the difference in idle and total time between the measures
  var idleDifference = endMeasure.idle - startMeasure.idle;
  var totalDifference = endMeasure.total - startMeasure.total;

  //Calculate the average percentage CPU usage
  var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);

  //Output result to console
  console.log(percentageCPU + "% CPU Usage.");

}, 1000);
}


module.exports = {
  random,
  timezone,
  cpu
}
