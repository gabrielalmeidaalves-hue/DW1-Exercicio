--
-- PostgreSQL database dump
--

\restrict yiY2tu1eHK5XaTRnny1gxSCvFIWJJknxJ1GvnJc0P1yHHa4spxDlfb8zHJdBxrr

-- Dumped from database version 14.23 (Ubuntu 14.23-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.23 (Ubuntu 14.23-0ubuntu0.22.04.1)

-- Started on 2026-08-20 06:42:28 -03

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE "dw1-db-2026";
--
-- TOC entry 3397 (class 1262 OID 91780)
-- Name: dw1-db-2026; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "dw1-db-2026" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'pt_BR.UTF-8';


ALTER DATABASE "dw1-db-2026" OWNER TO postgres;

\unrestrict yiY2tu1eHK5XaTRnny1gxSCvFIWJJknxJ1GvnJc0P1yHHa4spxDlfb8zHJdBxrr
\encoding SQL_ASCII
\connect -reuse-previous=on "dbname='dw1-db-2026'"
\restrict yiY2tu1eHK5XaTRnny1gxSCvFIWJJknxJ1GvnJc0P1yHHa4spxDlfb8zHJdBxrr

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 100500)
-- Name: carro; Type: TABLE; Schema: public; Owner: radames
--

CREATE TABLE public.carro (
    id_carro integer NOT NULL,
    nome_carro character varying(60) NOT NULL,
    modelo_carro character varying(60) NOT NULL,
    ano integer NOT NULL
);


ALTER TABLE public.carro OWNER TO radames;

--
-- TOC entry 214 (class 1259 OID 92265)
-- Name: cidade; Type: TABLE; Schema: public; Owner: radames
--

CREATE TABLE public.cidade (
    id_cidade integer NOT NULL,
    nome_cidade character varying(100) NOT NULL,
    sigla_estado character(2)
);


ALTER TABLE public.cidade OWNER TO radames;

--
-- TOC entry 213 (class 1259 OID 92264)
-- Name: cidade_id_cidade_seq; Type: SEQUENCE; Schema: public; Owner: radames
--

CREATE SEQUENCE public.cidade_id_cidade_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cidade_id_cidade_seq OWNER TO radames;

--
-- TOC entry 3398 (class 0 OID 0)
-- Dependencies: 213
-- Name: cidade_id_cidade_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: radames
--

ALTER SEQUENCE public.cidade_id_cidade_seq OWNED BY public.cidade.id_cidade;


--
-- TOC entry 212 (class 1259 OID 92259)
-- Name: estado; Type: TABLE; Schema: public; Owner: radames
--

CREATE TABLE public.estado (
    sigla_estado character(2) NOT NULL,
    nome_estado character varying(50) NOT NULL
);


ALTER TABLE public.estado OWNER TO radames;

--
-- TOC entry 216 (class 1259 OID 100505)
-- Name: filme; Type: TABLE; Schema: public; Owner: radames
--

CREATE TABLE public.filme (
    id_filme integer NOT NULL,
    nome_filme character varying(100) NOT NULL,
    diretor_filme character varying(100) NOT NULL,
    data_lancamento date NOT NULL,
    duracao integer NOT NULL
);


ALTER TABLE public.filme OWNER TO radames;

--
-- TOC entry 209 (class 1259 OID 91781)
-- Name: pessoa; Type: TABLE; Schema: public; Owner: radames
--

CREATE TABLE public.pessoa (
    cpf_pessoa character varying(15) NOT NULL,
    nome_pessoa character varying(60),
    data_nascimento_pessoa timestamp without time zone
);


ALTER TABLE public.pessoa OWNER TO radames;

--
-- TOC entry 211 (class 1259 OID 91787)
-- Name: produto; Type: TABLE; Schema: public; Owner: radames
--

CREATE TABLE public.produto (
    id_produto integer NOT NULL,
    nome_produto character varying(60) NOT NULL,
    quantidade_produto integer NOT NULL,
    quantidade_minima_produto integer NOT NULL,
    quantidade_maxima_produto integer NOT NULL
);


ALTER TABLE public.produto OWNER TO radames;

--
-- TOC entry 210 (class 1259 OID 91786)
-- Name: produto_id_produto_seq; Type: SEQUENCE; Schema: public; Owner: radames
--

CREATE SEQUENCE public.produto_id_produto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.produto_id_produto_seq OWNER TO radames;

--
-- TOC entry 3399 (class 0 OID 0)
-- Dependencies: 210
-- Name: produto_id_produto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: radames
--

ALTER SEQUENCE public.produto_id_produto_seq OWNED BY public.produto.id_produto;


--
-- TOC entry 3231 (class 2604 OID 92268)
-- Name: cidade id_cidade; Type: DEFAULT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.cidade ALTER COLUMN id_cidade SET DEFAULT nextval('public.cidade_id_cidade_seq'::regclass);


--
-- TOC entry 3230 (class 2604 OID 91790)
-- Name: produto id_produto; Type: DEFAULT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.produto ALTER COLUMN id_produto SET DEFAULT nextval('public.produto_id_produto_seq'::regclass);


--
-- TOC entry 3390 (class 0 OID 100500)
-- Dependencies: 215
-- Data for Name: carro; Type: TABLE DATA; Schema: public; Owner: radames
--

INSERT INTO public.carro VALUES (3, 'Corolla', 'XEi 2.0 Flex', 2021);
INSERT INTO public.carro VALUES (4, 'Gol', '1.0 MPI', 2018);
INSERT INTO public.carro VALUES (5, 'Uno', 'Mille Fire 1.0', 2010);
INSERT INTO public.carro VALUES (6, 'Onix', 'LT 1.0 Turbo', 2022);
INSERT INTO public.carro VALUES (7, 'HB20', 'Comfort 1.0', 2021);
INSERT INTO public.carro VALUES (9, 'Compass', 'Limited 2.0 Turbo', 2023);
INSERT INTO public.carro VALUES (10, 'Kwid', 'Zen 1.0', 2022);
INSERT INTO public.carro VALUES (1, 'Fusca', '1300 L', 1978);
INSERT INTO public.carro VALUES (8, 'Vectra', 'qqq', 2000);
INSERT INTO public.carro VALUES (2, 'Civic', 'EXL 2.0', 2020);


--
-- TOC entry 3389 (class 0 OID 92265)
-- Dependencies: 214
-- Data for Name: cidade; Type: TABLE DATA; Schema: public; Owner: radames
--

INSERT INTO public.cidade VALUES (1, 'Campo Mourão', 'PR');
INSERT INTO public.cidade VALUES (2, 'Pequeno', 'PR');
INSERT INTO public.cidade VALUES (3, 'Mamborê', 'PR');
INSERT INTO public.cidade VALUES (4, 'Fênix', 'PR');
INSERT INTO public.cidade VALUES (5, 'Juranda', 'PR');
INSERT INTO public.cidade VALUES (6, 'Boa Esperança', 'PR');
INSERT INTO public.cidade VALUES (7, 'Araruna', 'PR');
INSERT INTO public.cidade VALUES (8, 'Barbosa Ferraz', 'PR');
INSERT INTO public.cidade VALUES (9, 'Iretama', 'PR');
INSERT INTO public.cidade VALUES (10, 'Janiópolis', 'PR');
INSERT INTO public.cidade VALUES (11, 'Luiziana', 'PR');
INSERT INTO public.cidade VALUES (12, 'Moreira Sales', 'PR');
INSERT INTO public.cidade VALUES (13, 'Nova Cantu', 'PR');
INSERT INTO public.cidade VALUES (14, 'Quarto Centenário', 'PR');
INSERT INTO public.cidade VALUES (15, 'Tuneiras do Oeste', 'PR');


--
-- TOC entry 3387 (class 0 OID 92259)
-- Dependencies: 212
-- Data for Name: estado; Type: TABLE DATA; Schema: public; Owner: radames
--

INSERT INTO public.estado VALUES ('AC', 'Acre');
INSERT INTO public.estado VALUES ('AL', 'Alagoas');
INSERT INTO public.estado VALUES ('AP', 'Amapá');
INSERT INTO public.estado VALUES ('AM', 'Amazonas');
INSERT INTO public.estado VALUES ('BA', 'Bahia');
INSERT INTO public.estado VALUES ('CE', 'Ceará');
INSERT INTO public.estado VALUES ('DF', 'Distrito Federal');
INSERT INTO public.estado VALUES ('ES', 'Espírito Santo');
INSERT INTO public.estado VALUES ('GO', 'Goiás');
INSERT INTO public.estado VALUES ('MA', 'Maranhão');
INSERT INTO public.estado VALUES ('MT', 'Mato Grosso');
INSERT INTO public.estado VALUES ('MS', 'Mato Grosso do Sul');
INSERT INTO public.estado VALUES ('MG', 'Minas Gerais');
INSERT INTO public.estado VALUES ('PA', 'Pará');
INSERT INTO public.estado VALUES ('PB', 'Paraíba');
INSERT INTO public.estado VALUES ('PR', 'Paraná');
INSERT INTO public.estado VALUES ('PE', 'Pernambuco');
INSERT INTO public.estado VALUES ('PI', 'Piauí');
INSERT INTO public.estado VALUES ('RJ', 'Rio de Janeiro');
INSERT INTO public.estado VALUES ('RN', 'Rio Grande do Norte');
INSERT INTO public.estado VALUES ('RS', 'Rio Grande do Sul');
INSERT INTO public.estado VALUES ('RO', 'Rondônia');
INSERT INTO public.estado VALUES ('RR', 'Roraima');
INSERT INTO public.estado VALUES ('SC', 'Santa Catarina');
INSERT INTO public.estado VALUES ('SP', 'São Paulo');
INSERT INTO public.estado VALUES ('SE', 'Sergipe');
INSERT INTO public.estado VALUES ('TO', 'Tocantins');


--
-- TOC entry 3391 (class 0 OID 100505)
-- Dependencies: 216
-- Data for Name: filme; Type: TABLE DATA; Schema: public; Owner: radames
--

INSERT INTO public.filme VALUES (2, 'Star Wars: Episódio IV', 'George Lucas', '1977-05-25', 121);
INSERT INTO public.filme VALUES (4, 'A Origem', 'Christopher Nolan', '2010-07-16', 148);
INSERT INTO public.filme VALUES (5, 'Matrix', 'Lana Wachowski, Lilly Wachowski', '1999-03-31', 136);
INSERT INTO public.filme VALUES (6, 'O Senhor dos Anéis: A Sociedade do Anel', 'Peter Jackson', '2001-12-19', 178);
INSERT INTO public.filme VALUES (7, 'Pulp Fiction', 'Quentin Tarantino', '1994-10-14', 154);
INSERT INTO public.filme VALUES (8, 'Gladiador', 'Ridley Scott', '2000-05-05', 155);
INSERT INTO public.filme VALUES (9, 'Interestelar', 'Christopher Nolan', '2014-11-07', 169);
INSERT INTO public.filme VALUES (10, 'O Rei Leão', 'Roger Allers, Rob Minkoff', '1994-06-15', 88);
INSERT INTO public.filme VALUES (1, 'O Poderoso Chefão', 'Francis Ford Coppola', '1972-03-24', 176);
INSERT INTO public.filme VALUES (3, 'Titanic', 'James Cameron', '1997-12-19', 194);


--
-- TOC entry 3384 (class 0 OID 91781)
-- Dependencies: 209
-- Data for Name: pessoa; Type: TABLE DATA; Schema: public; Owner: radames
--

INSERT INTO public.pessoa VALUES ('111', 'Berola', '2000-05-13 00:00:00');
INSERT INTO public.pessoa VALUES ('222', 'Timocréia', '1902-02-25 00:00:00');


--
-- TOC entry 3386 (class 0 OID 91787)
-- Dependencies: 211
-- Data for Name: produto; Type: TABLE DATA; Schema: public; Owner: radames
--

INSERT INTO public.produto VALUES (1, 'Bolo', 2, 3, 10);
INSERT INTO public.produto VALUES (2, 'Doce', 3, 5, 10);
INSERT INTO public.produto VALUES (4, 'Pão', 18, 20, 50);
INSERT INTO public.produto VALUES (3, 'Bala', 12, 10, 15);


--
-- TOC entry 3400 (class 0 OID 0)
-- Dependencies: 213
-- Name: cidade_id_cidade_seq; Type: SEQUENCE SET; Schema: public; Owner: radames
--

SELECT pg_catalog.setval('public.cidade_id_cidade_seq', 15, true);


--
-- TOC entry 3401 (class 0 OID 0)
-- Dependencies: 210
-- Name: produto_id_produto_seq; Type: SEQUENCE SET; Schema: public; Owner: radames
--

SELECT pg_catalog.setval('public.produto_id_produto_seq', 4, true);


--
-- TOC entry 3241 (class 2606 OID 100504)
-- Name: carro carro_pkey; Type: CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.carro
    ADD CONSTRAINT carro_pkey PRIMARY KEY (id_carro);


--
-- TOC entry 3239 (class 2606 OID 92270)
-- Name: cidade cidade_pkey; Type: CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.cidade
    ADD CONSTRAINT cidade_pkey PRIMARY KEY (id_cidade);


--
-- TOC entry 3237 (class 2606 OID 92263)
-- Name: estado estado_pkey; Type: CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.estado
    ADD CONSTRAINT estado_pkey PRIMARY KEY (sigla_estado);


--
-- TOC entry 3243 (class 2606 OID 100509)
-- Name: filme filme_pkey; Type: CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.filme
    ADD CONSTRAINT filme_pkey PRIMARY KEY (id_filme);


--
-- TOC entry 3233 (class 2606 OID 91785)
-- Name: pessoa newtable_pk; Type: CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.pessoa
    ADD CONSTRAINT newtable_pk PRIMARY KEY (cpf_pessoa);


--
-- TOC entry 3235 (class 2606 OID 91792)
-- Name: produto produto_pkey; Type: CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.produto
    ADD CONSTRAINT produto_pkey PRIMARY KEY (id_produto);


--
-- TOC entry 3244 (class 2606 OID 92271)
-- Name: cidade cidade_sigla_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.cidade
    ADD CONSTRAINT cidade_sigla_estado_fkey FOREIGN KEY (sigla_estado) REFERENCES public.estado(sigla_estado);


-- Completed on 2026-08-20 06:42:28 -03

--
-- PostgreSQL database dump complete
--

\unrestrict yiY2tu1eHK5XaTRnny1gxSCvFIWJJknxJ1GvnJc0P1yHHa4spxDlfb8zHJdBxrr

