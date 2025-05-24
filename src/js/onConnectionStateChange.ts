import { log } from './utils.js';

const textArea = document.querySelector('#textArea') as HTMLTextAreaElement;
const langSelect = document.querySelector('#langSelect') as HTMLSelectElement;
const speechButton = document.querySelector('#speechButton') as HTMLButtonElement;
const connectionLabel = document.querySelector('#connectionLabel') as HTMLSpanElement;
const chatButton = document.querySelector('#chatButton') as HTMLButtonElement;
const speakButton = document.querySelector('#speakButton') as HTMLButtonElement;

function onConnectionStateChange(state: string, agentManager: $TSFixMe, chat: $TSFixMe) {
	log('system', state, 'onConnectionStateChange');

	if (state === 'connecting') {
		connectionLabel.innerHTML = 'Connecting..';
		(document.querySelector('#container') as HTMLDivElement).style.display = 'flex';
		(document.querySelector('#hidden') as HTMLDivElement).style.display = 'none';
	} else if (state === 'connected') {
		// Setting the 'Enter' Key to Send a message
		textArea.addEventListener('keypress', event => {
			if (event.key === 'Enter') {
				event.preventDefault();
				chat();
			}
		});
		chatButton.removeAttribute('disabled');
		speakButton.removeAttribute('disabled');
		langSelect.removeAttribute('disabled');
		speechButton.removeAttribute('disabled');
		connectionLabel.innerHTML = 'Online';

		if (agentManager.agent.greetings?.[0]) {
			log('assistant', agentManager.agent.greetings[0], 'greeting');
		}
	} else if (state === 'disconnected' || state === 'closed') {
		textArea.removeEventListener('keypress', event => {
			if (event.key === 'Enter') {
				event.preventDefault();
				chat();
			}
		});
		(document.querySelector('#hidden_h2') as HTMLHeadingElement).innerHTML =
			`${agentManager.agent.preview_name} Disconnected`;
		(document.querySelector('#hidden') as HTMLDivElement).style.display = 'block';
		(document.querySelector('#container') as HTMLDivElement).style.display = 'none';
		chatButton.setAttribute('disabled', 'disabled');
		speakButton.setAttribute('disabled', 'disabled');
		langSelect.setAttribute('disabled', 'disabled');
		speechButton.setAttribute('disabled', 'disabled');
		connectionLabel.innerHTML = '';
	}
}

export { onConnectionStateChange };
