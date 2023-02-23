module.exports = {
    extends: "./.eslintrc.js",
    overrides: [
        {
            files: ['package.json'],
            plugins: ['eslint-plugin-n8n-nodes-base'],
            rules: {
                'n8n-nodes-base/community-package-json-name-still-default': 'error',
                'n8n-nodes-base/node-param-default-missing': 'off',
                'n8n-nodes-base/node-class-description-icon-not-svg': 'off',
            },
        },
    ],
};
