import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import packageJson from 'file:///app/package.json' assert { type: 'json' };


const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title:
                'Suma Tickets REST API Docs',
            version: packageJson.version,
            description: 'A simple Express API with Swagger documentation',
        },
    },
    apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
    // swagger page
    console.log('swagger');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // docs in json format
    app.get('docs.json', (request, response) => {
        response.setHeader('Content-Type', 'application/json');
        response.send(swaggerSpec);
    });

    // todo use logger;
    console.info(`Docs available at http://localhost:${port}/api/docs`);
}

export default swaggerDocs;
