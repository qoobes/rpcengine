// This file regulates the settings window
function validate () {
  const clientInput = $('#ClientId')
  if (clientInput.checkValidity()) {
    console.log('yeet works')
  } else {
    console.log('yeet noworks')
  }
}
