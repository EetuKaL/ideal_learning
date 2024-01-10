--
-- PostgreSQL database dump
--

-- Dumped from database version 13.13
-- Dumped by pg_dump version 13.13

-- Started on 2024-01-10 12:53:32

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

--
-- TOC entry 2 (class 3079 OID 16384)
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- TOC entry 3019 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


--
-- TOC entry 207 (class 1255 OID 16519)
-- Name: notify_trigger_function(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.notify_trigger_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    notification_text TEXT;
BEGIN
    IF TG_OP = 'INSERT' THEN
      notification_text := json_build_object('name', NEW.exam_name,'type', 'insert', 'id', NEW.exam_id)::TEXT;
    ELSIF TG_OP = 'UPDATE' THEN
      notification_text := json_build_object('name', NEW.exam_name, 'type', 'update', 'id', NEW.exam_id)::TEXT;
    ELSIF TG_OP = 'DELETE' THEN
      notification_text := json_build_object('name', OLD.exam_name,'type', 'delete', 'id', OLD.exam_id)::TEXT;
    END IF;

    PERFORM pg_notify('notification_channel', notification_text);
    RETURN NEW;
  END;
  $$;


ALTER FUNCTION public.notify_trigger_function() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 201 (class 1259 OID 16469)
-- Name: answer_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.answer_options (
    answer_text character varying NOT NULL,
    answer_correct boolean NOT NULL,
    answer_id bigint NOT NULL,
    question_id bigint NOT NULL
);


ALTER TABLE public.answer_options OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 16475)
-- Name: answer_options_answer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.answer_options_answer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.answer_options_answer_id_seq OWNER TO postgres;

--
-- TOC entry 3020 (class 0 OID 0)
-- Dependencies: 202
-- Name: answer_options_answer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.answer_options_answer_id_seq OWNED BY public.answer_options.answer_id;


--
-- TOC entry 203 (class 1259 OID 16477)
-- Name: exams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exams (
    exam_name character varying NOT NULL,
    exam_id bigint NOT NULL,
    published_at date,
    updated_at date,
    created_at date NOT NULL
);


ALTER TABLE public.exams OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 16483)
-- Name: exams_exam_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exams_exam_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.exams_exam_id_seq OWNER TO postgres;

--
-- TOC entry 3021 (class 0 OID 0)
-- Dependencies: 204
-- Name: exams_exam_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exams_exam_id_seq OWNED BY public.exams.exam_id;


--
-- TOC entry 205 (class 1259 OID 16485)
-- Name: questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.questions (
    question_text character varying NOT NULL,
    exam_id bigint NOT NULL,
    question_id bigint DEFAULT nextval('public.exams_exam_id_seq'::regclass) NOT NULL
);


ALTER TABLE public.questions OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 16492)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    first_name character varying,
    last_name character varying,
    user_email character varying NOT NULL,
    user_password character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 2870 (class 2604 OID 16498)
-- Name: answer_options answer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answer_options ALTER COLUMN answer_id SET DEFAULT nextval('public.answer_options_answer_id_seq'::regclass);


--
-- TOC entry 2871 (class 2604 OID 16499)
-- Name: exams exam_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exams ALTER COLUMN exam_id SET DEFAULT nextval('public.exams_exam_id_seq'::regclass);


--
-- TOC entry 2874 (class 2606 OID 16501)
-- Name: answer_options answer_options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answer_options
    ADD CONSTRAINT answer_options_pkey PRIMARY KEY (answer_id);


--
-- TOC entry 2876 (class 2606 OID 16503)
-- Name: exams exams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_pkey PRIMARY KEY (exam_id);


--
-- TOC entry 2878 (class 2606 OID 16505)
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (question_id);


--
-- TOC entry 2880 (class 2606 OID 16507)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_email);


--
-- TOC entry 2883 (class 2620 OID 16537)
-- Name: exams my_notify_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER my_notify_trigger AFTER INSERT OR DELETE OR UPDATE ON public.exams FOR EACH ROW EXECUTE FUNCTION public.notify_trigger_function();


--
-- TOC entry 2882 (class 2606 OID 16508)
-- Name: questions fk_exam; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT fk_exam FOREIGN KEY (exam_id) REFERENCES public.exams(exam_id) ON DELETE CASCADE NOT VALID;


--
-- TOC entry 2881 (class 2606 OID 16513)
-- Name: answer_options fk_question; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answer_options
    ADD CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES public.questions(question_id) ON DELETE CASCADE NOT VALID;


-- Completed on 2024-01-10 12:53:32

--
-- PostgreSQL database dump complete
--

