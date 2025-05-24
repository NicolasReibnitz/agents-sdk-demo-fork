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
import { AgentManager, ChatMode, ConnectionState, StreamingState } from '@d-id/client-sdk';

let agentManager: AgentManager;

/* 2. Paste the `data-agent-id' in the 'agentId' variable */
const agentId = import.meta.env.VITE_DID_AGENT_ID;

/* 3. Paste the 'data-client-key' in the 'clientKey' variable */
const clientKey = import.meta.env.VITE_DID_CLIENT_KEY;

/* HTML Variables declaration */
const textArea = document.querySelector('#textArea') as HTMLTextAreaElement;
const langSelect = document.querySelector('#langSelect') as HTMLSelectElement;
const speechButton = document.querySelector('#speechButton') as HTMLButtonElement;
const previewNameLabel = document.querySelector('#previewName') as HTMLSpanElement;
const connectionLabel = document.querySelector('#connectionLabel') as HTMLSpanElement;
const chatButton = document.querySelector('#chatButton') as HTMLButtonElement;
const speakButton = document.querySelector('#speakButton') as HTMLButtonElement;
const reconnectButton = document.querySelector('#reconnectButton') as HTMLButtonElement;
const videoElement = document.querySelector('#videoElement') as HTMLVideoElement;

window.videoElement = videoElement;

let srcObject: MediaStream;

/* 4. Define the SDK callbacks functions in this object */
const callbacks = {
	/* Link the HTML Video element with the WebRTC Stream Object (Video & Audio tracks) */
	onSrcObjectReady: (value: MediaStream) => (srcObject = onSrcObjectReady(value, srcObject)),

	/* Connection States callback method */
	onConnectionStateChange: (state: ConnectionState) => onConnectionStateChange(state, agentManager, chat),

	/* Switching between the idle and streamed videos */
	onVideoStateChange: (state: StreamingState) => onVideoStateChange(state, agentManager, srcObject),

	/* New messages callback method */
	onNewMessage,

	/* Error handling */
	onError
};

/* Local functions to utilize the Agent's SDK methods: */

/* agentManager.speak() -> Streaming API (Bring your own LLM) */
function speak(text?: string) {
	const val = text || textArea?.value;
	/* Speak supports a minimum of 3 characters */
	if (val !== '' && val.length > 2) {
		agentManager.speak({
			type: 'text',
			input: val
		});

		log('assistant', val, 'speak');

		connectionLabel.innerHTML = 'Streaming..';
	}
}

/* agentManager.chat() -> Agents API (communicating with your created Agent and its knowledge -> Streams back the D-ID's LLM response) */
function chat() {
	const val = textArea.value;
	if (val !== '') {
		agentManager.chat(val);

		if (connectionLabel) connectionLabel.innerHTML = 'Thinking..';
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
	console.error(
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
	chatButton.setAttribute('disabled', 'disabled');
	speakButton.setAttribute('disabled', 'disabled');
	langSelect.setAttribute('disabled', 'disabled');
	speechButton.setAttribute('disabled', 'disabled');
});

async function init() {
	/* 6. *** Finally *** Create the 'agentManager' instance with the values created in previous steps */
	agentManager = await sdk.createAgentManager(agentId, {
		auth: { type: 'key', clientKey },
		callbacks,
		streamOptions: { compatibilityMode: 'auto', streamWarmup: false },
		mode: ChatMode['Functional']
	});

	log('system', agentManager, 'createAgentManager');

	videoElement.muted = true;
	videoElement.srcObject = null;
	videoElement.src = agentManager.agent.presenter.idle_video || '';

	/* Displaying the Agent's name in the HTML Header */
	previewNameLabel.innerHTML = agentManager.agent.preview_name || '';

	/**
	 * Setting the thumbnail as the video background image to avoid "flickering".
	 * Set one of the following (depends on the Avatar's type):
	 * agentManager.agent.presenter.source_url / agentManager.agent.presenter.thumbnail
	 */
	videoElement.style.backgroundImage = `url(${agentManager.agent.preview_thumbnail})`;

	/* agentManager.connect() method -> Creating a new WebRTC session and connecting it to the Agent */
	agentManager.connect().then(() => {
		setTimeout(() => {
			speak(agentManager.agent.greetings?.[0]);
		}, 0);
	});

	log('system', '', 'connect');

	window.agentManager = agentManager;
}
init().catch(error => {
	console.error('Error initializing agent manager:', error);
	connectionLabel.innerHTML = `<span style='color:red; font-weight:bold'> ${error}</span>`;
});

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
