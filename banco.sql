-- Banco de dados do sistema Richélen Flach
--
-- Onde rodar: painel do Supabase → SQL Editor → New query → colar tudo → Run.
-- Roda uma vez só. Se rodar de novo, não quebra nada.
--
-- Tudo o que o sistema guarda (clientes, produtos, aplicações, financeiro,
-- recibos e agenda) vive nesta única tabela, cada registro num campo JSON.
-- Assim o sistema pode ganhar campos novos sem precisar mexer no banco.

create table if not exists public.registros (
  id            text        not null,
  usuario_id    uuid        not null default auth.uid() references auth.users(id) on delete cascade,
  tipo          text        not null,
  dados         jsonb       not null default '{}'::jsonb,
  atualizado_em timestamptz not null default now(),
  excluido      boolean     not null default false,
  primary key (id)
);

-- Buscar rápido só o que mudou desde a última sincronização
create index if not exists registros_usuario_atualizado
  on public.registros (usuario_id, atualizado_em);

-- Uma escrita mais velha nunca sobrepõe uma mais nova.
-- Protege o caso de um aparelho que ficou offline e volta com dados antigos.
create or replace function public.registros_so_mais_novo()
returns trigger
language plpgsql
as $$
begin
  if OLD.atualizado_em > NEW.atualizado_em then
    return OLD;
  end if;
  return NEW;
end;
$$;

drop trigger if exists registros_so_mais_novo on public.registros;
create trigger registros_so_mais_novo
  before update on public.registros
  for each row execute function public.registros_so_mais_novo();

-- Cada conta enxerga e mexe apenas nos próprios registros.
-- Sem isto, qualquer pessoa com a chave pública leria os dados das pacientes.
alter table public.registros enable row level security;

drop policy if exists "dono lê" on public.registros;
create policy "dono lê" on public.registros
  for select using (auth.uid() = usuario_id);

drop policy if exists "dono insere" on public.registros;
create policy "dono insere" on public.registros
  for insert with check (auth.uid() = usuario_id);

drop policy if exists "dono altera" on public.registros;
create policy "dono altera" on public.registros
  for update using (auth.uid() = usuario_id) with check (auth.uid() = usuario_id);

drop policy if exists "dono apaga" on public.registros;
create policy "dono apaga" on public.registros
  for delete using (auth.uid() = usuario_id);
