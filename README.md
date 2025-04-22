# afwt-clean-ecommerce-mngr

## Table of Contents
- [Description](#description)
- [Architecture Overview](#architecture-overview)
- [Security](#security)
- [API Endpoints](#api-endpoints)
    - [Authentication](#authentication)
    - [Products](#products)
    - [Cart](#cart)
    - [Purchases](#purchases)

## Description

Develop a basic e-commerce platform that allows users to browse products, add them to a shopping cart, and complete purchases.

### Technical Requirements
- Implement an API for user authentication (JWT, OAuth, or another secure method).
- Create a CRUD module to manage products (name, description, price, stock).
- Develop a shopping cart module.
- Create an endpoint to access a user's purchase history.

## Architecture Overview

This project follows the Hexagonal Architecture (Ports and Adapters) pattern with a clear separation between layers:

```shell
├── prisma/                         # Prisma schema definition
├── secrets/                       # JWT private/public RSA keys
├── src/
│   ├── adapter/                   # HTTP layer (controllers, routes, middlewares)
│   │   ├── controller/            # REST controllers by domain
│   │   ├── middleware/            # Role-based auth, validation
│   │   └── route/                 # Route configuration per domain
│   ├── config/                    # Environment configuration and logging
│   ├── domain/                    # Core business logic (Entities, DTOs, Ports)
│   │   ├── dto/                   # Data Transfer Objects for all layers
│   │   ├── entity/                # Business entities with getters
│   │   └── port/                  # Inbound and outbound ports (interfaces)
│   ├── infrastructure/
│   │   ├── adapter/http/          # Response factory, error handler, JWT adapter
│   │   ├── bootstrap/             # Server runner
│   │   └── persistence/prisma/    # Prisma adapters implementing out ports
│   ├── usecase/                   # Application services implementing in ports
│   └── util/                      # UUID validation and reusable helpers
├── main.ts                        # App entrypoint
└── tsconfig.json                  # TypeScript configuration

```

## Security

This project uses asymmetric encryption with RS256 for JWT authentication, which is a more secure and scalable alternative to symmetric encryption methods like HS256.

| Feature | HS256 (current) | RS256 (recommended) |
| ------- | --------------- | -------------------- |
| Secret management | 1 shared secret (env var) | 1 private + 1 public key |
| Verification by third-party | ❌ Impossible | ✅ You can give the public key |
| Tamper-proof validation | ✅ But less flexible | ✅ More secure, even if public |
| Key rotation | 🔁 Hard (rotate secret everywhere) | 🔁 Easier (rotate private only) |
| Role-based security | ✅ (can embed claims) | ✅ (standard practice) |
| Best practice in prod | ⚠️ Not ideal | ✅ Preferred in OAuth, Auth0, AWS Cognito |

RS256 allows the server to sign tokens using the private key, while clients or services can verify tokens using the public key — even if they don’t know the private key. This separation provides better security, auditing, and microservices scalability.

### Generating Keys
```shell
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```

- private.pem → used by the backend to sign JWTs.
- public.pem → used to verify the JWTs (can be shared with other services).

###  Where to Place the Keys

After generating the keys, place them inside the ./secrets/ directory at the root of the project:

```vbnet
├── secrets
│   ├── private.pem   <-- used internally by backend
│   └── public.pem    <-- can be exposed to services for verification
```

Make sure not to commit private.pem to version control. Add it to your .gitignore.

### CORS Security
The application supports dynamic CORS validation using an environment variable ALLOWED_ORIGINS.

```env
ALLOWED_ORIGINS=https://frontend.example.com,https://admin.example.com
```
This is enforced via middleware, allowing only trusted origins to receive the Access-Control-Allow-Origin header dynamically based on the Origin header in the request, can be implemented via AWS secrets manager too.

---

## API Endpoints

### Authentication
```bash
curl --location 'http://localhost:9080/api/v1/authentication/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "marialopez@gmail.com",
    "password": "654321"
}'
```

### Products

**Create Product**
```bash
curl --request POST http://localhost:9080/api/v1/products \
--header "Authorization: Bearer <AUTH_TOKEN>" \
--header "Content-Type: application/json" \
--header "x-request-id: some-uuid-v4" \
--data '{
  "name": "Laptop Pro 2025",
  "description": "Powerful performance for devs",
  "price": 2599.99,
  "stock": 50
}'
```

**Get All Products**
```bash
curl --request GET "http://localhost:9080/api/v1/products?page=1&limit=10" \
--header "x-request-id: some-uuid-v4"
```

**Get Product by ID**
```bash
curl --request GET http://localhost:9080/api/v1/products/1 \
--header "x-request-id: some-uuid-v4"
```

**Update Product**
```bash
curl --request PUT http://localhost:9080/api/v1/products/1 \
--header "Authorization: Bearer <AUTH_TOKEN>" \
--header "Content-Type: application/json" \
--header "x-request-id: some-uuid-v4" \
--data '{
  "name": "Laptop Pro 2025 - Updated",
  "description": "Updated spec version",
  "price": 2699.99,
  "stock": 45
}'
```

**Delete Product**
```bash
curl --request DELETE http://localhost:9080/api/v1/products/1 \
--header "Authorization: Bearer <AUTH_TOKEN>" \
--header "x-request-id: some-uuid-v4"
```

### Cart

**Add Item to Cart**
```bash
curl -X POST http://localhost:9080/api/v1/cart/items \
  -H "Authorization: Bearer <AUTH_TOKEN>" \
  -H "Content-Type: application/json" \
  -H "X-RqUID: test-uuid" \
  -d '{
        "productId": 1,
        "quantity": 2
      }'
```

**Update Item Quantity**
```bash
curl -X PUT http://localhost:9080/api/v1/cart/items/1 \
  -H "Authorization: Bearer <AUTH_TOKEN>" \
  -H "Content-Type: application/json" \
  -H "X-RqUID: test-uuid" \
  -d '{
        "quantity": 3
      }'
```

**Remove Item from Cart**
```bash
curl -X DELETE http://localhost:9080/api/v1/cart/items/1 \
  -H "Authorization: Bearer <AUTH_TOKEN>" \
  -H "X-RqUID: test-uuid"
```

**Clear Cart**
```bash
curl -X DELETE http://localhost:9080/api/v1/cart \
  -H "Authorization: Bearer <AUTH_TOKEN>" \
  -H "X-RqUID: test-uuid"
```

**Get Cart by User**
```bash
curl --request GET http://localhost:9080/api/v1/cart \
--header "Authorization: Bearer <AUTH_TOKEN>" \
--header "X-RqUID: some-uuid-v4"
```

### Purchases

**Place Purchase**
```bash
curl --location 'http://localhost:9080/api/v1/purchases' \
--request POST \
--header 'Authorization: Bearer <AUTH_TOKEN>' \
--header 'X-RqUID: <UNIQUE-REQUEST-ID>' \
--header 'Content-Type: application/json'
```

**Get Purchase History**
```bash
curl --location 'http://localhost:9080/api/v1/purchases' \
--request GET \
--header 'Authorization: Bearer <AUTH_TOKEN>' \
--header 'X-RqUID: <UNIQUE-REQUEST-ID>'
```

**Get Purchase by ID**
```bash
curl --location 'http://localhost:9080/api/v1/purchases/1' \
--request GET \
--header 'Authorization: Bearer <AUTH_TOKEN>' \
--header 'X-RqUID: <UNIQUE-REQUEST-ID>'
