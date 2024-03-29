import { IExecuteFunctions } from 'n8n-core';
import { IHttpRequestOptions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';

enum Priority {
	Min = 1,
	Low = 2,
	Default = 3,
	High = 4,
	Urgent = 5,
}

type AdditionalFields = {
	alternate_url?: string;
	bearer_token?: string;
};

export class Ntfy implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Ntfy',
		name: 'Ntfy',
		icon: 'file:ntfy.png',
		description: 'Send a ntfy.sh message',
		inputs: ['main'],
		outputs: ['main'],
		defaults: {
			name: 'Ntfy',
		},
		group: ['transform'],
		version: 1,
		properties: [
			// There is only a single resource and operation (send notification).
			{
				displayName: 'Topic',
				name: 'topic',
				type: 'string',
				required: true,
				default: '',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				required: true,
				default: '',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options',
				default: Priority.Default,
				noDataExpression: true,
				options: Object.keys(Priority).filter(p => isNaN(parseInt(p, 10))).map(pStr => ({
					name: pStr,
					value: Priority[pStr as unknown as Priority],
				})),
			},
			{
				displayName: 'Click URL',
				name: 'click',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Additional Fields',
				name: 'additional_fields',
				type: 'collection',
				default: {},
				options: [
					{
						displayName: 'Alternate ntfy.sh Server URL',
						name: 'alternate_url',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Authentication Token (Bearer)',
						name: 'bearer_token',
						type: 'string',
						default: '',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData = [];

		for (let i = 0; i < items.length; i++) {
			const body: {
				[k: string]: string | string[] | undefined
			} = {};


			for (const field of ['topic', 'message', 'title', 'priority', 'click']) {
				body[field] = this.getNodeParameter(field, i) as string;
			}

			body.tags = this.getNodeParameter('tags', i)?.toString().replace(/\s/, '').split(',');

			const ntfyUrl = (this.getNodeParameter('additional_fields', i) as AdditionalFields)?.alternate_url;
			const ntfyBearerToken = (this.getNodeParameter('additional_fields', i) as AdditionalFields)?.bearer_token;
			console.log(`Using ${ntfyUrl} as ntfy.sh server`);

			const options: IHttpRequestOptions = {
				method: 'POST',
				body: JSON.stringify(body),
				url: ntfyUrl || `https://ntfy.sh`,
				json: true,
			};

			if (ntfyBearerToken) {
				console.log(`Using bearer token`);
				options.headers = {
					Authorization: `Bearer ${ntfyBearerToken}`,
				};
			}

			const responseData = await this.helpers.httpRequest(options);
			returnData.push(responseData);
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
