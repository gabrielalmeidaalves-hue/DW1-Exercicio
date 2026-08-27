-- Executar o script no pgAdmin4 ou DBeaver antes de executar o código


CREATE TABLE public.filme (
    id_filme INTEGER PRIMARY KEY,
    nome_filme VARCHAR(100) NOT NULL,
    diretor_filme VARCHAR(100) NOT NULL,
    data_lancamento DATE NOT NULL,
    duracao INTEGER NOT NULL  -- duração em minutos
);

-- Inserindo alguns dados de exemplo
INSERT INTO public.filme (id_filme, nome_filme, diretor_filme, data_lancamento, duracao) VALUES
(1, 'O Poderoso Chefão', 'Francis Ford Coppola', '1972-03-24', 175),
(2, 'Star Wars: Episódio IV', 'George Lucas', '1977-05-25', 121),
(3, 'Titanic', 'James Cameron', '1997-12-19', 194),
(4, 'A Origem', 'Christopher Nolan', '2010-07-16', 148),
(5, 'Matrix', 'Lana Wachowski, Lilly Wachowski', '1999-03-31', 136),
(6, 'O Senhor dos Anéis: A Sociedade do Anel', 'Peter Jackson', '2001-12-19', 178),
(7, 'Pulp Fiction', 'Quentin Tarantino', '1994-10-14', 154),
(8, 'Gladiador', 'Ridley Scott', '2000-05-05', 155),
(9, 'Interestelar', 'Christopher Nolan', '2014-11-07', 169),
(10, 'O Rei Leão', 'Roger Allers, Rob Minkoff', '1994-06-15', 88);