DROP TABLE IF EXISTS veiculo, categoria;

CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nome_categoria VARCHAR(100)
);

CREATE TABLE veiculo (
    id_veiculo SERIAL PRIMARY KEY,
    modelo VARCHAR(200),
    marca VARCHAR(150),
    ano_fabricacao INT,
    id_categoria INT REFERENCES categoria(id_categoria)
);

INSERT INTO categoria (nome_categoria) VALUES
('Sedan'),
('SUV'),
('Hatch'),
('Picape'),
('Esportivo'),
('Motocicleta'),
('Elétrico'),
('Van'),
('Conversível'),
('Minivan');

-- Veículos
INSERT INTO veiculo (modelo, marca, ano_fabricacao, id_categoria) VALUES
('Civic',                         'Honda',                  2020, 1),
('Corolla',                       'Toyota',                 2021, 1),
('Sentra',                        'Nissan',                 2019, 1),

('Compass',                       'Jeep',                   2022, 2),
('Equinox',                       'Chevrolet',              2021, 2),
('T-Cross',                       'Volkswagen',             2023, 2),

('Onix',                          'Chevrolet',              2022, 3),
('Gol',                           'Volkswagen',             2018, 3),

('Hilux',                         'Toyota',                 2021, 4),
('S10',                           'Chevrolet',              2020, 4),

('Mustang',                       'Ford',                   2023, 5),
('Camaro',                        'Chevrolet',              2022, 5),

('CB 500F',                       'Honda',                  2021, 6),
('MT-07',                         'Yamaha',                 2023, 6),

('Model 3',                       'Tesla',                  2022, 7),
('Dolphin',                       'BYD',                    2023, 7),

('Sprinter',                      'Mercedes-Benz',          2022, 8),
('Master',                        'Renault',                2021, 8),

('MX-5 Miata',                    'Mazda',                  2023, 9),
('Mustang Conversível',           'Ford',                   2024, 9),

('Carnival',                      'Kia',                    2023, 10),
('Spin',                          'Chevrolet',              2022, 10);
