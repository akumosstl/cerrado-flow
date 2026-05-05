---
name: refactor
description: Padrões seguros de refatoração — extrair método, introduzir objeto de parâmetro, substituir condicional por polimorfismo e mais.
compatibility: [opencode, claude-code]
---

# Skill: Refatoração

Catálogo de padrões de refatoração seguros e incrementais. Cada padrão inclui um procedimento passo a passo que preserva o comportamento.

## Quando Usar

- Você precisa reestruturar código sem mudar comportamento
- Você quer reduzir complexidade, duplicação ou acoplamento
- Você quer seguir um padrão de refatoração comprovado em vez de mudanças ad-hoc

## Princípios Orientadores

1. **Uma refatoração de cada vez**: Nunca combine múltiplas refatorações em um passo
2. **Execute testes após cada passo**: Verifique se o comportamento é preservado após cada mudança
3. **Commits pequenos**: Uma refatoração = um commit, com o nome do padrão na mensagem
4. **Preserve a API pública**: Contratos externos não devem mudar durante a refatoração

## Padrões

### Extrair Método

**Quando**: Um método é muito longo ou faz mais do que uma coisa.

**Passos**:
1. Identificar um bloco coerente de código dentro do método
2. Criar um novo método com um nome descritivo
3. Copiar o bloco para o novo método
4. Substituir o bloco original por uma chamada ao novo método
5. Passar quaisquer variáveis locais como parâmetros
6. Executar testes

**Exemplo**:
```java
// Antes
void printReport() {
    // ... 50 linhas de formatação de cabeçalho ...
    // ... 30 linhas de formatação de corpo ...
}

// Depois
void printReport() {
    formatHeader();
    formatBody();
}
```

### Introduzir Objeto de Parâmetro

**Quando**: Um método tem 3+ parâmetros, ou múltiplos métodos compartilham o mesmo grupo de parâmetros.

**Passos**:
1. Criar uma classe/record para conter o grupo de parâmetros
2. Adicionar os campos (final, definidos via construtor)
3. Adicionar o objeto de parâmetro como primeiro parâmetro do método
4. Substituir parâmetros individuais por acessos de campo no objeto
5. Remover os parâmetros antigos um por um
6. Executar testes

**Exemplo**:
```java
// Antes
void search(String query, int page, int size, String sort, String order)

// Depois
record SearchRequest(String query, int page, int size, String sort, String order) {}
void search(SearchRequest request)
```

### Substituir Condicional por Polimorfismo

**Quando**: Você tem uma cadeia switch/if-else que verifica um código de tipo.

**Passos**:
1. Criar uma hierarquia de tipos (interface + implementações)
2. Mover cada ramo do condicional para sua própria implementação
3. Substituir o condicional por uma chamada de método na interface
4. Executar testes

### Substituir Herança por Delegação

**Quando**: Uma subclasse herda apenas para reuso de código, não para relacionamento "é-um".

**Passos**:
1. Criar um campo do tipo da classe pai na subclasse
2. Delegar cada chamada de método ao campo
3. Remover a cláusula extends
4. Executar testes

### Extrair Interface

**Quando**: Múltiplas classes compartilham as mesmas assinaturas de método mas não têm um supertipo comum.

**Passos**:
1. Identificar as assinaturas de método comuns
2. Criar uma interface com esses métodos
3. Fazer cada classe implementar a interface
4. Mudar código consumidor para depender da interface, não da classe concreta
5. Executar testes

### Substituir Número Mágico por Constante Nomeada

**Quando**: Um valor literal aparece no código sem explicação.

**Passos**:
1. Encontrar todas as ocorrências do literal
2. Criar uma constante nomeada (static final)
3. Substituir cada ocorrência pelo nome da constante
4. Executar testes

## Convenção de Mensagem de Commit

```
refactor(<escopo>): <nome-do-padrão>

<explicação opcional>
```

Exemplos:
- `refactor(report): extract-method formatHeader`
- `refactor(search): introduce-parameter-object SearchRequest`
- `refactor(pricing): replace-conditional-with-polymorphism`
