import { log } from './utils.js';

const connectionLabel = document.querySelector('#connectionLabel') as HTMLSpanElement;

function onError(error: Error, errorData?: object) {
	connectionLabel.innerHTML = `<span style="color:red">Something went wrong :(</span>`;
	console.error('Error:', error, 'Error Data', errorData);
	log('system', error, 'onError');
}

export { onError };
