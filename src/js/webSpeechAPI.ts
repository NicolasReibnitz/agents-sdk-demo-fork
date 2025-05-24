const textArea = document.querySelector('#textArea') as HTMLTextAreaElement;
const langSelect = document.querySelector('#langSelect') as HTMLSelectElement;
const speechButton = document.querySelector('#speechButton') as HTMLButtonElement;
const chatButton = document.querySelector('#chatButton') as HTMLButtonElement;
const speakButton = document.querySelector('#speakButton') as HTMLButtonElement;

let recognizing: Boolean;
let recognition: SpeechRecognition;

if (navigator.userAgent.includes('Firefox')) {
	recognition = new SpeechRecognition();
} else {
	recognition = new webkitSpeechRecognition();
}

recognition.lang = langSelect.value;
recognition.continuous = true;
reset();
recognition.onend = reset;

recognition.onresult = function (event) {
	for (let i = event.resultIndex; i < event.results.length; ++i) {
		if (event.results[i].isFinal) {
			console.log('..');
			textArea.value += event.results[i][0].transcript;
		}
	}
};

function reset() {
	recognizing = false;
	speechButton.style.color = '';
	speechButton.innerHTML = `<span class="material-symbols-outlined">mic</span>`;
	chatButton.removeAttribute('disabled');
	speakButton.removeAttribute('disabled');
}

function toggleStartStop() {
	recognition.lang = langSelect.value;
	if (recognizing) {
		textArea.focus();
		recognition.stop();
		reset();
	} else {
		textArea.value = '';
		recognition.start();
		recognizing = true;
		speechButton.style.color = 'red';
		speechButton.innerHTML = '&#x23F9;';
		chatButton.setAttribute('disabled', 'disabled');
		speakButton.setAttribute('disabled', 'disabled');
	}
}

export { toggleStartStop };
