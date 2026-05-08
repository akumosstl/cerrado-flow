---
name: orchestrate
description: Orquestra a execução completa do plano milestone a milestone, com verificação intermediária. Para no primeiro milestone que falhar, permitindo retomada via --from_milestone.
agents: orchestrator
temperature: 0.0
arguments:
  - name: orchestration_id
    description: "Identificador do plano (referencia planning_{{orchestration_id}}.json)"
    required: true
    default: "current"
  - name: from_milestone
    description: "Milestone inicial para retomada (default: 1)"
    required: false
    default: "1"
  - name: to_milestone
    description: "Milestone final (default: último milestone do plano)"
    required: false
    default: ""
  - name: skip_verify
    description: "Pula verificação entre milestones (default: false)"
    required: false
    default: "false"
---

# Comando: Orchestrate

Orquestra a execução do plano milestone a milestone, com verificação entre cada um. Se um milestone falhar na verificação, a execução para e permite retomada.

## Uso

```
/orchestrate <orchestration_id>
/orchestrate <orchestration_id> --from_milestone 3
/orchestrate <orchestration_id> --from_milestone 2 --to_milestone 3
/orchestrate <orchestration_id> --skip_verify true
```

## Exemplos

```
/orchestrate s1us005
/orchestrate s1us005 --from_milestone 4
/orchestrate s1us005 --skip_verify true
```

## O Que Faz

Para cada milestone (de `from_milestone` até `to_milestone`):

1. **Implementa** o milestone (lógica do milestone-implementer inline)
   - Executa as tasks do milestone em ordem de dependência
   - Para na primeira task que falhar (stop-on-fail)
   - Escreve `@.agentic/memory/implementation_{{id}}_m{{n}}.json`

2. **Verifica** o milestone (lógica do milestone-verifier inline) — a menos que `--skip_verify true`
   - Verifica os critérios do milestone
   - Executa build/test se aplicável
   - Escreve `@.agentic/memory/verify_{{id}}_m{{n}}.json`

3. **Decide**:
   - Se `fail`: **PARA** — não executa próximos milestones
   - Se `pass`: continua para o próximo milestone

4. Ao final, escreve `@.agentic/memory/orchestration_{{id}}.json` com status consolidado

## Fluxo de Execução

```
/orchestrate s1us005
  ├─ M1: implement → verify → pass ✓
  ├─ M2: implement → verify → pass ✓
  ├─ M3: implement → verify → fail ✗ → PARA
  │
  │  ... usuário corrige problema ...
  │  /milestone-impl s1us005 --milestone 3 --tasks T006
  │  /milestone-verify s1us005 --milestone 3 → pass ✓
  │
  └─ /orchestrate s1us005 --from_milestone 4
     └─ M4: implement → verify → pass ✓
```

## Parâmetros

| Parâmetro | Obrigatório | Descrição |
|---|---|---|
| `orchestration_id` | sim | ID do plano (ex: s1us005) |
| `from_milestone` | não | Milestone inicial (default: 1). Use para retomada |
| `to_milestone` | não | Milestone final (default: último). Use para escopo parcial |
| `skip_verify` | não | Pula verificação entre milestones (default: false) |

## Quando Usar

- Você quer executar o plano completo com verificação automática entre milestones
- Você quer retomar após uma falha corrigida (use `--from_milestone`)
- Você quer executar apenas um intervalo de milestones

## Pré-requisitos

- `@.agentic/memory/planning_{{orchestration_id}}.json` deve existir
- Se `--from_milestone > 1`: milestones anteriores devem ter sido completados

## O Que NAO Faz

- Não faz commit de mudanças (use `/ship`)
- Não re-planeja automaticamente em caso de falha (use `/replan`)
- Não pula milestones falhos — para no primeiro

## Próximos Passos

- Se `overall_status = success`: execute `/ship` para commitar ou `/verify` para verificação global
- Se `overall_status = failed`: corrija o problema, re-execute o milestone, e retome com `--from_milestone`
