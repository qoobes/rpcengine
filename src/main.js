
'use strict';

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const DiscordRPC = require('discord-rpc');

if (require('electron-squirrel-startup')) { 
  app.quit();
}

let mainWindow;

const createWindow = () => {
  
  mainWindow = new BrowserWindow({
    width: 800,
    height: 450,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.openDevTools();

  mainWindow.removeMenu();

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('closed', () => {

    mainWindow = null;

  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    createWindow();
  }
});

app.on('activate', () => {

  if (mainWindow === null) {
    createWindow();
  }

});


const clientId = '180984871685062656';
DiscordRPC.register(clientId);

const rpc = new DiscordRPC.Client( { transport: 'ipc' } );
const startTimestamp = new Date();

async function setActivity() {
  if (!rpc || !mainWindow) {
    console.log(!mainWindow ? "truerror" : "falserror");
    return;
  }
}

ipcMain.on('simple', (event, args) => {
  var timestamp = args.timer == false ? undefined : startTimestamp;
  console.log(args.text1);
  rpc.setActivity({
    details: args.text1,
    state: args.text2,
    startTimestamp,
    largeImageKey: args.imagelg,
    smallImageKey: args.imagesm,
    instance: false,
  });


});

rpc.on('ready', () => {
  setActivity();


  setInterval(() => {
    setActivity();

  }, 15e3);
});

rpc.login({ clientId }).catch(console.error);
