import { log } from './utils.js';

function onSrcObjectReady(value: MediaStream, srcObject: MediaStream) {
	log('system', value, 'onSrcObjectReady');
	srcObject = value;
	return srcObject;
}

export { onSrcObjectReady };
