import {
    IAuthenticateGeneric,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class ntfyApi implements ICredentialType {
    name = 'ntfyApi';
    displayName = 'Ntfy API';
    // Uses the link to this tutorial as an example
    // Replace with your own docs links when building your own nodes
    documentationUrl = 'https://docs.n8n.io/integrations/creating-nodes/build/declarative-style-node/';
    properties: INodeProperties[] = [
        {
            displayName: 'Ntfy Topic Name',
            name: 'apiKey',
            type: 'string',
            default: '',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            qs: {
                'api_key': '={{$credentials.apiKey}}'
            }
        },
    } as IAuthenticateGeneric;
}
