---
name: plan
description: Lê a análise e a transforma em um plano executável.
agents: planner
arguments:
  - name: planner_id
    description: "Identificador usado no nome do artefato (planning_{{planner_id}}.json)"
    required: true
    default: "current"
---

# Comando: Plan

Executa o **planner**.

## Uso

```
/plan <planner_id>
```

## O Que Faz

1. Executa o agente `planner` passando o `planner_id` 

## Quando Usar

- Você quer um plano completo sem executá-lo
- Você quer revisar o plano antes do início da implementação
- Você quer iterar sobre o plano antes de se comprometer com `/implement`

## O Que NAO Faz

- Não cria nem modifica nenhum arquivo fonte (Planner é somente leitura)
- Não implementa nada
- Não verifica nada

## Próximos Passos

Após `/plan`, revise `@.agentic/memory/planning_{{planner_id}}.json`. Se satisfeito, execute `/implement` para executar o plano.
