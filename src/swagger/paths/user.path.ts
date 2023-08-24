const userPath = {
    '/users/{id}': {
        get: {
            tags: ['User'],

            summary: 'Get user data by ID',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    description: 'ID of the user',
                    schema: {
                        type: 'integer',
                    },
                },
                {
                    name: 'Authorization',
                    in: 'header',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'Bearer token',
                    example: 'Bearer eyJhbGciOiJIUzI1NiIsIn...',
                },

            ],

            responses: {
                '200': {
                    description: 'Success',
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
                                },
                            },
                        }
                    }
                },
                '400': {
                    description: 'Bad Request',
                },
                '401': {
                    description: "Unauthorized"
                },
                '404': {
                    description: "Not found"
                },
                '500': {
                    description: 'Internal Server Error',
                }
            },
        },
        put: {
            tags: ['User'],

            summary: 'Update',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    description: 'ID of the user',
                    schema: {
                        type: 'integer',
                    },
                },
                {
                    name: 'Authorization',
                    in: 'header',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'Bearer token',
                    example: 'Bearer eyJhbGciOiJIUzI1NiIsIn...',
                },

            ],

            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                email: {
                                    type: 'string',
                                    description: 'user email.',
                                },
                                name: {
                                    type: 'string',
                                    description: 'user name.',
                                },
                            },
                            required: ['email'],
                        },
                    },
                },
            },

            responses: {
                '200': {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: {
                                // Response body schema definition here
                                type: 'object',
                                properties: {
                                    type: { type: 'string' },
                                },
                            },
                        }
                    }
                },
                '400': {
                    description: 'Bad Request',
                },
                '401': {
                    description: "Unauthorized"
                },
                '404': {
                    description: "Not found"
                },
                '500': {
                    description: 'Internal Server Error',
                }
            },
        },
        delete: {
            tags: ['User'],

            summary: 'Delete',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    description: 'ID of the user',
                    schema: {
                        type: 'integer',
                    },
                },
                {
                    name: 'Authorization',
                    in: 'header',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'Bearer token',
                    example: 'Bearer eyJhbGciOiJIUzI1NiIsIn...',
                },

            ],

            responses: {
                '200': {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: {
                                // Response body schema definition here
                                type: 'object',
                                properties: {
                                    type: { type: 'string' },
                                },
                            },
                        }
                    }
                },
                '400': {
                    description: 'Bad Request',
                },
                '401': {
                    description: "Unauthorized"
                },
                '403': {
                    description: "Forbidden"
                },
                '404': {
                    description: "Not found"
                },
                '500': {
                    description: 'Internal Server Error',
                }
            },
        },
    },

}

export default userPath