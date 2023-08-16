const authPath = {
    '/auth/signup': {
        post: {
            tags: ['Authentication'],
            summary: 'New user Registration',
            security: [],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                    description: 'The name of the user.',
                                },
                                email: {
                                    type: 'string',
                                    description: 'The email address of the user.',
                                },
                                password: {
                                    type: 'string',
                                    description: 'The password of the user.',
                                },
                            },
                            required: ['name', 'email', 'password'],
                        },
                    },
                },
            },
            responses: {
                '201': {
                    description: 'Signup successful',
                    content: {
                        'application/json': {
                            schema: {
                                // Response body schema definition here
                                type: 'object',
                                properties: {
                                    type: { type: 'string' },
                                    user: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer' },
                                            name: { type: 'string' },
                                            email: { type: 'string' },
                                            password: { type: 'string' },
                                            createdAt: { type: 'string' },
                                            updatedAt: { type: 'string' },
                                        },
                                    },
                                    accessToken: { type: "string" }
                                },
                            },
                        }
                    }
                },
                '400': {
                    description: 'Bad Request',
                },
                '500': {
                    description: 'Internal Server Error',
                }
            },
        },
    },
    '/auth/login': {
        post: {
            tags: ['Authentication'],
            summary: 'User Login',
            security: [],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                email: {
                                    type: 'string',
                                    description: 'The email address of the user.',
                                },
                                password: {
                                    type: 'string',
                                    description: 'The password of the user.',
                                },
                            },
                            required: ['email', 'password'],
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'login successful',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    type: { type: 'string' },
                                    user: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer' },
                                            name: { type: 'string' },
                                            email: { type: 'string' },
                                            password: { type: 'string' },
                                            createdAt: { type: 'string' },
                                            updatedAt: { type: 'string' },
                                        },
                                    },
                                    accessToken: { type: "string" }
                                },
                            },
                        }
                    }
                },
                '400': {
                    description: 'Bad Request',
                },
                '401': {
                    description: 'Invalid Email or Password',
                },
                '500': {
                    description: 'Internal Server Error',
                }
            },
        },
    },
}

export default authPath