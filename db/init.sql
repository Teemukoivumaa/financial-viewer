CREATE TABLE financials (
    id SERIAL PRIMARY KEY,
    investement_type character varying(255) NOT NULL,
    investement_name character varying(255) NOT NULL,
    investement_amount character varying(255) NOT NULL,
    investement_course character varying(255) NOT NULL,
    sum character varying(255) NOT NULL,
    currency character varying(255) NOT NULL,
    stock_ticker character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

INSERT INTO financials (investement_type, investement_name, investement_amount, investement_course, sum, currency, stock_ticker) VALUES 
('Rahasto', 'Rahasto 1', '1.456 kpl', '137.362', '200', '€', null),
('Osake', 'Osake 1', '5 kpl', '30', '150', '€', 'TKR');
