

const DiscordRPC = require('discord-rpc'); // importing the discord library

const clientId = '665244956805300274'; // The clientId of the discord app 
const ipcRPC = require('electron').ipcRenderer; // This is how we send messages between this and main.js
const timestamp = new Date(); // This is what we use for the timestamp
var mainArgs, hasTime;
// Default vars
// just the example used in development
var mainArgs = {
    details: "Using rpcengine",
    state: "by theqoobee",
    startTimestamp: true, // Timestamp to track the passage of time
    largeImageKey: "megu1", // name of the pics
    smallImageKey: "naruto_sleep", // ^^^
    largeImageText: "I'm big image", // the text displayed when hovering over them
    smallImageText: "I'm small image",
    instance: false,
};

var rpc = new DiscordRPC.Client({ transport: 'ipc' });


async function check() {
	var back = ipcRPC.sendSync('check', 'im checkin');
	if (back) {
		args = back;
	}
}


async function setActivity() {
  if (!rpc) {
    return;
  }

  tempArgs = args; 
  if (args.startTimestamp) {
  	tempArgs.startTimestamp = timestamp;
  } else { tempArgs.startTimestamp = null; }

  rpc.setActivity(tempArgs).catch(console.error);

}


rpc.on('ready', () => {
  setActivity();

  setInterval(() => {
  	check();
    setActivity();    
  }, 10e3);

});


rpc.login({clientId}).catch(console.error);