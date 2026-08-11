CREATE TABLE public.produto (
    id_produto SERIAL PRIMARY KEY,
    nome_produto VARCHAR(60) NOT NULL,
    quantidade_produto INT NOT NULL,
    quantidade_minima_produto INT NOT NULL,
    quantidade_maxima_produto INT NOT NULL
);

INSERT INTO public.produto (nome_produto, quantidade_produto, quantidade_minima_produto, quantidade_maxima_produto) VALUES 
('Bolo', 2, 3, 10),
('Doce', 3, 5, 10),
('Bala', 7, 10, 15),
('Pão', 18, 20, 50);