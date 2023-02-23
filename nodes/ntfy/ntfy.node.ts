import { IExecuteFunctions } from 'n8n-core';
import { IHttpRequestOptions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';

enum Priority {
    Min = 1,
    Low = 2,
    Default = 3,
    High = 4,
    Urgent = 5,
}

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

            console.log(body)

            body.tags = this.getNodeParameter('tags', i)?.toString().replace(/\s/, '').split(',');

            const options: IHttpRequestOptions = {
                method: 'POST',
                body: JSON.stringify(body),
                url: `https://ntfy.sh`,
                json: true,
            };
            const responseData = await this.helpers.httpRequest(options);
            returnData.push(responseData);
        }

        return [this.helpers.returnJsonArray(returnData)];
    }
}
