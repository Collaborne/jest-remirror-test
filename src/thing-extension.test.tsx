import { extensionValidityTest, renderEditor } from 'jest-remirror';

import { ThingExtension } from './thing-extension';

extensionValidityTest(ThingExtension);

function create() {
	return renderEditor([new ThingExtension()]);
}

describe('commands', () => {
	it('#createThing', () => {
		const {
			add,
			view,
			nodes: { p, doc },
			commands,
		} = create();

		add(doc(p('')));
		commands.createThing({ id: '1' });

		expect(view.dom.innerHTML).toMatchInlineSnapshot('"<thing></thing><p><br></p>"');
	});
});
