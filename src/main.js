'use strict'

// Including libraries
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
// const rpc = require('./js/rpc.js');
const isEqual = require('lodash.isequal')

// Set the mode to development
process.env.NODE_ENV = 'development'

// This is to prevent the app from launching lots of times during
// installation on windows
if (require('electron-squirrel-startup')) {
  app.quit()
}

var menu = false

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

  // this is temporary

  if (!menu) {
    mainWindow.removeMenu()
  }

  // mainWindow.removeMenu() // I don't need the menu there, it's ew.

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
    // rpc.destroy()
  }
})

app.on('activate', () => {
  // An extension of the code above
  if (mainWindow === null) {
    createWindow()
  }
})

// This is for integrating the special settings

let settingWindow

ipcMain.on('settings', (event) => {
  createSettingWindow()
})
function createSettingWindow () {
  settingWindow = new BrowserWindow({ // Setting the dimnesions
    width: 600,
    height: 300,
    vibrancy: 'dark', // mac only
    webPreferences: {
      nodeIntegration: true // Make sure node is there
    }
  })

  settingWindow.openDevTools()

  // settingWindow.removeMenu() // I don't need the menu there, it's ew.
  if (!menu) {
    settingWindow.removeMenu()
  }// this is again temporary

  // Load the correct file
  settingWindow.loadFile(path.join(__dirname, 'settings.html'))

  // Make sure the window is gone whne closed
  settingWindow.on('closed', () => {
    settingWindow = null
  })
}
// ------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------
// The above code was setup, now that that's done let's get down to the juicy parts

// To elaborate how this works, the main.js function acts like an intermediary between renderer.js and rpc.js
// So rpc.js checks for updates every 12 seconds, by seeing if the args object in the main functions changed
// if it has rpc.js updates the rich presence, and if not, nothing changes
// // when the user decides to change something in the rpcengine app, renderer beams the new info over to main.js

var changed = true // A variable to keep track of cahnged
var username
var mainArgs

// This function reacts to a message from the renderer process, specifically looking at if anything changed
// If anything changed, it give it to the rpc function wheen it checks
ipcMain.on('update', (event, args) => {
  if (!isEqual(mainArgs, args)) {
    changed = true
  }
  event.sender.send('username', username)
})

ipcMain.on('check', (event, args) => {
  username = args // we passed the username from the rpc.js function
  if (changed) {
    event.returnValue = mainArgs
    changed = false
  } else { event.returnValue = false }
})

ipcMain.on('menu', (event) => {
  menu = !menu
  mainWindow.close()
  if (settingWindow) {
    settingWindow.close()
    createSettingWindow()
  }
  // createWindow()
}) // THIS PART REALLY NEEDS REMOVAL LATER ^^^^^
