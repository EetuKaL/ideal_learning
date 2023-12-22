PGDMP  9                    {            postgres    16.1    16.1                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    5    postgres    DATABASE     }   CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Finnish_Finland.1252';
    DROP DATABASE postgres;
                postgres    false                       0    0    DATABASE postgres    COMMENT     N   COMMENT ON DATABASE postgres IS 'default administrative connection database';
                   postgres    false    4869                        3079    16384 	   adminpack 	   EXTENSION     A   CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;
    DROP EXTENSION adminpack;
                   false                       0    0    EXTENSION adminpack    COMMENT     M   COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';
                        false    2            �            1259    16422    answer_options    TABLE     �   CREATE TABLE public.answer_options (
    answer_text character varying NOT NULL,
    answer_correct boolean NOT NULL,
    answer_id bigint NOT NULL,
    question_id bigint NOT NULL
);
 "   DROP TABLE public.answer_options;
       public         heap    postgres    false            �            1259    16421    answer_options_answer_id_seq    SEQUENCE     �   CREATE SEQUENCE public.answer_options_answer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.answer_options_answer_id_seq;
       public          postgres    false    221                       0    0    answer_options_answer_id_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.answer_options_answer_id_seq OWNED BY public.answer_options.answer_id;
          public          postgres    false    220            �            1259    16408    exams    TABLE     �   CREATE TABLE public.exams (
    exam_name character varying NOT NULL,
    exam_id bigint NOT NULL,
    published_at date,
    updated_at date,
    created_at date NOT NULL
);
    DROP TABLE public.exams;
       public         heap    postgres    false            �            1259    16407    exams_exam_id_seq    SEQUENCE     z   CREATE SEQUENCE public.exams_exam_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.exams_exam_id_seq;
       public          postgres    false    218            	           0    0    exams_exam_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.exams_exam_id_seq OWNED BY public.exams.exam_id;
          public          postgres    false    217            �            1259    16414 	   questions    TABLE     �   CREATE TABLE public.questions (
    question_text character varying NOT NULL,
    exam_id bigint NOT NULL,
    question_id bigint DEFAULT nextval('public.exams_exam_id_seq'::regclass) NOT NULL
);
    DROP TABLE public.questions;
       public         heap    postgres    false    217            �            1259    16399    users    TABLE     �   CREATE TABLE public.users (
    first_name character varying,
    last_name character varying,
    user_email character varying NOT NULL,
    user_password character varying NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            `           2604    16425    answer_options answer_id    DEFAULT     �   ALTER TABLE ONLY public.answer_options ALTER COLUMN answer_id SET DEFAULT nextval('public.answer_options_answer_id_seq'::regclass);
 G   ALTER TABLE public.answer_options ALTER COLUMN answer_id DROP DEFAULT;
       public          postgres    false    221    220    221            ^           2604    16411    exams exam_id    DEFAULT     n   ALTER TABLE ONLY public.exams ALTER COLUMN exam_id SET DEFAULT nextval('public.exams_exam_id_seq'::regclass);
 <   ALTER TABLE public.exams ALTER COLUMN exam_id DROP DEFAULT;
       public          postgres    false    218    217    218            �          0    16422    answer_options 
   TABLE DATA           ]   COPY public.answer_options (answer_text, answer_correct, answer_id, question_id) FROM stdin;
    public          postgres    false    221   �       �          0    16408    exams 
   TABLE DATA           Y   COPY public.exams (exam_name, exam_id, published_at, updated_at, created_at) FROM stdin;
    public          postgres    false    218   �        �          0    16414 	   questions 
   TABLE DATA           H   COPY public.questions (question_text, exam_id, question_id) FROM stdin;
    public          postgres    false    219   
!       �          0    16399    users 
   TABLE DATA           Q   COPY public.users (first_name, last_name, user_email, user_password) FROM stdin;
    public          postgres    false    216   �!       
           0    0    answer_options_answer_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.answer_options_answer_id_seq', 304, true);
          public          postgres    false    220                       0    0    exams_exam_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.exams_exam_id_seq', 280, true);
          public          postgres    false    217            h           2606    16429 "   answer_options answer_options_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public.answer_options
    ADD CONSTRAINT answer_options_pkey PRIMARY KEY (answer_id);
 L   ALTER TABLE ONLY public.answer_options DROP CONSTRAINT answer_options_pkey;
       public            postgres    false    221            d           2606    16431    exams exams_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_pkey PRIMARY KEY (exam_id);
 :   ALTER TABLE ONLY public.exams DROP CONSTRAINT exams_pkey;
       public            postgres    false    218            f           2606    16433    questions questions_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (question_id);
 B   ALTER TABLE ONLY public.questions DROP CONSTRAINT questions_pkey;
       public            postgres    false    219            b           2606    16456    users users_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_email);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216            i           2606    16445    questions fk_exam    FK CONSTRAINT     �   ALTER TABLE ONLY public.questions
    ADD CONSTRAINT fk_exam FOREIGN KEY (exam_id) REFERENCES public.exams(exam_id) ON DELETE CASCADE NOT VALID;
 ;   ALTER TABLE ONLY public.questions DROP CONSTRAINT fk_exam;
       public          postgres    false    219    4708    218            j           2606    16450    answer_options fk_question    FK CONSTRAINT     �   ALTER TABLE ONLY public.answer_options
    ADD CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES public.questions(question_id) ON DELETE CASCADE NOT VALID;
 D   ALTER TABLE ONLY public.answer_options DROP CONSTRAINT fk_question;
       public          postgres    false    221    4710    219            �     x�u�An� D����"�5��2J������6mL!�R���b5�Yu��y3�:K��j���C}�[%M��N6Q.�@?��i3<<�O���_}�'�l�\�ܰ����>���3��p���H݇�6�;�E̿�Z�-bS��URvva�k�z?]it	�9��M�Ҁ�7��y��[]��q]���e�_���U��8�*�$n�oy����/�[쀆�`p_�^���Z��F�2.����4��O����1�T}x�      �   O   x�+*��N�42��4202�54�5������,�L�	,ͬ�427�K`gr奖���pa7I1���X�4D6=F��� ��)      �   �   x���=�0���>*�gbc	���X�Q��qD\(g����1������9̊�Ɋ*W��BOТ�-��Wt-m�$�`��M��N�8#� ���[t45���>�w�N_��;�@6�!ŬXʞ�V� E=��˞Y�`�;��@�V^�{��X�YI���|�:/�R/�e3      �   �   x���OS�@��3|΋���4\�7���tY�m�e%��W��f:t�=�'�
�c�94�Q�ˤ��R�7!%'g��vWj�L�DԾ�m�}R������J�:�)�K�l�v�7X��� �T��hU�n�B�l�!(�3�����O���p��9�ǌ�c}H;����i�v�ϜE���ƫq������{��y�cYRtW���t�h�@Y�[l���»��3L�3?�_�@}&��~ �Nkx     