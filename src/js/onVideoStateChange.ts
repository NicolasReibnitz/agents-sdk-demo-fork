import { log } from './utils.js';

const videoElement = document.querySelector('#videoElement') as HTMLVideoElement;
const connectionLabel = document.querySelector('#connectionLabel') as HTMLSpanElement;

function onVideoStateChange(state: $TSFixMe, agentManager: $TSFixMe, srcObject: $TSFixMe) {
	log('system', state, 'onVideoStateChange');

	if (state === 'STOP') {
		videoElement.muted = true;
		videoElement.srcObject = null;
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
