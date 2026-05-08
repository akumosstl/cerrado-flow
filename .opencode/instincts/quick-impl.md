# Instinto: Modo /quick-impl

Sempre ativo. Aplica-se quando o agente é invocado via slash command `/quick-impl`.

## Regras

1. **Sem artefatos de análise/plano**: No modo `/quick-impl`, as fases de analyzer e planner são puladas. Arquivos `analysis_*.json` e `plan_*.json` NÃO existem em `@.agentic/memory/`. Não tente lê-los.

2. **Vá direto ao código**: Comece a implementação imediatamente com exploração do código fonte. Use Glob → Grep → Read para localizar os arquivos relevantes.

3. **Sem pipeline de fases**: Não execute analyzer, planner ou verifier como sub-agentes. O `/quick-impl` é uma única fase de implementação direta.

4. **Validação ao final**: Após as alterações, execute lint/typecheck se o projeto tiver esses comandos configurados.

5. **Artefato JSON obrigatório**: Escreva o artefato em `@.agentic/memory/quick_impl_{{implementation_id}}.json` seguindo `@.agentic/schemas/implementation.json`. Zero prosa na saída — aplique integralmente as regras de `no-prose.md`.
