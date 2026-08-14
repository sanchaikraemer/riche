# Richélen Flach — Orçamento & Agenda

Sistema de orçamento estético e agendamento de pacientes, em arquivo único,
usado no celular (Safari do iPhone e Android) e instalável na tela inicial.

## Versão — OBRIGATÓRIO em toda alteração

**Toda mudança que vá para a `main` incrementa o número da versão em 1.**
A versão atual é a **v.32**. A próxima é v.33, depois v.34, e assim por diante.

Dois lugares mudam juntos, sempre com o mesmo número:

| Onde | Linha | Formato |
|---|---|---|
| `index.html` | `<div class="version-tag">` | `v.32` |
| `sw.js` | `var VERSAO = ` | `"riche-v32"` |

O número em `sw.js` troca o nome do cache do navegador. Sem trocá-lo, quem já
abriu o sistema pode continuar vendo a versão antiga. Nunca atualize um sem o
outro.

A etiqueta da versão aparece no canto superior direito do painel, e serve para
conferir no celular se a versão nova chegou.

## Estrutura

Arquivo único, sem dependências externas, sem build. Tudo em HTML/CSS/JS puro
dentro de `index.html` — inclusive as logos, embutidas em base64.

| Arquivo | Papel |
|---|---|
| `index.html` | O sistema inteiro |
| `manifest.webmanifest` | Instalação na tela inicial |
| `sw.js` | Funcionamento sem internet |
| `icons/` | Ícones do app |
| `.github/workflows/publicar.yml` | Publica no ar a cada mudança na `main` |

## Regras do projeto

- **Sem dependências externas.** Nada de CDN, framework ou pacote: o sistema
  precisa abrir sem internet depois de instalado.
- **JavaScript no estilo do arquivo:** `var`, `function`, sem sintaxe moderna
  que o Safari antigo possa recusar. Textos da interface em português.
- **O PDF tem que caber em 1 página.** Qualquer seção nova no documento
  (`.paper`) precisa de estilo `@media print` compacto, e o resultado deve ser
  conferido antes de subir.
- **Nada de campo nativo de horário.** O relógio do sistema é ruim de usar;
  use o seletor próprio (`abrirSeletorHora` / `ligarCampoHorario`).
- **Os dados são locais primeiro e sincronizam depois.** Tudo grava no
  aparelho (funciona sem internet) e sobe para o Supabase quando há conta
  ligada. Um aparelho só empurra o que ele mesmo mexeu (`richeSujos.v1`);
  apagar deixa uma lápide (`richeExcluidos.v1`) para o apagamento chegar
  aos outros aparelhos. Reenviar o que veio da nuvem ressuscita registros
  apagados — foi o defeito que motivou a lista de sujos.
- **Os dados ficam no aparelho** (`localStorage`). Mudar o nome de uma chave
  apaga os dados das pacientes — só faça isso com migração:
  `richeEstado.v003`, `richeAgenda.v003`, `richeClientes.v1`,
  `richeProdutos.v1`, `richeAplicacoes.v1`, `richeFinanceiro.v1`,
  `richeRecibos.v1`, `richeSecao.v1`.
- **O menu não pode alargar a página.** As seções vivem em `.tab-pane` e o
  menu rola na horizontal; qualquer faixa rolável precisa de `min-width:0` e
  `max-width:100%`, senão o celular expande o layout e desmonta tudo.
- **NFS-e não é emitida aqui.** O módulo Recibos gera recibo e guarda os dados;
  a nota fiscal em si exige certificado digital e o sistema da prefeitura.

## Publicação

Desenvolva no branch de trabalho, abra o pull request e mescle na `main`.
A publicação é automática: o site sai no ar em
https://sanchaikraemer.github.io/riche/ um ou dois minutos depois.

Não é preciso perguntar antes de subir — subir sempre faz parte do trabalho.

## Testes

Não há suíte automatizada no repositório. Antes de subir, exercite o fluxo num
navegador de verdade (Playwright com viewport de celular): preencher orçamento,
marcar datas, gerar as mensagens, salvar, recarregar a página e conferir a
persistência, e gerar o PDF verificando que continua em 1 página.
