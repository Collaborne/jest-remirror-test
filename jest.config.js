module.exports = {
	setupFilesAfterEnv: ['jest-extended', 'jest-remirror/environment'],
  testEnvironment: 'jsdom', // Required for dom manipulation
	transform: {
		'^.+\\.[t|j]sx?$': 'babel-jest',
	},
};
