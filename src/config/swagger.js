import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restest API',
      version: '1.0.0',
      description:
        'API REST para loja de produtos eletrônicos.\n\n' +
        '## Autenticação\n' +
        'Endpoints protegidos exigem um token JWT no header:\n' +
        '```\nAuthorization: Bearer <token>\n```\n' +
        'Obtenha o token via `POST /api/auth/login`.',
      contact: {
        name: 'Janssen Batista',
        email: 'batistajanssen.qa@gmail.com',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:{port}',
        description: 'API Local',
        variables: {
          port: {
            default: '3000',
            description: 'Porta do servidor (definida na variável PORT do .env)',
          },
        },
      },
      {
        url: 'https://api.restest.shop',
        description: 'API remota',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido via POST /api/auth/login',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 1 },
            username: { type: 'string', example: 'nome_do_usuario' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'id do produto' },
            name: { type: 'string', example: 'Nome do produto' },
            description: {
              type: 'string',
              example: 'Descrição do produto',
            },
            price: { type: 'number', format: 'float', example: 4999.99 },
            promoPrice: {
              type: 'number',
              format: 'float',
              nullable: true,
              example: 4499.99,
            },
            imageUrl: {
              type: 'string',
              format: 'uri',
              example: 'https://example.com/images/notebook.jpg',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        LoginInput: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', format: 'string', example: 'usuario_padrao' },
            password: { type: 'string', format: 'password', example: 'senha_segura' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Login realizado com sucesso.' },
            user: { $ref: '#/components/schemas/User' },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
        PaginatedProducts: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Product' },
            },
            meta: {
              type: 'object',
              properties: {
                total: { type: 'integer', example: 42 },
                page: { type: 'integer', example: 1 },
                limit: { type: 'integer', example: 10 },
                totalPages: { type: 'integer', example: 5 },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer', example: 400 },
            message: { type: 'string', example: 'Mensagem de erro.' },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer', example: 422 },
            message: { type: 'string', example: 'Erro de validação.' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'username' },
                  message: { type: 'string', example: 'Nome de usuário inválido.' },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Health', description: 'Status da API' },
      { name: 'Auth', description: 'Autenticação e cadastro de usuários' },
      { name: 'Products', description: 'Gerenciamento de produtos eletrônicos' },
    ],
  },
  apis: ['./src/modules/**/*.routes.js', './src/app.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
