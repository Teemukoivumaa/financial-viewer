CREATE TABLE financials (
    id SERIAL PRIMARY KEY,
    investement character varying(255) NOT NULL,
    amount character varying(255) NOT NULL,
    sum character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

INSERT INTO financials (investement, amount, sum) VALUES 
('Rahasto', '1.456 kpl', '200€'), 
('Osake', '5 kpl', '150€');
