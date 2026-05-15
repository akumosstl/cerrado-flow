---
name: reserch
description: Executa apenas o agente Researcher. Produz uma pesquisa estruturada da solicitação atual e a escreve em @.agentic/memory/researching_{id}.json.
agent: researcher
temperature: 0.3
arguments:
- name: id
  description: "O nome identificador da pesquisa (ex: sprint1, sprint2, sprint3)"
  required: true
  default: "current"
---

# Comando: Research

Executa **apenas** a fase Researcher do pipeline Agentic.

## Uso

```
/reserch <id> <descrição da tarefa>
```

## O Que Faz

1. Invoca o agente `researcher` com `id` e a descrição da tarefa do usuário

## Quando Usar

- Você quer validar uma hipótese de produto antes de se comprometer com um plano
- Você precisa de benchmark competitivo e análise de landscape
- Você quer mapear personas e jornadas de dor/solução
- Você quer estruturar requisitos para um PRD antes de executar `/plan`

## O Que NAO Faz

- Não cria nem modifica nenhum arquivo fonte
- Não produz um plano de implementação
- Não implementa nada
- Não faz análise técnica de código (use `/analyze` para isso)

## Próximos Passos

Após `/reserch`, execute `/analyze` para produzir uma análise técnica a partir da pesquisa, ou `/plan` para produzir um plano de execução.
