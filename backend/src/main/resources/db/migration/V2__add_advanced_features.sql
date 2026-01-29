-- Migration for Advanced User Management and Theme Builder
-- Create tables for addresses, payment methods, affiliate products, themes, etc.

-- Create addresses table
CREATE TABLE addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    type VARCHAR(20) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    street_number VARCHAR(50) NOT NULL,
    complement VARCHAR(255),
    neighborhood VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'Brasil',
    reference_point VARCHAR(500),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_address_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create payment_methods table
CREATE TABLE payment_methods (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    card_holder_name VARCHAR(255),
    card_last_four VARCHAR(4),
    card_brand VARCHAR(50),
    card_expiry_month INTEGER,
    card_expiry_year INTEGER,
    gateway_token VARCHAR(500),
    gateway_customer_id VARCHAR(255),
    is_default BOOLEAN DEFAULT FALSE,
    created_at DATE DEFAULT CURRENT_DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_method_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create affiliate_products table
CREATE TABLE affiliate_products (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    custom_slug VARCHAR(255),
    enable_comparison BOOLEAN DEFAULT TRUE,
    best_price DECIMAL(10,2),
    best_platform VARCHAR(100),
    last_price_check TIMESTAMP,
    click_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    total_commission DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_affiliate_product_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT uk_affiliate_product_custom_slug UNIQUE (custom_slug)
);

-- Create affiliate_platforms table
CREATE TABLE affiliate_platforms (
    id BIGSERIAL PRIMARY KEY,
    affiliate_product_id BIGINT NOT NULL,
    platform_name VARCHAR(100) NOT NULL,
    platform_url TEXT NOT NULL,
    affiliate_id VARCHAR(255),
    current_price DECIMAL(10,2),
    stock INTEGER,
    currency VARCHAR(10) DEFAULT 'BRL',
    last_sync TIMESTAMP,
    tracking_params TEXT,
    click_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    commission_rate DECIMAL(5,4),
    logo_url VARCHAR(500),
    display_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_affiliate_platform_affiliate_product FOREIGN KEY (affiliate_product_id) REFERENCES affiliate_products(id) ON DELETE CASCADE
);

-- Create themes table
CREATE TABLE themes (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    theme_key VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    preview_image VARCHAR(500),
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create theme_settings table
CREATE TABLE theme_settings (
    id BIGSERIAL PRIMARY KEY,
    theme_id BIGINT UNIQUE,
    primary_color VARCHAR(20) DEFAULT '#3f51b5',
    secondary_color VARCHAR(20) DEFAULT '#ff4081',
    accent_color VARCHAR(20) DEFAULT '#4caf50',
    background_color VARCHAR(20) DEFAULT '#ffffff',
    surface_color VARCHAR(20) DEFAULT '#f5f5f5',
    text_primary_color VARCHAR(20) DEFAULT '#212121',
    text_secondary_color VARCHAR(20) DEFAULT '#757575',
    font_family VARCHAR(255) DEFAULT 'Roboto, sans-serif',
    font_size_base VARCHAR(20) DEFAULT '16px',
    spacing_unit VARCHAR(20) DEFAULT '8px',
    border_radius_small VARCHAR(20) DEFAULT '4px',
    border_radius_medium VARCHAR(20) DEFAULT '8px',
    border_radius_large VARCHAR(20) DEFAULT '#12px',
    container_max_width VARCHAR(20) DEFAULT '1200px',
    header_height VARCHAR(20) DEFAULT '64px',
    footer_height VARCHAR(20) DEFAULT '200px',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_theme_settings_theme FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE
);

-- Create theme_sections table
CREATE TABLE theme_sections (
    id BIGSERIAL PRIMARY KEY,
    theme_id BIGINT NOT NULL,
    section_key VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    name VARCHAR(255),
    position INTEGER,
    is_visible BOOLEAN DEFAULT TRUE,
    is_locked BOOLEAN DEFAULT FALSE,
    config TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_theme_section_theme FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE
);

-- Create theme_components table
CREATE TABLE theme_components (
    id BIGSERIAL PRIMARY KEY,
    section_id BIGINT NOT NULL,
    component_key VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    name VARCHAR(255),
    position INTEGER,
    config TEXT,
    slot_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_theme_component_section FOREIGN KEY (section_id) REFERENCES theme_sections(id) ON DELETE CASCADE
);

-- Create product_images table (for multiple images)
CREATE TABLE product_images (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_image_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create product_tags table (for tags)
CREATE TABLE product_tags (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    tag VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_tag_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT uk_product_tag UNIQUE (product_id, tag)
);

-- Add new columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS tax_id VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at DATE DEFAULT CURRENT_DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS newsletter_opt_in BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS sms_opt_in BOOLEAN DEFAULT FALSE;

-- Add new columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS min_stock_alert INTEGER DEFAULT 5;
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight DECIMAL(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE products ADD COLUMN IF NOT EXISTS specifications TEXT;

-- Create indexes for better performance
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_type ON addresses(type);
CREATE INDEX idx_addresses_is_default ON addresses(is_default);
CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_type ON payment_methods(type);
CREATE INDEX idx_affiliate_products_product_id ON affiliate_products(product_id);
CREATE INDEX idx_affiliate_products_custom_slug ON affiliate_products(custom_slug);
CREATE INDEX idx_affiliate_platforms_affiliate_product_id ON affiliate_platforms(affiliate_product_id);
CREATE INDEX idx_affiliate_platforms_platform_name ON affiliate_platforms(platform_name);
CREATE INDEX idx_affiliate_platforms_is_active ON affiliate_platforms(is_active);
CREATE INDEX idx_themes_is_active ON themes(is_active);
CREATE INDEX idx_themes_is_published ON themes(is_published);
CREATE INDEX idx_theme_sections_theme_id ON theme_sections(theme_id);
CREATE INDEX idx_theme_components_section_id ON theme_components(section_id);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_tags_product_id ON product_tags(product_id);
CREATE INDEX idx_product_tags_tag ON product_tags(tag);

-- Update existing users with first_name and last_name from name
UPDATE users SET 
    first_name = SPLIT_PART(name, ' ', 1),
    last_name = CASE 
        WHEN POSITION(' ' IN name) > 0 THEN SUBSTRING(name FROM POSITION(' ' IN name) + 1)
        ELSE ''
    END
WHERE first_name IS NULL OR last_name IS NULL;

-- Insert default theme
INSERT INTO themes (name, description, theme_key, is_active, is_published, created_by)
VALUES (
    'Default Theme',
    'Default theme for the e-commerce platform',
    'default-theme',
    TRUE,
    TRUE,
    'system'
);

-- Insert default theme settings
INSERT INTO theme_settings (theme_id)
SELECT id FROM themes WHERE theme_key = 'default-theme';