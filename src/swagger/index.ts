// swaggerOptions.ts
import swaggerJsDoc, { Options } from 'swagger-jsdoc';
import tags from './swaggerTags';
import paths from './paths';

const swaggerOptions: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API Title',
            version: '1.0.0',
            description: 'Your API Description',

        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],

        servers: [
            {
                url: "http://localhost:5000/api",
                description: "Development server"
            }
        ],
        tags,
        paths
    },
    apis: []
};


const swaggerSpecs = swaggerJsDoc(swaggerOptions);

export default swaggerSpecs 
