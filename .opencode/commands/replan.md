---
name: replan
description: Re-planeja a partir de falhas de verificação. Lê falhas do verifier e produz um plano atualizado para tratá-las. Máximo de 2 loops de replan.
agents: [analyzer, planner]
max_loops: 2
arguments:
  - name: id
    description: "O nome identificador do replan (ex: sprint1, sprint2, sprint3)"
    required: true
    default: "current"

---

# Comando: Replan

Re-planeja a partir de falhas de verificação. Lê a lista de falhas do Verifier e produz um plano atualizado para tratá-las.

## Uso

```
/replan <id>
```

## O Que Faz

1. Lê `@.agentic/memory/verifier_{{arguments.id}}.json` para a lista de falhas
2. Invoca o agente `analyzer` para avaliar as falhas e suas causas raiz
3. Invoca o agente `planner` para criar um plano de correção direcionado às falhas específicas
4. Escreve artefatos atualizados em `.agentic/memory/`

## Loop de Replan

```
/implement → verify → fail → /replan → implement → verify → pass ✓
                                   └→ fail → /replan → implement → verify → pass ✓
                                                              └→ fail → PARAR (máx 2 loops)
```

- Máximo de **2 loops de replan** (configurável em `@.agentic/config.json` via `max_replan_loops`)
- Após 2 replans falhos, o pipeline para e requer intervenção humana

## Quando Usar

- Após `/implement` ou `/verify` produzir um veredito `fail`
- Você quer que o pipeline trate automaticamente falhas de verificação
- Você quer iterar sem começar do zero

## O Que NÃO Faz

- Não implementa as correções (execute `/implement` após o replanning)
- Não faz commit de nada
- Não contorna o limite de loop de replan

## Próximos Passos

Após `/replan`, execute `/implement` para executar o plano atualizado, depois `/verify` para verificar.
