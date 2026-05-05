---
name: git-release
description: Geração de changelog, bump de versão e marcação de release. Automatiza o fluxo de trabalho de release desde o histórico de commits até a tag git.
compatibility: [opencode, claude-code]
---

# Skill: Git Release

Fluxo de trabalho de release automatizado — gera changelogs, faz bump de versões e cria tags git.

## Quando Usar

- Você está pronto para cortar uma release
- Você quer um changelog a partir do histórico de commits
- Você quer fazer bump da versão do projeto e marcá-la

## Fluxo de Trabalho

### Passo 1: Determinar Versão Atual

```bash
git describe --tags --abbrev=0 2>/dev/null || echo "no tags"
```

Ou leia do arquivo de versão do projeto:
- `pom.xml` → elemento `<version>` (Maven)
- `package.json` → campo `"version"` (Node)
- `Cargo.toml` → `version = "..."` (Rust)

### Passo 2: Determinar Tipo de Bump de Versão

- **patch** (0.0.x): Correções de bugs, sem novas funcionalidades
- **minor** (0.x.0): Novas funcionalidades, compatível com versões anteriores
- **major** (x.0.0): Mudanças que quebram compatibilidade

Convenção: Use [conventional commits](https://www.conventionalcommits.org/) para auto-determinar:
- `fix:` → patch
- `feat:` → minor
- `feat!:` ou `BREAKING CHANGE:` → major

### Passo 3: Gerar Changelog

```bash
git log <last-tag>..HEAD --oneline --no-merges
```

Agrupe commits por tipo:
- **Funcionalidades**: commits `feat:`, `feat!:`
- **Correções**: commits `fix:`
- **Outros**: tudo mais

Formato:
```markdown
## v<nova-versão> (<data>)

### Funcionalidades
- <mensagem do commit> (<hash-curto>)

### Correções
- <mensagem do commit> (<hash-curto>)

### Outros
- <mensagem do commit> (<hash-curto>)
```

### Passo 4: Bump de Versão

Atualize a versão no arquivo do projeto:
- Maven: `mvn versions:set -DnewVersion=<versão>`
- Node: `npm version <patch|minor|major> --no-git-tag-version`
- Manual: Edite o campo de versão no arquivo do projeto

### Passo 5: Commit e Tag

```bash
git add <arquivo-versão> CHANGELOG.md
git commit -m "release: v<nova-versão>"
git tag -a v<nova-versão> -m "Release v<nova-versão>"
```

## Regras de Segurança

- Nunca force-push tags
- Nunca sobrescreva tags existentes (verifique com `git tag -l "v<versão>"`)
- Nunca faça release em uma working tree suja (verifique com `git status --porcelain`)
- Sempre verifique se os testes passam antes de marcar: `mvn test` ou `npm test`
