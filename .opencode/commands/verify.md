---
name: verify
description: Executa o agente Verifier no estado atual. Verifica artefatos de implementação existentes contra critérios de sucesso do plano.
agent: verifier
model: default
arguments:
  - name: id
    description: "O nome identificador do verify (ex: sprint1, sprint2, sprint3)"
    required: true
    default: "current"
---

# Comando: Verify

Executa **apenas** a fase Verifier contra o estado atual do pipeline.
Ao finalizar, salve o resultado obrigatoriamente no caminho: 
`@.agentic/memory/verify_{{arguments.id}}.json`


## Uso

```
/verify <id>
```

## O Que Faz

1. Lê `@.agentic/memory/planning_{{arguments.id}}.json` para critérios de sucesso
2. Lê `@.agentic/memory/implementation_{{arguments.id}}.json` para o registro de implementação
3. Executa verificações (build, test, lint, existência de arquivo, verificações de conteúdo)
4. Produz `@.agentic/memory/verify_{{arguments.id}}.json` com um veredito passa/falha

## Quando Usar

- Você já executou `/implement` e quer re-verificar após correções manuais
- Você fez mudanças manuais e quer verificar se satisfazem o plano
- Você quer verificar sem re-executar todo o pipeline

## Pré-requisitos

- `@.agentic/memory/planning_{{arguments.id}}.json` deve existir (o Verifier precisa dos critérios de sucesso do plano)
- `@.agentic/memory/implementation_{{arguments.id}}.json` deve existir (o Verifier referencia-o)

## O Que NAO Faz

- Não corrige verificações com falha
- Não modifica nenhum arquivo fonte
- Não re-executa o Analyzer ou Planner

## Próximos Passos

- Se o veredito for `pass`: sua implementação está verificada
- Se o veredito for `fail`: revise `failures` na saída do verifier, corrija problemas e re-execute `/verify`
