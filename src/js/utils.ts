const answers = document.querySelector('#answers') as HTMLDivElement;

function log(role: $TSFixMe, msg: $TSFixMe, type: $TSFixMe) {
	const timestamp = timeDisplay();
	let roleLabel = role;
	if (type === 'onError') {
		roleLabel = '⚠️ SYSTEM';
	} else if (type === 'speak') {
		roleLabel = '💬 ASSISTANT';
	} else if (role === 'assistant') {
		roleLabel = '🤖 ASSISTANT';
	} else if (role === 'system') {
		roleLabel = '⚙️ SYSTEM';
	} else if (role === 'user') {
		roleLabel = '👤 USER';
	}

	const string = `[${roleLabel}] ${type}`;
	let htmlString = `<p class="${role}"><span class="timestamp">${timestamp} - </span>${string}`;
	if (msg && typeof msg === 'string') htmlString += ` : ${msg}`;
	htmlString += '</p>';

	answers.innerHTML += htmlString;
	console.warn(timestamp, string, ':', msg);
}

// JS Utility Functions:
// 'cleaner' time display in (HH:MM:SS)
function timeDisplay() {
	const currentTime = new Date();
	const hours = currentTime.getHours().toString().padStart(2, '0');
	const minutes = currentTime.getMinutes().toString().padStart(2, '0');
	const seconds = currentTime.getSeconds().toString().padStart(2, '0');
	const formattedTime = `${hours}:${minutes}:${seconds}`;
	return formattedTime;
}

export { log, timeDisplay };
