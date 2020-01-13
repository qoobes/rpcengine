console.log("Initialized app");
const $ = require('jquery');
const ipcRenderer = require('electron').ipcRenderer;
var text1, text2, imagelg, imagesm, timer;

function enrich() {
	if ($("#text1").val().length < 2 || $("#text2").val().length < 2) { 
		console.log("lolfail"); 
		return; }
	 
	text1 = $("#text1").val();
	text2 = $("#text2").val();
	imagelg = $("#imagelg").val() == 'No Large Image' ? false : $("#imagelg").val();
	imagesm = $("#imagesm").val() == 'No Small Image' ? false : $("#imagesm").val();
	timer = $("#timer").val() == 'Yes Timer' ? true : false; 

	ipcRenderer.send('simple', { text1, text2, imagelg, imagesm, timer });

}

$(document).ready( () => {
   //Maybe, sometime into the future, maybe i shall add something here
});

