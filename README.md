# n8n-nodes-ntfy.sh

This is an n8n community node. It lets you use [ntfy.sh](https://ntfy.sh) in your n8n workflows.

[Installation](#installation)  
[Operations](#operations)  
[Compatibility](#compatibility)  
[Roadmap](#roadmap)  <!-- delete if not using this section -->  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

Only a single operation is supported right now to send a notification.
![alt ntfy sample operation](https://github.com/raghavanand98/n8n-ntfy.sh/blob/master/sample.png?raw=true)

## Compatibility

Tested against 0.212.0.

## Roadmap


The broad roadmap is to support all parameters in the [ntfy API](https://docs.ntfy.sh/publish/#publish-as-json). Roughly the order of this will likely be:
- [X] Click
- [ ] Actions
- [X] Custom ntfy.sh server support
- [ ] All other params
- [ ] Better validation of correctness and error messages
- [ ] QoL improvements: allow selecting from a list of emojis
- [ ] Improve the security model for the topic name since it's effectively a secret.
- [ ] Add documentation for local development
- [ ] Add tests

