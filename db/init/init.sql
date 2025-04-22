BEGIN;

CREATE OR REPLACE FUNCTION set_updated_at()
  RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 0. Roles
CREATE TABLE IF NOT EXISTS roles (
    id         INTEGER GENERATED ALWAYS AS IDENTITY CONSTRAINT roles_pkey PRIMARY KEY,
    name       VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
    id           INTEGER GENERATED ALWAYS AS IDENTITY CONSTRAINT users_pkey PRIMARY KEY,
    email        VARCHAR(255) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    name         VARCHAR(255) NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

CREATE TRIGGER trg_users_set_updated_at
    BEFORE UPDATE ON users FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS user_roles (
    user_id  INTEGER NOT NULL
    CONSTRAINT user_roles_user_fk REFERENCES users(id) ON DELETE CASCADE,
    role_id  INTEGER NOT NULL
    CONSTRAINT user_roles_role_fk REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

-- 3. Products
CREATE TABLE IF NOT EXISTS products (
    id           INTEGER GENERATED ALWAYS AS IDENTITY CONSTRAINT products_pkey PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    description  TEXT,
    price        NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    stock        INTEGER NOT NULL CHECK (stock >= 0),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_products_set_updated_at
    BEFORE UPDATE ON products FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- 4. Carts
CREATE TABLE IF NOT EXISTS carts (
    id           INTEGER GENERATED ALWAYS AS IDENTITY CONSTRAINT carts_pkey PRIMARY KEY,
    user_id      INTEGER NOT NULL
    CONSTRAINT carts_user_fk REFERENCES users(id) ON DELETE CASCADE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_carts_set_updated_at
    BEFORE UPDATE ON carts FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- 5. Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
    id           INTEGER GENERATED ALWAYS AS IDENTITY CONSTRAINT cart_items_pkey PRIMARY KEY,
    cart_id      INTEGER NOT NULL
    CONSTRAINT cart_items_cart_fk REFERENCES carts(id) ON DELETE CASCADE,
    product_id   INTEGER NOT NULL
    CONSTRAINT cart_items_product_fk REFERENCES products(id),
    quantity     INTEGER NOT NULL CHECK (quantity > 0),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (cart_id, product_id)
    );

CREATE TRIGGER trg_cart_items_set_updated_at
    BEFORE UPDATE ON cart_items FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- 6. Purchases
CREATE TABLE IF NOT EXISTS purchases (
    id           INTEGER GENERATED ALWAYS AS IDENTITY CONSTRAINT purchases_pkey PRIMARY KEY,
    user_id      INTEGER NOT NULL
    CONSTRAINT purchases_user_fk REFERENCES users(id) ON DELETE RESTRICT,
    total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount >= 0),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Purchase Items
CREATE TABLE IF NOT EXISTS purchase_items (
    id            INTEGER GENERATED ALWAYS AS IDENTITY CONSTRAINT purchase_items_pkey PRIMARY KEY,
    purchase_id   INTEGER NOT NULL
    CONSTRAINT purchase_items_purchase_fk REFERENCES purchases(id) ON DELETE CASCADE,
    product_id    INTEGER NOT NULL
    CONSTRAINT purchase_items_product_fk REFERENCES products(id),
    quantity      INTEGER NOT NULL CHECK (quantity > 0),
    unit_price    NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price   NUMERIC(14,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (purchase_id, product_id)
);

CREATE TRIGGER trg_purchase_items_set_updated_at
    BEFORE UPDATE ON purchase_items FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- 8. Stock‐decrement function & trigger
CREATE OR REPLACE FUNCTION decrement_product_stock()
  RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
        SET stock = stock - NEW.quantity
        WHERE id = NEW.product_id
            AND stock >= NEW.quantity;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Insufficient stock for product %', NEW.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach to purchase_items before insertion
CREATE TRIGGER trg_purchase_items_decrement_stock
    BEFORE INSERT ON purchase_items
    FOR EACH ROW
    EXECUTE FUNCTION decrement_product_stock();

COMMIT;

-- Seed Roles
INSERT INTO roles (name, description)
VALUES
    ('CUSTOMER', 'Can browse and buy products'),
    ('ADMIN', 'Can manage the platform and products')
    ON CONFLICT (name) DO NOTHING;

-- Seed Users
INSERT INTO users (email, password, name)
VALUES
    ('andres.wilches@example.com', 'hashed_password_1', 'Andres Wilches'),
    ('maria.lopez@example.com', 'hashed_password_2', 'Maria Lopez')
    ON CONFLICT (email) DO NOTHING;

-- Seed UserRoles
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
         JOIN roles r ON
    (u.email = 'andresfwilchest@gmail.com' AND r.name = 'CUSTOMER')
        OR
    (u.email = 'marialopez@gmail.com' AND r.name = 'ADMIN')
    ON CONFLICT DO NOTHING;

