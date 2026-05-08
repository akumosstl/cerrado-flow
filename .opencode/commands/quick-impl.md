---
name: quick-impl
description: Executa uma implementação simples.
agents: implementer
temperature: 0.1
arguments:
  - name: implementation_id
    description: "O nome identificador da implementação"
    required: true
    default: "current"
---

# Comando: Implement

Executa o agent `implementer`.

## Uso

```
/quick-impl <implementation_id> <user-query>
```

## O Que Faz

1. **implementer**: executa o agent `quick-impl` passando o `implementation_id` e o `user-query`


## Quando Usar

- Você quer uma implementação totalmente automatizada de ponta a ponta
- Você confia no pipeline para executar sem revisão manual entre fases
- A tarefa é bem definida e o risco de desvio é baixo


## O Que NAO Faz

- Não faz commit de mudanças no git (use `/ship` para isso)
- Não corrige automaticamente falhas de verificação
