# .agentic/ — Cérebro do Projeto

## Propósito

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

Copie todo o diretório `.agentic/` para a raiz do seu projeto. Então:
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
