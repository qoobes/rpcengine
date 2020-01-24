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

const $ = require('jquery')
const ipcRenderer = require('electron').ipcRenderer
var text1, text2, imagelg, imagesm, timer
let changed = false
let status
var mode = 'Code'

function enrich () {
  if ($('#text1').val().length < 2 || $('#text2').val().length < 2) {
    log('Please enter at least 2 characters', 'error')
    return
  }

  text1 = $('#text1').val()
  text2 = $('#text2').val()
  imagelg = $('#imagelg').val() == 'No Large Image' ? undefined : $('#imagelg').val().toLowerCase()
  imagesm = $('#imagesm').val() == 'No Small Image' ? undefined : $('#imagesm').val().toLowerCase()
  timer = $('#timer').val() == 'Yes Timer'

  status = ipcRenderer.sendSync('args', { text1, text2, imagelg, imagesm, timer })
  if (status.success === true) {
    if (changed) {
      changed = false
      change()
    }
    log(`Successfuly connected for <strong>${status.user}</strong>`)
  } else {
    document.write(
      '<h1>A serious error has occured</h1>',
      '<br> <h3>please report this on the following link </h3>',
      '<br> <a style="font-size: 40px" href="https://github.com/theqoobee/rpcengine/issues">Github.</a>',
      '<br> <h3>Please forward this error too <br> </h3>',
    `<br> <h4 style = 'color: red'> ${status}</h4>`
    )
  }
}

$(document).ready(() => {
  window.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
      event.preventDefault()
      $('#submit').click()
    }
  })
})

function change () {
  $('#output').toggleClass('bg-danger')
  $('#ico').toggleClass('bg-danger')
  $('input').toggleClass('bg-danger')
  $('select').toggleClass('bg-danger')
  $('input').toggleClass('white')
}

function log (text, type) {
  $('#textOutput').replaceWith(`<p class="text-monospace text-white" id="textOutput">${text};</p>`)
  if (type === 'error' && !changed) { change(); changed = true };
}

ipcRenderer.on('name', (event, args) => {
  console.log(args)
})
