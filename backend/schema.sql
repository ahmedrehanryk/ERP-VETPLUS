-- Minimal MySQL schema for Gluon-like ERP (manufacturing focused)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vendors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  phone VARCHAR(64),
  city VARCHAR(64),
  address VARCHAR(255),
  opening_balance DECIMAL(14,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  phone VARCHAR(64),
  city VARCHAR(64),
  address VARCHAR(255),
  opening_balance DECIMAL(14,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sku VARCHAR(64) UNIQUE,
  name VARCHAR(160) NOT NULL,
  category VARCHAR(80),
  uom VARCHAR(16) DEFAULT 'kg',
  cost DECIMAL(14,4) DEFAULT 0,
  price DECIMAL(14,4) DEFAULT 0,
  is_raw TINYINT(1) DEFAULT 0,
  is_finished TINYINT(1) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS inventory_movements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT NOT NULL,
  warehouse_id INT DEFAULT 1,
  qty DECIMAL(14,3) NOT NULL,
  cost DECIMAL(14,4) DEFAULT 0,
  reason VARCHAR(80),
  ref_type VARCHAR(16),
  ref_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id)
);

CREATE TABLE IF NOT EXISTS purchase_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vendor_id INT NOT NULL,
  order_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'OPEN',
  notes VARCHAR(255),
  FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

CREATE TABLE IF NOT EXISTS purchase_order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  purchase_order_id INT NOT NULL,
  item_id INT NOT NULL,
  qty DECIMAL(14,3) NOT NULL,
  price DECIMAL(14,4) NOT NULL,
  FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id),
  FOREIGN KEY (item_id) REFERENCES items(id)
);

CREATE TABLE IF NOT EXISTS goods_receipts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  purchase_order_id INT NOT NULL,
  received_date DATE NOT NULL,
  FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id)
);

CREATE TABLE IF NOT EXISTS sales_invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  city VARCHAR(64),
  invoice_date DATE NOT NULL,
  total DECIMAL(14,2) DEFAULT 0,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS sales_invoice_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sales_invoice_id INT NOT NULL,
  item_id INT NOT NULL,
  qty DECIMAL(14,3) NOT NULL,
  price DECIMAL(14,4) NOT NULL,
  FOREIGN KEY (sales_invoice_id) REFERENCES sales_invoices(id),
  FOREIGN KEY (item_id) REFERENCES items(id)
);

CREATE TABLE IF NOT EXISTS bom (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  output_item_id INT NOT NULL,
  output_qty DECIMAL(14,3) NOT NULL,
  FOREIGN KEY (output_item_id) REFERENCES items(id)
);

CREATE TABLE IF NOT EXISTS bom_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bom_id INT NOT NULL,
  item_id INT NOT NULL,
  qty DECIMAL(14,3) NOT NULL,
  FOREIGN KEY (bom_id) REFERENCES bom(id),
  FOREIGN KEY (item_id) REFERENCES items(id)
);

CREATE TABLE IF NOT EXISTS work_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bom_id INT NOT NULL,
  quantity DECIMAL(14,3) NOT NULL,
  warehouse_id INT DEFAULT 1,
  status VARCHAR(20) DEFAULT 'OPEN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bom_id) REFERENCES bom(id)
);

CREATE TABLE IF NOT EXISTS qc_tests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  parameter VARCHAR(160) NOT NULL,
  unit VARCHAR(16),
  min_value DECIMAL(14,3),
  max_value DECIMAL(14,3)
);

CREATE TABLE IF NOT EXISTS qc_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT NOT NULL,
  batch_no VARCHAR(60),
  qc_test_id INT NOT NULL,
  value DECIMAL(14,3) NOT NULL,
  tested_at DATE NOT NULL,
  passed TINYINT(1) DEFAULT 1,
  FOREIGN KEY (item_id) REFERENCES items(id),
  FOREIGN KEY (qc_test_id) REFERENCES qc_tests(id)
);

CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  expense_date DATE NOT NULL,
  category VARCHAR(80),
  description VARCHAR(255),
  amount DECIMAL(14,2) NOT NULL
);
