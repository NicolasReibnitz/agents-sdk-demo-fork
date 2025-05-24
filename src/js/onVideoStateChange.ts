import { log } from './utils.js';

const videoElement = document.querySelector('#videoElement');
const connectionLabel = document.querySelector('#connectionLabel');

function onVideoStateChange(state, agentManager, srcObject) {
	log('system', state, 'onVideoStateChange');

	if (state === 'STOP') {
		videoElement.muted = true;
		videoElement.srcObject = undefined;
		videoElement.src = agentManager.agent.presenter.idle_video;
		connectionLabel.innerHTML = 'Idle';
	} else {
		videoElement.muted = false;
		videoElement.src = '';
		videoElement.srcObject = srcObject;
		connectionLabel.innerHTML = 'Online';
	}
}

export { onVideoStateChange };
