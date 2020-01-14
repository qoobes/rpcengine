'use strict';

const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron');
const path = require('path');
const url = require('url');
const DiscordRPC = require('discord-rpc');
var init = false;

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


const clientId = '665244956805300274';
DiscordRPC.register(clientId);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });


const startTimestamp = new Date();
// var timestamp;

async function setActivity() {
    if (!rpc || !mainWindow) {
        return;
    }
}
ipcMain.on('simple', (event, args) => {
    init = true;
 

    try {
      if (args.timer){
              rpc.setActivity({
                  details: args.text1,
                  state: args.text2,
                  startTimestamp,
                  largeImageKey: args.imagelg,
                  smallImageKey: args.imagesm,
                  instance: false,
              });} else {
                rpc.setActivity({
                  details: args.text1,
                  state: args.text2,
                  largeImageKey: args.imagelg,
                  smallImageKey: args.imagesm,
                  instance: false,
              });
              }
    } catch(err) {
        event.returnValue = 'Something went wrong! ' + err.message;
    }
    event.returnValue =  { success: true, user: username };

});

var username;
rpc.on('ready', () => {
username = rpc.user.username + "#" + rpc.user.discriminator;
    
    setActivity();
    setInterval(() => {
        setActivity();

    }, 15e3);
});

rpc.login({
    clientId
}).catch(console.error);
