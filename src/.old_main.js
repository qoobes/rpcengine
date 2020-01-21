'use strict'

// Including libraries
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const DiscordRPC = require('discord-rpc')
var write = false
// Set the mode to development
process.env.NODE_ENV = 'development'

// This is to prevent the app from launching lots of times during
// installation on windows
if (require('electron-squirrel-startup')) {
  app.quit()
}

// Define the window

let mainWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({ // Setting the dimnesions
    width: 800,
    height: 450,
    vibrancy: 'dark', // mac only
    webPreferences: {
      nodeIntegration: true // Make sure node is there
    }
  })

  mainWindow.openDevTools()

  mainWindow.removeMenu() // I don't need the menu there

  // Load the correct file
  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  // Make sure the window is gone whne closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// The function that creates the window

// When the app is loaded, create the new window
app.on('ready', createWindow)

// Instructions on what to do when the window is closed

app.on('window-all-closed', () => {
  // This is because mac allows all windows to be closed with
  // the app still staying open
  if (process.platform !== 'darwin') {
    // app.quit(); // quit the app
    createWindow()
  }
})

app.on('activate', () => {
  // An extension of the code above
  if (mainWindow === null) {
    createWindow()
  }
})
// ------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------
// The above code was setup, now that that's done let's get down to the juicy parts

// To elaborate how this works, the main.js function acts like an intermediary between renderer.js and rpc.js
// So rpc.js checks for updates every 12 seconds, by seeing if the args object in the main functions changed
// if it has rpc.js updates the rich presence, and if not, nothing changes
// when the user decides to change something in the rpcengine app, renderer beams the new info over to main.js

// THE DISCORD RPC SECTION OF THE CODE

var clientId = '665244956805300274'
var text1, text2, timer, imagelg, imagesm
DiscordRPC.register(clientId)

const rpc = new DiscordRPC.Client({ transport: 'ipc' })

const startTimestamp = new Date()

async function setActivity () {
  if (!rpc || !mainWindow) {

  }
}

ipcMain.on('args', (event, args) => {
  text1 = args.text1
  text2 = args.text2
  timer = args.timer
  imagelg = args.imagelg
  imagesm = args.imagesm
  write = true
  event.returnValue = { success: true, user: username }
})

if (write) {
  console.log(`yolo ${text1}`)
  try {
    if (args.timer) {
      rpc.setActivity({
        details: args.text1,
        state: args.text2,
        startTimestamp,
        largeImageKey: args.imagelg,
        smallImageKey: args.imagesm,
        instance: false
      })
    } else {
      rpc.setActivity({
        details: args.text1,
        state: args.text2,
        largeImageKey: args.imagelg,
        smallImageKey: args.imagesm,
        instance: false
      })
    }
  } catch (err) {
    console.log(`problem with  ${text1}`)
  }
}

var username
rpc.on('ready', () => {
  username = rpc.user.username + '#' + rpc.user.discriminator

  setActivity()
  setInterval(() => {
    setActivity()
  }, 15e3)
})

rpc.login({ clientId }).catch(console.error)
