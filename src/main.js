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
'use strict'

// Including libraries
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
// const rpc = require('./js/rpc.js');
const isEqual = require('lodash.isequal')
var rpcjs
// Set the mode to development
process.env.NODE_ENV = 'production'

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
    icon: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn2.iconfinder.com%2Fdata%2Ficons%2Fios-7-icons%2F50%2Fengine-512.png&f=1&nofb=1',
    width: 800,
    height: 450,
    vibrancy: 'dark', // mac only
    resizable: false,
    webPreferences: {
      nodeIntegration: true // Make sure node is there
    }
  })

  // mainWindow.openDevTools()

  // // this is temporary

  // if (!menu) {
  mainWindow.removeMenu()
  // }
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
    rpcjs.send('destroy')
    app.quit() // quit the app
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
  if (settingWindow === undefined || settingWindow === null) {
    createSettingWindow()
  }
})
function createSettingWindow () {
  settingWindow = new BrowserWindow({ // Setting the dimnesions
    parent: mainWindow,
    width: 600,
    height: 300,
    vibrancy: 'dark', // mac only
    resizable: false,
    webPreferences: {
      nodeIntegration: true // Make sure node is there
    }
  })

  // settingWindow.openDevTools()

  settingWindow.removeMenu() // I don't need the menu there, it's ew.
  // if (!menu) {
  // settingWindow.removeMenu()
  // }// this is again temporary

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

var changed = { args: false, clientId: false } // Two variables to keep track of changed
var customClientId
var username
var mainArgs
var argsReturnValue, clientReturnValue

// This function reacts to a message from the renderer process, specifically looking at if anything changed
// If anything changed, it give it to the rpc function wheen it checks
ipcMain.on('update', (event, args) => {
  if (isEqual(mainArgs, args) === false) {
    changed.args = true
    mainArgs = args
  }
  event.sender.send('username', username)
})

// Reacts to rpc checking if there's anything new
ipcMain.on('check', (event, args) => {
  username = args // we passed the username from the rpc.js function
  // check for new general args
  if (changed.args !== false) {
    argsReturnValue = mainArgs
    changed.args = false
  } else { argsReturnValue = false }

  // check for new clientid
  if (changed.clientId === true) {
    clientReturnValue = customClientId
    changed.clientId = false
  } else { clientReturnValue = false }

  event.returnValue = { args: argsReturnValue, clientId: clientReturnValue }
})

ipcMain.on('advanced', (event, args) => {
  changed.clientId = true
  customClientId = args
})

ipcMain.on('info', (event) => {
  rpcjs = event.sender
})

ipcMain.on('exitSettings', (event) => {
  if (settingWindow !== null) {
    settingWindow.close()
  }
})

// // To be removed for production
// // This just toggles the menu so i don't have to restart the app every time i want to see what it looks like without it
// ipcMain.on('menu', (event) => {
//   menu = !menu
//   mainWindow.close()
//   if (settingWindow) {
//     settingWindow.close()
//     createSettingWindow()
//   }
//   // createWindow()
// }) // THIS PART REALLY NEEDS REMOVAL LATER ^^^^^
