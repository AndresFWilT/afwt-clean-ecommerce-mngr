const serverConfig = {
    API_BASE_PATH: process.env.API_BASE_PATH ?? '/api/v1',
    DEBUG: process.env.DEBUG ?? 'afwt-ecommerce:*',
    PORT: process.env.PORT ?? '9080',
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ?? 'domain1,domain2',
};

const postgresConfig = {
    DB_USERNAME: process.env.DB_USERNAME ?? 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD ?? 'postgres',
    DB_HOST:     process.env.DB_HOST     ?? 'db',
    DB_PORT:     process.env.DB_PORT     ?? '5432',
    DB_NAME:     process.env.DB_NAME     ?? 'ecommerce',
}

const authConfig = {
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY ?? './secrets/private.pem',
    JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY ?? './secrets/public.pem',
    JWT_EXPIRES_IN: Number(process.env.JWT_EXPIRES_IN) ?? 3600,
}

export default {
    authConfig: authConfig,
    postgresConfig: postgresConfig,
    serverConfig: serverConfig,
};
