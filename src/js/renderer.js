const $ = require('jquery') // jquery becuase im too lazy to learn rn
const ipcRenderer = require('electron').ipcRenderer // Used to communicate between renderer and main
var active = false
var changed = false

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
      console.log('I get RAN FOR NO REASON!')

      ipcRenderer.send('update', args)
      if (changed) {
        change()
        changed = false
      }
    } else {
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
