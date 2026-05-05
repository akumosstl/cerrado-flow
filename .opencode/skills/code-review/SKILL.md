---
name: code-review
description: Padrões sistemáticos de revisão de código, checklist de anti-padrões comuns e fluxo de trabalho de revisão de segurança.
compatibility: [opencode, claude-code]
---

# Skill: Revisão de Código

Revisão sistemática de código com detecção de anti-padrões e checklist de segurança.

## Quando Usar

- Você quer revisar código antes de fazer merge
- Você quer pegar anti-padrões e problemas de segurança
- Você quer um checklist de revisão estruturado

## Categorias de Revisão

### 1. Correção

- [ ] Erros lógicos: off-by-one, condição errada, verificação de nulo faltando
- [ ] Condições de corrida: estado mutável compartilhado, acesso não sincronizado
- [ ] Vazamento de recursos: streams não fechados, conexões, handles de arquivo
- [ ] Tratamento de erros: exceções engolidas, blocos catch faltando
- [ ] Condições de fronteira: coleções vazias, strings de comprimento zero, entradas nulas

### 2. Segurança

- [ ] Injeção SQL: consultas concatenadas, entrada não sanitizada em SQL
- [ ] XSS: conteúdo do usuário não escapado em saída HTML
- [ ] Exposição de segredos: credenciais hardcoded, chaves de API no fonte
- [ ] Validação de entrada: verificações de tipo/comprimento/formato faltando em entrada externa
- [ ] Autorização: verificações de permissão faltando em operações sensíveis
- [ ] CSRF: tokens faltando em requisições que mudam estado

### 3. Desempenho

- [ ] Consultas N+1: consultas de banco de dados dentro de loops
- [ ] Alocações desnecessárias: objetos criados em caminhos quentes
- [ ] Índices faltando: consultas de banco sem índices adequados
- [ ] I/O síncrono em contexto assíncrono: chamadas bloqueantes em código reativo/assíncrono
- [ ] Retenção de objetos grandes: caches sem limite de tamanho, coleções crescentes

### 4. Manutenibilidade

- [ ] Classe/método Deus: muitas responsabilidades em uma única unidade
- [ ] Código duplicado: lógica copy-paste que deveria ser extraída
- [ ] Números mágicos: constantes sem nome, configuração hardcoded
- [ ] Over-engineering: abstrações desnecessárias, otimização prematura
- [ ] Documentação faltando: APIs públicas sem comentários de documentação

### 5. Concorrência

- [ ] Estado mutável compartilhado: StringBuilder em nível de instância, HashMap entre requisições
- [ ] Double-checked locking: padrões quebrados em inicialização lazy
- [ ] Coleções não thread-safe: HashMap usado concorrentemente (deveria ser ConcurrentHashMap)
- [ ] Potencial de deadlock: múltiplos locks adquiridos em ordem inconsistente

### 6. Arquitetura

- [ ] Violações de camada: controllers acessando DAOs diretamente
- [ ] Dependências circulares: pacotes/módulos que se importam mutuamente
- [ ] Acoplamento a framework: lógica de negócio dependendo de classes específicas de framework
- [ ] Abstração faltando: tipos brutos em vez de interfaces

## Formato de Saída de Revisão

```json
{
  "reviewer": "code-review",
  "files_reviewed": ["path/to/file.java"],
  "findings": [
    {
      "id": "R001",
      "file": "src/main/java/com/example/Foo.java",
      "line": 42,
      "category": "security",
      "severity": "high",
      "message": "Consulta SQL construída via concatenação de strings",
      "suggestion": "Use consulta parametrizada com PreparedStatement"
    }
  ],
  "summary": "3 descobertas: 1 alta, 1 média, 1 baixa",
  "verdict": "request_changes"
}
```

Vereditos: `approve`, `request_changes`, `comment`
