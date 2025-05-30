module.exports = {
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: '2022'
	},
	root: true,
	extends: ['@das.laboratory/eslint-config-interactive-ts'],
	rules: {
		'prefer-const': 'error'
	},
	global: {
		$TSFixMe: 'readonly'
	}
};
