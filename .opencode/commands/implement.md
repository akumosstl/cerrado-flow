---
name: implement
description: Executa a implementação de um planner.
agents: implementer
model: default
temperature: 0.1
arguments:
  - name: id
    description: "O nome identificador da implementação (ex: sprint1, sprint2, sprint3)"
    required: true
    default: "current"
---

# Comando: Implement

Executa o agent `implementer`.

## Uso

```
/implement <id>
```

## O Que Faz

1. **implementer**: executa o agent `implementer` passando o `id`


## Quando Usar

- Você quer uma implementação totalmente automatizada de ponta a ponta
- Você confia no pipeline para executar sem revisão manual entre fases
- A tarefa é bem definida e o risco de desvio é baixo


## O Que NAO Faz

- Não faz commit de mudanças no git (use `/ship` para isso)
- Não corrige automaticamente falhas de verificação

## Próximos Passos

- Se o veredito for `pass`: execute `/ship` para commitar e finalizar
- Se o veredito for `fail`: execute `/replan` para tratar as falhas
