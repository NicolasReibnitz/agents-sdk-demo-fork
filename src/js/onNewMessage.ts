import { Message } from '@d-id/client-sdk';
import { log } from './utils.js';

const answers = document.querySelector('#answers') as HTMLDivElement;

function onNewMessage(messages: Message[], type: 'answer' | 'partial' | 'user') {
	log('system', messages, 'onNewMessage');
	// We want to show only the last message from the entire 'messages' array
	const lastIndex = messages.length - 1;
	const msg = messages[lastIndex];

	// Show Rating buttons only for the Agent's (assistant) full answers
	if (msg && msg.role === 'assistant' && messages.length !== 1) {
		if (type === 'answer') {
			log(msg.role, msg.content, `${type} (full)`);
			// answers.innerHTML += `${timeDisplay()} - [${msg.role}] : ${msg.content}  <button id='${msg.id}_plus' title='agentManager.rate() -> Rate this answer (+)'>+</button> <button id='${msg.id}_minus' title='agentManager.rate() -> Rate this answer (-)'>-</button> <br>`;
			// document.getElementById(`${msg.id}_plus`).addEventListener('click', () => rate(msg.id, 1));
			// document.getElementById(`${msg.id}_minus`).addEventListener('click', () => rate(msg.id, -1));
		}
	} else if (msg) {
		log(msg.role, msg.content, `${type} (stream)`);
		// answers.innerHTML += `${timeDisplay()} - [${msg.role}] : ${msg.content}  <br>`;
	}

	// Auto-scroll to the last message
	answers.scrollTop = answers.scrollHeight;
}
export { onNewMessage };
