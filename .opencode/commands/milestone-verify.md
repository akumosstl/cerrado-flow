---
name: milestone-verify
description: Executa a verificação de um milestone específico. Verifica a implementação contra os critérios daquele milestone apenas, produzindo veredito pass/fail.
agents: milestone-verifier
temperature: 0.0
arguments:
  - name: verification_id
    description: "Identificador do plano (referencia planning_{{verification_id}}.json)"
    required: true
    default: "current"
  - name: milestone
    description: "Número do milestone a verificar (1-based)"
    required: true
    default: "1"
---

# Comando: Milestone Verify

Executa o agente `milestone-verifier` para verificar a implementação de um milestone específico.

## Uso

```
/milestone-verify <verification_id> --milestone <n>
```

## Exemplos

```
/milestone-verify s1us005 --milestone 1
/milestone-verify s1us005 --milestone 2
```

## O Que Faz

1. Executa o agente `milestone-verifier` que:
   - Lê `@.agentic/memory/planning_{{verification_id}}.json` → extrai criteria do milestone alvo
   - Lê `@.agentic/memory/implementation_{{verification_id}}_m{{milestone}}.json` → registro da implementação
   - Verifica APENAS os critérios daquele milestone (não verifica todo o plano)
   - Executa build/test se o milestone inclui tasks backend/frontend
   - Produz veredito: `pass` / `fail`
   - Escreve `@.agentic/memory/verify_{{id}}_m{{milestone}}.json`

## Quando Usar

- Você executou `/milestone-impl` e quer verificar o resultado
- Você fez correções manuais e quer re-verificar um milestone
- Você quer validar um milestone antes de prosseguir para o próximo

## Parâmetros

| Parâmetro | Obrigatório | Descrição |
|---|---|---|
| `verification_id` | sim | ID do plano (ex: s1us005) |
| `milestone` | sim | Número do milestone a verificar (1-based) |

## Pré-requisitos

- `@.agentic/memory/planning_{{verification_id}}.json` deve existir
- `@.agentic/memory/implementation_{{verification_id}}_m{{milestone}}.json` deve existir

## O Que NAO Faz

- Não verifica outros milestones
- Não corrige falhas automaticamente
- Não modifica nenhum arquivo fonte

## Próximos Passos

- Se veredito for `pass`: prosseguir para o próximo milestone com `/milestone-impl` ou `/orchestrate`
- Se veredito for `fail`: revisar `failures` no artefato, corrigir problemas, e re-executar `/milestone-impl` ou `/milestone-verify`
