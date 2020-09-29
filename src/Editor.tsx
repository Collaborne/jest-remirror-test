import React from 'react';
import { CorePreset } from 'remirror/preset/core';
import { RemirrorProvider, useManager, useRemirror } from 'remirror/react';

import { ThingExtension } from './thing-extension';

const CONTENT = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'thing',
          attrs: {
            id: '42',
          },
        },
      ],
    },
  ],
};

const TextEditor = () => {
  const { getRootProps, setContent } = useRemirror();

  React.useEffect(() => {
    setTimeout(() => setContent(CONTENT), 1);
  }, [setContent]);

  return <div {...getRootProps()} />;
};

export const Editor = () => {
  const manager = useManager([
    new CorePreset({}),
    new ThingExtension(),
  ]);

  return (
    <RemirrorProvider manager={manager}>
      <TextEditor />
    </RemirrorProvider>
  );
};
