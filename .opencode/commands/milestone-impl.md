---
name: milestone-impl
description: Executa a implementação de um milestone específico do plano. Implementa apenas as tasks daquele milestone com política stop-on-fail.
agents: milestone-implementer
temperature: 0.1
arguments:
  - name: implementation_id
    description: "Identificador do plano (referencia planning_{{implementation_id}}.json)"
    required: true
    default: "current"
  - name: milestone
    description: "Número do milestone a implementar (1-based)"
    required: true
    default: "1"
  - name: tasks
    description: "Lista explícita de task IDs separados por vírgula (ex: T001,T002). Sobrepõe o mapeamento por milestone."
    required: false
    default: ""
---

# Comando: Milestone Implement

Executa o agente `milestone-implementer` para implementar um milestone específico do plano.

## Uso

```
/milestone-impl <implementation_id> --milestone <n>
/milestone-impl <implementation_id> --tasks T001,T002
```

## Exemplos

```
/milestone-impl s1us005 --milestone 1
/milestone-impl s1us005 --milestone 2
/milestone-impl s1us005 --tasks T006,T007
```

## O Que Faz

1. Executa o agente `milestone-implementer` que:
   - Lê `@.agentic/memory/planning_{{implementation_id}}.json`
   - Mapeia tasks ao milestone por convenção de ordem (camadas de dependência)
   - Executa APENAS as tasks daquele milestone, em ordem de dependência
   - Para na primeira task que falhar (stop-on-fail)
   - Escreve `@.agentic/memory/implementation_{{id}}_m{{milestone}}.json`

## Quando Usar

- Você quer implementar um milestone por vez com controle granular
- Você quer corrigir e re-implementar um milestone específico após falha
- Você quer implementar tasks específicas sem executar o milestone inteiro

## Parâmetros

| Parâmetro | Obrigatório | Descrição |
|---|---|---|
| `implementation_id` | sim | ID do plano (ex: s1us005) |
| `milestone` | sim* | Número do milestone (1-based) |
| `tasks` | não | Lista de task IDs (ex: T001,T002). Sobrepõe `milestone` se fornecido |

*Se `tasks` for fornecido, `milestone` é usado apenas para nomear o artefato de saída.

## Pré-requisitos

- `@.agentic/memory/planning_{{implementation_id}}.json` deve existir
- Milestones anteriores devem ter sido completados (dependências satisfeitas)

## O Que NAO Faz

- Não verifica a implementação (use `/milestone-verify`)
- Não implementa milestones subsequentes automaticamente
- Não faz commit de mudanças (use `/ship`)

## Próximos Passos

Após `/milestone-impl`, execute `/milestone-verify` para verificar o milestone implementado.
