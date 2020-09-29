import { renderEditor } from 'jest-remirror';

test('renders Editor', () => {
  const {
    add,
    view,
    nodes: { p, doc },
  } = renderEditor();

  add(doc(p('Hello world')));

  expect(view.dom.innerHTML).toMatchInlineSnapshot(`
    <p>
      Hello world
    </p>
  `);
});
