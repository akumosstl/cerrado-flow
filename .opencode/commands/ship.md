---
name: ship
description: Executa o pipeline completo (implement → verify → git commit). Se a verificação passar, faz commit de todas as mudanças.
agents: [analyzer, planner, implementer, verifier]
post: git_commit
---

# Comando: Ship

Executa o **pipeline completo de 4 fases** seguido de um **git commit** se a verificação passar.

## Uso

```
/ship <descrição da tarefa>
```

## O Que Faz

1. Executa `/implement` (Analyzer → Planner → Implementer → Verifier)
2. Se o veredito do Verifier for `pass`:
   - Stages todos os arquivos modificados (`git add`)
   - Cria um commit com uma mensagem derivada do plano
3. Se o veredito do Verifier for `fail`:
   - NÃO faz commit
   - Relata as falhas
   - Sugere executar `/replan`

## Quando Usar

- Você quer implementar e fazer commit em um único comando
- A tarefa é bem compreendida e de baixo risco
- Você quer entrega com "um clique"

## Formato da Mensagem de Commit

```
<type>(<scope>): <summary>

Plan: <plan_reference>
Tasks: T001, T002, ...
Verdict: pass
```

## Segurança

- Nunca force-push
- Nunca faz commit de segredos
- Nunca pula verificação
- Se o pipeline falhar em qualquer fase, nada é commitado

## O Que NÃO Faz

- Não faz push para remote (você deve fazer push manualmente)
- Não cria tags ou releases (use a skill `git-release` para isso)
