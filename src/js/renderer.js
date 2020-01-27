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

const $ = require('jquery') // jquery becuase im too lazy to learn rn
const ipcRenderer = require('electron').ipcRenderer // Used to communicate between renderer and main
var active = false
var changed = false
var defArgs = {
  details: 'Using rpcengine',
  state: 'by theqoobee',
  startTimestamp: true, // Timestamp to track the passage of time
  largeImageKey: 'megu1', // name of the pics
  smallImageKey: 'naruto_sleep', // ^^^
  largeImageText: "I'm big image", // the text displayed when hovering over them
  smallImageText: "I'm small image",
  instance: false
}
var args = defArgs
/* TODO LIST:
 * Make it work as it is with regular vars
 * Dynamically add the selections
 * Sync the html code to work with this
 */

setInterval(() => {
  update()
}, 5e3)

async function update () {
  if (active) {
    args = {
      details: $('#text1').val(),
      state: $('#text2').val(),
      startTimestamp: $('#timer').val() == 'Yes Timer',
      largeImageKey: $('#imagelg').val() == 'No Large Image' ? undefined : $('#imagelg').val().toLowerCase(),
      smallImageKey: $('#imagesm').val() == 'No Large Image' ? undefined : $('#imagesm').val().toLowerCase(),
      largeImageText: $('imagelgText').val(),
      smallImageText: $('imagesmText').val(),
      instance: false
    }

    if (args.details.length > 2 && args.state.length > 2) {
      ipcRenderer.send('update', args)
      if (changed) {
        change()
        changed = false
      }
    } else {
      args = defArgs
      log('Please enter at least 2 characters for the first two fields', 'error')
      active = false
    }
  }
}

ipcRenderer.on('username', (event, args) => {
  log(`Successfuly connected for <strong> ${args} </strong>`, 'big')
})

$(document).ready(() => { // When the document is fully loaded
  // The function below changes what happens when the enter key is pressed on all elements
  window.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
      event.preventDefault()
      $('#submit').click()
    }
  })

  loadImages() // load the image options as soon as the document is ready
})

function toggleActive () {
  return active = !active // toggles active
}

function enrich () {
  toggleActive()

  update()
  if (active) {
    $('#submit').replaceWith('<button id="submit"onclick="enrich()" class="btn btn-dark">Presence: ON</button>')
  } else {
    $('#submit').replaceWith('<button id="submit"onclick="enrich()" class="btn btn-dark">Presence: OFF</button>')
  }
}

// I'll use this later

// function removeHelp () {
//   $('#helperText').toggleClass('hidden')
// }

// The following are functions used to visually represent what's going on for the user
// change() changes everything to red, for errors

function change () {
  $('#output').toggleClass('bg-danger')
  $('#ico').toggleClass('bg-danger')
  $('input').toggleClass('bg-danger')
  $('select').toggleClass('bg-danger')
  $('input').toggleClass('white')
}

// Log uses the "command prompt" in the UI to tell users what's going on
function log (text, type) {
  if (type === 'error' && !changed) { // Paramater error makes everything turn red
    $('#textOutput').replaceWith(`<p class="text-monospace text-white small" id="textOutput">${text};</p>`)
    change()
    changed = true
  } else if (type === 'big') {
    $('#textOutput').replaceWith(`<p class="text-monospace text-white" id="textOutput">${text};</p>`)
  } else {
    $('#textOutput').replaceWith(`<p class="text-monospace text-white small" id="textOutput">${text};</p>`)
  }
}

// Sends a message to open the settings window
function settingWindow () {
  ipcRenderer.send('settings')
}
// Toggles the topbar menu cause it's annoying
function menu () {
  ipcRenderer.send('menu')
}

// The next bit dynamically loads in the images for the choosers

async function loadImages () {
  const assets = await getAssets(clientId) // Self-explanatory i'd say

  let assetElementsLg = '<select id="imagelg" class="form-control"><option>No Large Image</option>' // The first options
  let assetElementsSm = '<select id="imagesm" class="form-control"><option>No Small Image</option>'
  const namesOfAssets = []

  assets.forEach(asset => {
    namesOfAssets.push(asset.name) // cycle through the assets and make an array of strings, because it can be sorted
  })
  namesOfAssets.sort() // sordit
  namesOfAssets.forEach(asset => {
    assetElementsLg += `<option>${asset}</option>` // add the options as strings
    assetElementsSm += `<option>${asset}</option>`
  })
  assetElementsLg += '</select>' // add the ending 'bracket'
  assetElementsSm += '</select>'
  $('#imagelg').replaceWith(assetElementsLg) // and finally put it in
  $('#imagesm').replaceWith(assetElementsSm)
}
