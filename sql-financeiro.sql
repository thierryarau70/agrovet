-- Copie e rode no SQL Editor do Supabase:

CREATE TABLE public.financeiro (
  id bigint PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  propriedade_id bigint REFERENCES public.propriedades ON DELETE CASCADE,
  tipo text NOT NULL CHECK (tipo IN ('Receita', 'Despesa')),
  categoria text NOT NULL,
  valor numeric(12,2) NOT NULL,
  data date NOT NULL,
  descricao text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ativar segurança
ALTER TABLE public.financeiro ENABLE ROW LEVEL SECURITY;

-- Criar a permissão (Policy) para você poder ler e escrever
CREATE POLICY "financeiro: own or admin" ON public.financeiro
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- Força a atualização do cache da API para ele reconhecer a tabela na hora
NOTIFY pgrst, 'reload schema';
