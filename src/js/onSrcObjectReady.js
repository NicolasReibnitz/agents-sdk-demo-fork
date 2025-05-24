import { log } from './utils.js';

const videoElement = document.querySelector('#videoElement');

function onSrcObjectReady(value, srcObject) {
	log('system', value, 'onSrcObjectReady');
	videoElement.srcObject = value;
	srcObject = value;
	return srcObject;
}

export { onSrcObjectReady };
