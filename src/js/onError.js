import { log } from './utils.js';

const connectionLabel = document.querySelector('#connectionLabel');

function onError(error, errorData) {
	connectionLabel.innerHTML = `<span style="color:red">Something went wrong :(</span>`;
	console.log('Error:', error, 'Error Data', errorData);
	log('system', error, 'onError');
}

export { onError };
