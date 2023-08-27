const productPath = {
    '/products': {
        post: {
            tags: ['Product'],
            summary: 'Create New Product ',
            parameters: [
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
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            properties: {
                                image: {
                                    type: "file",
                                    description: "product image"
                                },
                                name: {
                                    type: 'string',
                                    description: 'The name of the product.',
                                },
                                description: {
                                    type: 'string',
                                    description: 'The description of the user.',
                                },
                            },
                            required: ['name', 'description'],
                        },
                    },
                },
            },
            responses: {
                '201': {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: {
                                // Response body schema definition here
                                type: 'object',
                                properties: {
                                    type: { type: 'string' },
                                    product: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer' },
                                            userId: { type: 'integer' },
                                            name: { type: 'string' },
                                            description: { type: 'string' },
                                            createdAt: { type: 'string' },
                                            updatedAt: { type: 'string' },
                                            user: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'integer' },
                                                    name: { type: 'string' },
                                                    email: { type: 'string' },
                                                }
                                            },
                                            media: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        id: { type: 'integer' },
                                                        productId: { type: 'integer' },
                                                        image_url: { type: 'string' },
                                                        storage_key: { type: 'string' },
                                                        isMain: { type: 'boolean' },
                                                        createdAt: { type: 'string' },
                                                        updatedAt: { type: 'string' },
                                                    }
                                                }
                                            },
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
                '500': {
                    description: 'Internal Server Error',
                }
            },
        },
    },

    '/products/{id}': {
        get: {
            tags: ['Product'],

            summary: 'Get product data by ID',
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
                                    product: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer' },
                                            userId: { type: 'integer' },
                                            name: { type: 'string' },
                                            description: { type: 'string' },
                                            createdAt: { type: 'string' },
                                            updatedAt: { type: 'string' },
                                            user: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'integer' },
                                                    name: { type: 'string' },
                                                    email: { type: 'string' },
                                                }
                                            },
                                            media: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        id: { type: 'integer' },
                                                        productId: { type: 'integer' },
                                                        image_url: { type: 'string' },
                                                        storage_key: { type: 'string' },
                                                        isMain: { type: 'boolean' },
                                                        createdAt: { type: 'string' },
                                                        updatedAt: { type: 'string' },
                                                    }
                                                }
                                            },
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
        delete: {
            tags: ['Product'],
            summary: 'Delete product',
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
                                type: 'object',
                                properties: {
                                    type: { type: 'string' },
                                },
                            },
                        }
                    }
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
    }
}

export default productPath