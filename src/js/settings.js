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

// This file regulates the settings window
var url, customClientId, returns
// Function for opening the wiki in another browser window
function wiki () {
  require('electron').shell.openExternal('https://github.com/theqoobee/rpcengine/wiki')
}

// save the client id and shoot it to main
async function kel () {
  customClientId = $('#ClientId').val()

  if (await prove(customClientId)) {
    ipcRenderer.send('advanced', customClientId)
    $('#multiSelect').replaceWith('<p class="text-success small ml-3" >Sucessfully set new client id! Wait 10-15 seconds for changes to apply.</p>')
    $('#clientButton').replaceWith('<button class="btn button success" id="clientButton" onclick="exit()">Exit</button>')
    $('#helpText').toggleClass('success')
  }
}

function exit () {
  ipcRenderer.send('exitSettings')
}

async function prove (id) {
  if (id.length !== 18) {
  	alert('Wrong clientId: too short')
    return false
  }
  if (await getAssets(id) === 'INVALID_ID_ERROR') {
  	alert('Wrong clientId: doesn\'t exist')
    return false
  }
  return true
}

async function getAssets (id) {
  url = `https://discordapp.com/api/v6/oauth2/applications/${id}/assets`

  const assets = await fetch(url)
    .then(response => {
      return response.json()
    })
    .then(data => {
      returns = data
      return data
    })
  if (assets.code !== undefined) {
    	return 'INVALID_ID_ERROR'
  } else { return assets }
}
