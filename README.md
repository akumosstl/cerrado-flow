# 🤖 Pipeline Agentic — Fluxo Básico

## .agentic/ — Cérebro do Projeto

O diretório `.agentic/` é o **cérebro** de qualquer projeto que usa o framework Agentic. Ele armazena todos os dados persistentes que os agentes leem e escrevem durante a execução do pipeline: configuração, contratos de schema, artefatos de memória e entregáveis finais.

## Estrutura

```
.agentic/
├── config.json          # Configuração do framework (pipeline, budgets, caminhos)
├── schemas/             # Contratos JSON Schema para cada fase
│   ├── analysis.json    #   Contrato de saída do Analyzer
│   ├── planning.json    #   Contrato de saída do Planner
│   ├── implementation.json  # Contrato de saída do Implementer
│   └── verification.json    # Contrato de saída do Verifier
├── memory/              # Artefatos de runtime criados por agentes
│   └── .gitkeep
└── output/              # Entregáveis finais
    └── .gitkeep
```

## Como Funciona

### Configuração (`config.json`)

O arquivo de configuração central que define:
- **Pipeline**: Quais fases executam, em que ordem e se deve avanço automático
- **Budgets de token**: Limites de token por fase para controle de custo
- **Diretórios Memory/Output**: Onde os agentes persistem seus artefatos
- **Referências de Schema**: Caminhos para contratos JSON Schema de cada fase
- **Instructions/Instincts**: Quais arquivos de comportamento carregam na inicialização vs. sempre ativos

### Schemas (`schemas/`)

Cada fase tem um JSON Schema que define a forma exata de seu artefato de saída. Agentes DEVEM produzir saída que valide contra seu schema. Isso garante:

1. **Desenvolvimento contract-first**: Cada agente sabe exatamente o que deve produzir
2. **Compatibilidade entre agentes**: Agentes downstream podem consumir com segurança a saída upstream
3. **Validação**: O Verifier pode verificar se todos os artefatos conformam com seus contratos

**Versionamento de Schema**: Schemas são versão 1.0. Ao estender um schema, adicione novas propriedades como opcionais (`"required"` não deve crescer). Consumidores existentes não devem quebrar. Documente mudanças em uma propriedade `changelog`.

### Memória (`memory/`)

Artefatos de runtime produzidos por agentes durante a execução do pipeline:
- `analyzer.json` — Saída da fase Analyzer
- `planner.json` — Saída da fase Planner
- `implementer.json` — Saída da fase Implementer
- `verifier.json` — Saída da fase Verifier

Esses arquivos são efêmeros por sessão por padrão (retenção: "session"). Configure a retenção em `config.json` se precisar de persistência entre sessões.

### Saída (`output/`)

Entregáveis finais do pipeline — o resultado final que o usuário solicitou. Isso é distinto dos artefatos de memória, que são estados intermediários do pipeline.

## Uso

### Para Runtimes de IA

Qualquer runtime de IA (OpenCode, Claude Code, harness customizado) lê `.agentic/config.json` para:
1. Descobrir quais fases executar e em que ordem
2. Carregar contratos de schema para validação de entrada/saída
3. Encontrar diretórios de memória e saída para persistência
4. Carregar instincts e instructions para controle comportamental

### Para Novos Projetos

#### Via npm (recomendado)

```bash
npm i cerrado-flow
```

O postinstall copia `.agentic/` e `.opencode/` automaticamente para a raiz do seu projeto. Se já existirem, são preservados (não sobrescritos).

#### Via CLI

```bash
npx cerrado-flow          # copia .agentic/ e .opencode/ para o diretório atual
npx cerrado-flow --force  # sobrescreve se já existirem
```

#### Configuração após instalação

1. Edite `config.json` para atender às necessidades do seu projeto
2. Mantenha os schemas como estão, ou estenda-os com propriedades opcionais
3. Os diretórios `memory/` e `output/` serão populados em runtime

### Para o Pipeline Agentic

O controlador do pipeline lê `config.json` → carrega schemas → invoca agentes em ordem → cada agente escreve em `memory/` → o Verifier lê todos os artefatos de memória → produz veredito em `output/`.

## Princípios de Design

- **Portátil**: Copie `.agentic/` para qualquer projeto e funciona
- **Schema-first**: Contratos definem o que cada fase produz
- **Sem código**: O cérebro é puramente dados — nenhum executável, nenhum script
- **Legível por humanos**: Todos os arquivos são JSON ou Markdown — inspecionável, diffable, versionable


# 🤖 Pipeline Agentic — Fluxo Milestone-a-Milestone

Este projeto usa um pipeline de agents opencode para análise, planejamento, implementação e verificação de features. O fluxo milestone permite implementar features complexas de forma incremental, com validação automática entre cada etapa.

### Arquitetura do Pipeline

```
/analyze → /plan → /orchestrate (ou /milestone-impl + /milestone-verify)
```

| Fase | Command | Agent | Permissão | Artefato |
|---|---|---|---|---|
| Análise | `/analyze <id>` | analyzer | somente leitura | `analysis_<id>.json` |
| Planejamento | `/plan <id>` | planner | somente leitura | `planning_<id>.json` |
| Implementação (por milestone) | `/milestone-impl <id> --milestone <n>` | milestone-implementer | leitura+escrita+bash | `implementation_<id>_m<n>.json` |
| Verificação (por milestone) | `/milestone-verify <id> --milestone <n>` | milestone-verifier | leitura+bash(teste) | `verify_<id>_m<n>.json` |
| Orquestração (automática) | `/orchestrate <id>` | orchestrator | leitura+escrita+bash | `orchestration_<id>.json` |

### Fluxo Completo — Passo a Passo

#### 1. Análise

```bash
/analyze s1us005 "histórico de vendas com filtros, cancelamento e venda retroativa"
```

Gera `@.agentic/memory/analysis_s1us005.json` com findings, riscos e dependências.

#### 2. Planejamento

```bash
/plan s1us005
```

Lê a análise e gera `@.agentic/memory/planning_s1us005.json` com milestones, tasks, rollback e critérios de sucesso.

#### 3. Orquestração Automática (recomendado)

```bash
/orchestrate s1us005
```

Executa todos os milestones em sequência, com verificação entre cada um:

```
M1: implement → verify → pass ✓  →  implementation_s1us005_m1.json + verify_s1us005_m1.json
M2: implement → verify → pass ✓  →  implementation_s1us005_m2.json + verify_s1us005_m2.json
M3: implement → verify → fail ✗  →  PARA (não vai para M4)
```

Se um milestone falhar, corrija e retome:

```bash
# Corrigir e re-implementar o milestone 3
/milestone-impl s1us005 --milestone 3 --tasks T006

# Verificar se passou
/milestone-verify s1us005 --milestone 3

# Retomar orquestração do milestone 4 em diante
/orchestrate s1us005 --from_milestone 4
```

#### 4. Execução Manual (milestone por milestone)

Alternativa à orquestração automática — mais controle granular:

```bash
# Implementar milestone 1
/milestone-impl s1us005 --milestone 1

# Verificar milestone 1
/milestone-verify s1us005 --milestone 1

# Se passou, implementar milestone 2
/milestone-impl s1us005 --milestone 2

# E assim por diante...
```

#### 5. Executar Tasks Específicas

Para corrigir apenas uma task dentro de um milestone:

```bash
/milestone-impl s1us005 --milestone 3 --tasks T006
```

### Parâmetros dos Commands

| Command | Parâmetro | Obrigatório | Descrição |
|---|---|---|---|
| `/milestone-impl` | `implementation_id` | sim | ID do plano (ex: s1us005) |
| | `milestone` | sim | Número do milestone (1-based) |
| | `tasks` | não | Task IDs separados por vírgula (ex: T001,T002). Sobrepõe milestone |
| `/milestone-verify` | `verification_id` | sim | ID do plano |
| | `milestone` | sim | Número do milestone a verificar |
| `/orchestrate` | `orchestration_id` | sim | ID do plano |
| | `from_milestone` | não | Milestone inicial para retomada (default: 1) |
| | `to_milestone` | não | Milestone final (default: último) |
| | `skip_verify` | não | Pula verificação entre milestones (default: false) |

### Convenção de Artefatos

```
.agentic/memory/
├── analysis_s1us005.json              # Saída do analyzer
├── planning_s1us005.json              # Saída do planner
├── implementation_s1us005_m1.json     # Implementação do milestone 1
├── implementation_s1us005_m2.json     # Implementação do milestone 2
├── verify_s1us005_m1.json             # Verificação do milestone 1
├── verify_s1us005_m2.json             # Verificação do milestone 2
└── orchestration_s1us005.json         # Status consolidado da orquestração
```

### Política Stop-on-Fail

O milestone-implementer usa política **stop-on-fail**: se uma task falha dentro de um milestone, a implementação para imediatamente e não executa as tasks subsequentes. O orchestrator também para no primeiro milestone que falhar na verificação. Isso garante que problemas sejam corrigidos antes de prosseguir.

### Fluxo Original (sem milestones)

O fluxo original sem granularidade por milestone continua disponível:

```bash
/analyze s1us005 "descrição"
/plan s1us005
/implement s1us005    # Executa TODAS as tasks de uma vez
/verify s1us005       # Verifica TODOS os critérios de uma vez
```

Use `/implement` para tarefas simples. Use `/orchestrate` para tarefas complexas com múltiplos milestones.

---

## Instalação e Uso via npm

### Instalando em um projeto

```bash
mkdir meu-projeto && cd meu-projeto
npm init -y
npm i cerrado-flow
```

Após a instalação, os diretórios `.agentic/` e `.opencode/` estarão na raiz do projeto, prontos para uso com o OpenCode.

### Uso programático

```js
const cerradoFlow = require("cerrado-flow");

console.log(cerradoFlow.config);       // config.json do framework
console.log(cerradoFlow.schemas);      // todos os JSON Schemas
console.log(cerradoFlow.agenticDir);   // caminho para .agentic/
console.log(cerradoFlow.opencodeDir);  // caminho para .opencode/
```

### CLI

```bash
npx cerrado-flow          # instala .agentic/ e .opencode/ no diretório atual
npx cerrado-flow --force  # sobrescreve diretórios existentes
```

---

## Publicação no npm

### Primeira vez

1. **Criar conta**: Acesse [npmjs.com/signup](https://www.npmjs.com/signup), crie a conta e verifique o email
2. **Login no terminal**:

```bash
npm login
```

3. **Verificar disponibilidade do nome**:

```bash
npm view cerrado-flow
```

Se retornar 404, o nome está disponível. Caso contrário, use scoped package: `@seu-username/cerrado-flow`

4. **Publicar**:

```bash
npm publish
```

Se for scoped package:

```bash
npm publish --access public
```

### Atualizações (novas versões)

```bash
# Patch (bug fix): 1.0.0 -> 1.0.1
npm version patch

# Minor (nova feature): 1.0.0 -> 1.1.0
npm version minor

# Major (breaking change): 1.0.0 -> 2.0.0
npm version major

# Publicar
npm publish
```

### Testar antes de publicar

```bash
# Gerar o tarball local
npm pack

# Instalar a partir do tarball em outro diretório
mkdir test-install && cd test-install
npm init -y
npm install ../caminho/para/cerrado-flow-1.0.0.tgz

# Verificar se os arquivos foram copiados
ls .agentic/ .opencode/
```

### Validação automática

O script `prepublishOnly` valida automaticamente que todos os arquivos obrigatórios existem antes de publicar. Se algo estiver faltando, a publicação é abortada.

### O que é incluído no pacote

O campo `files` no `package.json` controla exatamente o que entra no pacote npm:

| Incluído | Excluído |
|---|---|
| `.agentic/config.json` | `sql-runner.jar` |
| `.agentic/schemas/` | `db-config.json` |
| `.agentic/docs/` | `opencode.json` |
| `.agentic/templates/` | `install-agentic.bat` |
| `.agentic/site/generate.js` | `.agentic/memory/*.json` (runtime) |
| `.agentic/memory/.gitkeep` | `.opencode/node_modules/` |
| `.agentic/brain/wiki/` | `.opencode/package.json` |
| `.opencode/agents/` | `.opencode/package-lock.json` |
| `.opencode/commands/` | `.agentic/site/index.html` (gerado) |
| `.opencode/hooks/` | |
| `.opencode/instincts/` | |
| `.opencode/instructions/` | |
| `.opencode/skills/` | |
| `install.js`, `cli.js`, `index.js` | |

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

