# AGENTS.md

### Instincts Sempre Ativos

Estas regras se aplicam a toda invocação de `agent` sem exceção:

**Token Save** (`.opencode/instincts/token-save.md`):
- Saída como artefatos JSON — sem prosa, sem comentários
- Busca mais barata primeiro: Glob → Grep → Read → Bash
- Mantenha-se dentro dos limites de passos. Nunca releia o que você escreveu.
- Faça chamadas de ferramenta em lote em paralelo quando possível.

**No Prose** (`.opencode/instincts/no-prose.md`):
- Saídas de fases são apenas JSON — zero prosa fora da estrutura JSON
- Sem envoltório markdown, sem enchimento conversacional, sem preâmbulos
- Artefatos começam com `{` e terminam com `}`
- Não mostre Chain of Thought (CoT)

**Phase Boundary** (`.opencode/instincts/phase-boundary.md`):
- Analyzer: SOMENTE LEITURA. Não pode criar, modificar ou deletar nenhum arquivo fonte.
- Planner: SOMENTE LEITURA. Não pode criar, modificar ou deletar nenhum arquivo fonte.
- Implementer: LEITURA+ESCRITA+BASH. Deve seguir o plano exatamente. Sem desvios.
- Verifier: LEITURA+BASH(apenas teste). Não pode editar nenhum arquivo fonte.
- Violação de limites de fase é uma falha crítica — pipeline aborta.

## Memória e Contexto
- Antes de sugerir qualquer código Java/Spring, verifique se existe um padrão correspondente em `@.agentic/brain/wiki/concepts/`.
- Priorize sempre as definições e exemplos que salvamos na Wiki em vez de usar conhecimento genérico.
- Se eu perguntar "como fazemos X?", sua primeira ação deve ser ler `@.agentic/brain/wiki/index.md` para localizar o conceito.

## Protocolos Automáticos de Saída (Post-Action)
Sempre que uma tarefa for concluída com sucesso (especialmente correções de bugs ou novas implementações), você DEVE seguir este protocolo sem que eu peça:

1. **Avaliação de Conhecimento**: Se a solução envolveu um erro complexo ou um padrão de código Spring recorrente, pergunte: "Deseja catalogar esta solução em `@.agentic/brain/wiki/troubleshooting.md`?".
2. **Atualização de Contexto**: Se eu disser "sim", use o `@.agentic/templates/concept-template.md` para extrair a causa raiz, a solução e o código corrigido.
3. **Linkagem**: Adicione o link da nova solução no seu `@.agentic/brain/wiki/index.md`.

## Regra de Consulta Prévio-Implementação
- Antes de gerar QUALQUER novo arquivo de código, execute silenciosamente uma busca em `@.agentic/brain/wiki/concepts/` e `@.agentic/brain/wiki/troubleshooting.md`.
- Se houver conflito entre o que você ia sugerir e o que está na nossa Wiki, avise-me: "Notei na nossa Wiki que preferimos o padrão X, vou seguir ele".

### Regras de saída

1. Chain of Thought (CoT), tags `<thought>` ou `<Thinking>`, blocos "Thinking" estritamente proibidos
2. Gere resposta final imediatamente — sem raciocínio no fluxo de saída
3. Sem texto antes/depois de artefatos JSON

### Memória e Saída

- **Memória** (`@.agentic/memory/`): Artefatos de runtime produzidos por agentes durante a execução. Ephemeral por padrão.
- **Saída** (`@.agentic/output/`): Entregáveis finais do pipeline.

