# Richélen Flach — Orçamento & Agenda

Sistema de orçamento estético e agendamento de pacientes, em arquivo único,
usado no celular (Safari do iPhone e Android) e instalável na tela inicial.

## Versão — OBRIGATÓRIO em toda alteração

**Toda mudança que vá para a `main` incrementa o número da versão em 1.**
A versão atual é a **v.30**. A próxima é v.31, depois v.32, e assim por diante.

Dois lugares mudam juntos, sempre com o mesmo número:

| Onde | Linha | Formato |
|---|---|---|
| `index.html` | `<div class="version-tag">` | `v.30` |
| `sw.js` | `var VERSAO = ` | `"riche-v30"` |

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
- **Os dados ficam no aparelho** (`localStorage`), nas chaves `richeEstado.v003`
  e `richeAgenda.v003`. Mudar esses nomes apaga a agenda das pacientes —
  só faça isso com migração.

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
