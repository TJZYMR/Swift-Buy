CREATE TABLE consumers (
  consumer_id_pk bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  consumer_id varchar(255) NOT NULL,
  consumer_name varchar(255) NOT NULL,
  consumer_email varchar(255) NOT NULL,
  consumer_contact varchar(10) DEFAULT NULL,
  consumer_aadhar_number varchar(12) NOT NULL,
  CONSTRAINT cnst_consumer_email UNIQUE (consumer_email)
);


CREATE TABLE consumer_invoices (
  invoice_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  consumer_id_fk bigint(20) NOT NULL,
  invoice_json varchar(255) DEFAULT NULL,
  CONSTRAINT cnst_consumer_invoices_consumer_id_fk FOREIGN KEY (consumer_id_fk) REFERENCES consumers(consumer_id_pk)
);


CREATE TABLE consumer_wallet_details (
  wallet_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  consumer_id_fk bigint(20) NOT NULL,
  wallet_amount varchar(45) DEFAULT NULL,
  CONSTRAINT cnst_consumer_wallet_details_consumer_id_fk FOREIGN KEY (consumer_id_fk) REFERENCES consumers(consumer_id_pk)
);

CREATE TABLE items (
  item_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  barcode_id varchar(255) DEFAULT NULL,
  item_price int DEFAULT NULL,
  item_name varchar(255) DEFAULT NULL
);