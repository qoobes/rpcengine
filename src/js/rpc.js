// MIT License

// Copyright (c) 2020 theqoobee, qoobes

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const DiscordRPC = require('discord-rpc') // importing the discord library

var clientId = '665244956805300274' // The clientId of the discord app
const ipcRPC = require('electron').ipcRenderer // This is how we send messages between this and main.js
const timestamp = new Date() // This is what we use for the timestamp
var username
// Default vars

var tempArgs
var args = {
  details: 'Using rpcengine',
  state: 'by theqoobee',
  startTimestamp: true, // Timestamp to track the passage of time
  largeImageKey: 'megu1', // name of the pics
  smallImageKey: 'naruto_sleep', // ^^^
  largeImageText: "I'm big image", // the text displayed when hovering over them
  smallImageText: "I'm small image",
  instance: false
}

var rpc = new DiscordRPC.Client({ transport: 'ipc' }) // setting up the richpresence object
// The purpose of the following function is to check whether or not there are any updates to the arguments
//
// It sends a synchornous message to main via ipcRenderer, and as a result gets either false, meaning there
// were no changes, or a changed version of the arguments

async function check () {
  var update = ipcRPC.sendSync('check', username) // passing the username as an argument
  if (update.args) { // If back is true, in other words if it isn't false, null, or undefined
    args = update.args // change the value of args to the value given by the main process
  }
  if (update.clientId) {
    clientId = update.clientId
    clientUpdate()
  }
}

// The function to set the rich presence of the user
//
async function setActivity () {
  if (!rpc) { // if the rpc object was not properly initialized, do not run
    return
  }
  // here i chose to make a temporary version of the arguments for the sake of not changing
  // the real ones when i set the timestamp there because the user turning them off would be a problem
  tempArgs = args
  if (args.startTimestamp) { // if the user chose to have a timestamp
    tempArgs.startTimestamp = timestamp // set the field to a timestamp
  } else { tempArgs.startTimestamp = null } // else set it to null

  // send the activity to discord, if there are any errors resolve the failed promise
  rpc.setActivity(tempArgs).catch(console.error)
}

// finally, execute the setActivity() function only when rpc is ready

rpc.on('ready', () => {
  username = rpc.user.username + '#' + rpc.user.discriminator

  setActivity()

  setInterval(() => { // set an interval of 10 seconds
    check() // check if there's anything new, if so store the object
    setActivity() // set the activity
  }, 10e3) // wait 10 seconds before repeating the same thing
})

function clientUpdate () {
  rpc.destroy() // *properly* close the rpc
  rpc = new DiscordRPC.Client({ transport: 'ipc' }) // create a new one
  rpc.login({ clientId }).catch(console.error) // register with the new client id
  loadImages()
}

// Login to finalize everything
rpc.login({ clientId }).catch(console.error) // again resolve failed promise
