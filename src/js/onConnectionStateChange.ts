import { log } from './utils.js';

const textArea = document.querySelector('#textArea');
const langSelect = document.querySelector('#langSelect');
const speechButton = document.querySelector('#speechButton');
const connectionLabel = document.querySelector('#connectionLabel');
const chatButton = document.querySelector('#chatButton');
const speakButton = document.querySelector('#speakButton');

function onConnectionStateChange(state, agentManager, chat) {
	log('system', state, 'onConnectionStateChange');

	if (state === 'connecting') {
		connectionLabel.innerHTML = 'Connecting..';
		document.querySelector('#container').style.display = 'flex';
		document.querySelector('#hidden').style.display = 'none';
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
			// speak(agentManager.agent.greetings[0]);
		}
	} else if (state === 'disconnected' || state === 'closed') {
		textArea.removeEventListener('keypress', event => {
			if (event.key === 'Enter') {
				event.preventDefault();
				chat();
			}
		});
		document.querySelector('#hidden_h2').innerHTML = `${agentManager.agent.preview_name} Disconnected`;
		document.querySelector('#hidden').style.display = 'block';
		document.querySelector('#container').style.display = 'none';
		chatButton.setAttribute('disabled', true);
		speakButton.setAttribute('disabled', true);
		langSelect.setAttribute('disabled', true);
		speechButton.setAttribute('disabled', true);
		connectionLabel.innerHTML = '';
	}
}

export { onConnectionStateChange };
