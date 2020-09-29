import React, { ComponentType } from 'react';
import {
	ApplySchemaAttributes,
	extensionDecorator,
	ExtensionPriority,
	ExtensionTag,
	NodeExtension,
	NodeExtensionSpec,
	NodeGroup,
	ProsemirrorAttributes,
	CommandFunction,
	invariant,
	ErrorConstant,
} from '@remirror/core';
import { NodeViewComponentProps } from 'remirror/extension/react-component';
import { TextSelection } from 'prosemirror-state';

export interface ThingExtensionAttributes {
	id: string;
}
export type RenderThing = (
	thingId: string,
) => React.ReactElement<HTMLElement> | null;

export interface ThingOptions {
	renderThing?: RenderThing;
}

/**
 * Name of the node to be inserted after each thing
 */
const INSERTION_NODE = 'paragraph';

@extensionDecorator<ThingOptions>({
	defaultOptions: {
		renderThing: (thingId: string) => <div>{thingId}</div>,
	},
	defaultPriority: ExtensionPriority.Medium,
})
export class ThingExtension extends NodeExtension<ThingOptions> {
	get name() {
		return 'thing' as const;
	}

	readonly extensionTags = [ExtensionTag.LastNodeCompatible] as const;

	createNodeSpec(extra: ApplySchemaAttributes): NodeExtensionSpec {
		return {
			group: NodeGroup.Block,
			attrs: {
				...extra.defaults(),
				id: {},
			},
			draggable: true,
			parseDOM: [
				{
					tag: 'thing',
					getAttrs: node => ({
						...extra.parse(node),
					}),
				},
			],
			toDOM: node => ['thing', {
				...extra.dom(node),
				id: node.attrs.id,
			}, 0],
		};
	}

	ReactComponent: ComponentType<NodeViewComponentProps> = ({ node }) =>
		this.options.renderThing(node.attrs.id);

	createCommands() {
		return {
			createThing: (
				attributes: ProsemirrorAttributes<ThingExtensionAttributes>,
			): CommandFunction => parameter => {
				const { tr, dispatch, state } = parameter;

				if (!dispatch) {
					return true;
				}

				// Create the thing node
				tr.replaceSelectionWith(this.type.create(attributes));

				const pos = tr.selection.$anchor.pos + 1;
				const nodes = state.schema.nodes;

				if (INSERTION_NODE) {
					const type = nodes[INSERTION_NODE];

					invariant(type, {
						code: ErrorConstant.EXTENSION,
						message: `'${INSERTION_NODE}' node provided as the insertionNode to the '${ThingExtension.name}' does not exist.`,
					});

					// Insert the new node and set the selection inside that node.
					tr.insert(
						pos,
						state.schema.nodes[INSERTION_NODE].create(),
					).setSelection(TextSelection.create(tr.doc, pos));
				}

				dispatch(tr.scrollIntoView());

				return true;
			},
		};
	}
}
