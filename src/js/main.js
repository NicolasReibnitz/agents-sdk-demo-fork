/* 1. Import the Agents SDK library */
import * as sdk from '@d-id/client-sdk';

import { onConnectionStateChange } from './onConnectionStateChange.js';
import { onError } from './onError.js';
import { onNewMessage } from './onNewMessage.js';
import { onSrcObjectReady } from './onSrcObjectReady.js';
import { onVideoStateChange } from './onVideoStateChange.js';
import { log } from './utils.js';
import { toggleStartStop } from './webSpeechAPI.js';

import '../css/style.scss';

/* 2. Paste the `data-agent-id' in the 'agentId' variable */
const agentId = import.meta.env.VITE_DID_AGENT_ID;

/* 3. Paste the 'data-client-key' in the 'clientKey' variable */
const clientKey = import.meta.env.VITE_DID_CLIENT_KEY;

/* HTML Variables declaration */
const textArea = document.querySelector('#textArea');
const langSelect = document.querySelector('#langSelect');
const speechButton = document.querySelector('#speechButton');
const connectionLabel = document.querySelector('#connectionLabel');
const chatButton = document.querySelector('#chatButton');
const speakButton = document.querySelector('#speakButton');
const reconnectButton = document.querySelector('#reconnectButton');

let srcObject;

/* 4. Define the SDK callbacks functions in this object */
const callbacks = {
	/* Link the HTML Video element with the WebRTC Stream Object (Video & Audio tracks) */
	onSrcObjectReady: value => (srcObject = onSrcObjectReady(value, srcObject)),

	/* Connection States callback method */
	onConnectionStateChange: state => onConnectionStateChange(state, agentManager, chat),

	/* Switching between the idle and streamed videos */
	onVideoStateChange: state => onVideoStateChange(state, agentManager, srcObject),

	/* New messages callback method */
	onNewMessage,

	/* Error handling */
	onError
};

/* Local functions to utilize the Agent's SDK methods: */

/* agentManager.speak() -> Streaming API (Bring your own LLM) */
function speak(text) {
	const val = text || textArea.value;
	/* Speak supports a minimum of 3 characters */
	if (val !== '' && val.length > 2) {
		const speak = agentManager.speak({
			type: 'text',
			input: val
		});
		console.log(`agentManager.speak("${val}")`, speak);
		log('assistant', val, 'speak');

		connectionLabel.innerHTML = 'Streaming..';
	}
}

/* agentManager.chat() -> Agents API (communicating with your created Agent and its knowledge -> Streams back the D-ID's LLM response) */
function chat() {
	const val = textArea.value;
	if (val !== '') {
		const chat = agentManager.chat(val);
		console.log(`agentManager.chat("${val}")`, chat);
		connectionLabel.innerHTML = 'Thinking..';
		textArea.value = '';
	}
}

/* agentManager.reconnect() -> Reconnect the Agent to a new WebRTC session */
function reconnect() {
	const reconnect = agentManager.reconnect();
	log('system', reconnect, 'reconnect');
}

/* Reminder to place Agent ID and Client Key at the top of this file */
if (agentId === '' || clientKey === '') {
	connectionLabel.innerHTML = `<span style='color:red; font-weight:bold'> Missing agentID and auth.clientKey variables</span>`;

	console.error('Missing agentID and auth.clientKey variables');
	console.log(
		`Missing agentID and auth.clientKey variables:\n\nFetch the data-client-key and the data-agent-id as explained on the Agents SDK Overview Page:\nhttps://docs.d-id.com/reference/agents-sdk-overview\n\nPaste these into their respective variables at the top of the main.js file and save.`
	);
}

/* Event Listeners for Agent's built-in methods */
chatButton.addEventListener('click', () => chat());
speakButton.addEventListener('click', () => speak());
reconnectButton.addEventListener('click', () => reconnect());
speechButton.addEventListener('click', () => toggleStartStop());

/* Focus on input and button disabling when loading */
window.addEventListener('load', () => {
	textArea.focus();
	chatButton.setAttribute('disabled', true);
	speakButton.setAttribute('disabled', true);
	langSelect.setAttribute('disabled', true);
	speechButton.setAttribute('disabled', true);
});

/* 6. *** Finally *** Create the 'agentManager' instance with the values created in previous steps */
const agentManager = await sdk.createAgentManager(agentId, {
	auth: { type: 'key', clientKey },
	callbacks,
	streamOptions: { compatibilityMode: 'auto', streamWarmup: false }
});

log('system', agentManager, 'createAgentManager');

/* Displaying the Agent's name in the HTML Header */
document.querySelector('#previewName').innerHTML = agentManager.agent.preview_name;

/**
 * Setting the thumbnail as the video background image to avoid "flickering".
 * Set one of the following (depends on the Avatar's type):
 * agentManager.agent.presenter.source_url / agentManager.agent.presenter.thumbnail
 */
document.querySelector('#videoElement').style.backgroundImage = `url(${agentManager.agent.preview_thumbnail})`;

/* agentManager.connect() method -> Creating a new WebRTC session and connecting it to the Agent */
agentManager.connect();

log('system', '', 'connect');

window.agentManager = agentManager;

/* Happy Coding! */

/* agentManager.disconnect() -> Terminates the current Agent's WebRTC session (Not implemented in this code example)
function disconnect() {
	let disconnect = agentManager.disconnect();
	console.log('agentManager.disconnect()', disconnect);
} */

/* agentManager.rate() -> Rating the Agent's answers - for future Agents Analytics and Insights feature
function rate(messageID, score) {
	let rate = agentManager.rate(messageID, score);
	console.log(`Message ID: ${messageID} Rated:${score}\n`, 'Result', rate);
} */
