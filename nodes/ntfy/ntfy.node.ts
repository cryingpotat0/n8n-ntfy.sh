import { IExecuteFunctions } from 'n8n-core';
import { INodeType, INodeTypeDescription, INodeExecutionData, IHttpRequestOptions } from 'n8n-workflow';

enum Priority {
    Min = 1,
    Low = 2,
    Default = 3,
    High = 4,
    Urgent = 5,
};

export class ntfy implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'ntfy',
        name: 'ntfy',
        icon: 'file:ntfy.png',
        description: 'Send a ntfy.sh message',
        inputs: ['main'],
        outputs: ['main'],
        defaults: {
            name: 'ntfy',
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
                noDataExpression: true,
                options: Object.keys(Priority).filter(p => isNaN(parseInt(p))).map(pStr => ({
                    name: pStr,
                    value: Priority[pStr as any],
                })),
                default: Priority.Default,
            },
            {
                displayName: 'Tags',
                name: 'tags',
                type: 'string',
                default: '',
            },
        ],
    }

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData = [];

        for (let i = 0; i < items.length; i++) {
            let body: any = {};

            for (const field of ['topic', 'message', 'title', 'priority']) {
                body[field] = this.getNodeParameter(field, i) as string;
            }

            body.tags = this.getNodeParameter('tags', i)?.toString().replace(/\s/, '').split(',');

            const options: IHttpRequestOptions = {
                method: 'POST',
                body: JSON.stringify(body),
                url: `https://ntfy.sh`,
                json: true,
            };
            const responseData = await this.helpers.httpRequest(options)
            returnData.push(responseData);
        }

        return [this.helpers.returnJsonArray(returnData)]
    }
}
