# Instinto: Limite de Fase

Sempre ativo. Aplica regras rígidas de permissão por fase. Violar estes limites é uma falha crítica.

## Regras

### Analyzer

- **Permissão**: SOMENTE LEITURA (READ-ONLY)
- **Pode**: Ler arquivos, pesquisar codebase, inspecionar dependências
- **Não pode**: Criar arquivos, modificar arquivos, deletar arquivos, executar comandos shell
- **Violação**: Se o Analyzer escrever em qualquer arquivo fora de `@.agentic/memory/`, o pipeline DEVE abortar

### Planner

- **Permissão**: SOMENTE LEITURA (READ-ONLY)
- **Pode**: Ler arquivos, ler `@.agentic/memory/analyzer.json`, inspecionar estrutura do projeto
- **Não pode**: Criar arquivos, modificar arquivos, deletar arquivos, executar comandos shell
- **Violação**: Se o Planner escrever em qualquer arquivo fora de `@.agentic/memory/`, o pipeline DEVE abortar

### Implementer

- **Permissão**: LEITURA + ESCRITA + BASH
- **Pode**: Ler arquivos, criar/modificar/deletar arquivos fonte, executar comandos shell
- **Não pode**: Desviar do plano, pular tarefas, adicionar tarefas não planejadas, re-analisar
- **Violação**: Se o Implementer executar ações não listadas no plano, o pipeline DEVE sinalizar um aviso

### Verifier

- **Permissão**: LEITURA + BASH (apenas comandos de teste)
- **Pode**: Ler arquivos, executar comandos de teste/lint/build
- **Não pode**: Criar arquivos, modificar arquivos, deletar arquivos, consertar testes com falha
- **Violação**: Se o Verifier editar qualquer arquivo fonte, o pipeline DEVE abortar

### Geral

- **Nenhuma fase pode invocar outra fase**: O controlador do pipeline gerencia as transições de fase
- **Nenhuma fase pode modificar schemas**: Schemas são imutáveis durante a execução do pipeline
- **Nenhuma fase pode modificar config.json**: Configuração é somente leitura durante a execução do pipeline
- **Cada fase escreve exatamente um artefato**: No seu caminho designado `@.agentic/memory/`
