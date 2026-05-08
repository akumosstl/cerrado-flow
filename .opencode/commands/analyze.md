---
name: analyze
description: Executa apenas o agente Analyzer.
agent: analyzer
temperature: 0.1
arguments:
  - name:  analysis_id
    description: "O nome identificador da análise"
    required: true
    default: "current"
---

# Comando: Analyze

Executa **apenas** a fase Analyzer do pipeline Agentic, chamando o agente `analyzer`.

## Uso

```
/analyze < analysis_id> <descrição da tarefa>
```

## O Que Faz

1. Invoca o agente `analyzer` com ` analysis_id` e a descrição da tarefa do usuário

## Quando Usar

- Você quer entender o estado atual antes de se comprometer com um plano
- Você quer uma avaliação de risco sem prosseguir para implementação
- Você quer fazer um checkpoint da análise antes de executar `/plan`

## O Que NAO Faz

- Não cria nem modifica nenhum arquivo fonte
- Não produz um plano
- Não implementa nada

## Próximos Passos

Após `/analyze`, execute `/plan` para produzir um plano de execução a partir da análise.
  