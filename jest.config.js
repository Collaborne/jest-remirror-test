module.exports = {
  setupFilesAfterEnv: ['jest-remirror/environment'],
  testEnvironment: 'jsdom', // Required for dom manipulation
	transform: {
		'^.+\\.[t|j]sx?$': 'babel-jest',
	},
};
