---
name: plan
description: Lê a análise e a transforma em um plano executável.
agents: planner
model: default
arguments:
  - name: id
    description: "O nome identificador do plan (ex: sprint1, sprint2, sprint3)"
    required: true
    default: "current"
---

# Comando: Plan

Executa o **analyzer**.

## Uso

```
/plan <id>
```

## O Que Faz

1. Executa o agente `planner` passando o `id` 

## Quando Usar

- Você quer um plano completo sem executá-lo
- Você quer revisar o plano antes do início da implementação
- Você quer iterar sobre o plano antes de se comprometer com `/implement`

## O Que NAO Faz

- Não cria nem modifica nenhum arquivo fonte (Planner é somente leitura)
- Não implementa nada
- Não verifica nada

## Próximos Passos

Após `/plan`, revise `@.agentic/memory/planner_{{arguments.id}}.json`. Se satisfeito, execute `/implement` para executar o plano.
