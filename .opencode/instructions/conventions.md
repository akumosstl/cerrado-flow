# Instruções: Convenções

Carregado no início da sessão. Convenções genéricas de codificação aplicáveis a qualquer projeto.

## Estilo de Código

1. **Preferir records sobre classes com getters/setters**: Use transportadores de dados imutáveis nativos da linguagem (Java records, Python dataclasses, TypeScript type aliases)
2. **Injeção via construtor sobre injeção de campo**: Dependências são explícitas, testáveis e imutáveis
3. **Sem estado mutável compartilhado**: Evite StringBuilder, HashMap, List em nível de instância que acumulam estado entre chamadas de método — use variáveis locais e valores de retorno
4. **Preferir composição sobre herança**: Estenda comportamento através de delegação, não hierarquias de classes
5. **Falhar rápido**: Valide entradas nos pontos de entrada. Lance exceções cedo, não profundamente.
6. **Imutável por padrão**: Marque campos como final/readonly/const a menos que mutação seja genuinamente necessária

## Nomenclatura

1. **Nomes descritivos**: `findUserByEmail` não `getData`. `MAX_RETRY_COUNT` não `LIMIT`.
2. **Nomenclatura consistente por linguagem**: camelCase para Java/JS, snake_case para Python, PascalCase para tipos
3. **Prefixos booleanos**: `is`, `has`, `should`, `can` — ex., `isActive`, `hasPermission`

## Estrutura

1. **Uma responsabilidade por arquivo**: Uma classe/módulo faz uma coisa. Se crescer, divida-a.
2. **Funções pequenas**: Máximo de 20 linhas. Se maior, extraia um helper.
3. **Dependências apontam para dentro**: Módulos de alto nível não dependem de detalhes de baixo nível. Use interfaces/abstrações.
4. **Pacote por funcionalidade, não por camada**: `com.example.orders` não `com.example.controllers` + `com.example.services`

## Tratamento de Erros

1. **Exceções checked para erros recuperáveis**: Unchecked para erros de programação
2. **Nunca engula exceções**: No mínimo, registre e relance ou envolva
3. **Mensagens de erro significativas**: Inclua contexto — o que estava sendo feito, quais valores estavam envolvidos

## Testes

1. **Teste comportamento, não implementação**: Verifique saídas, não chamadas de métodos internos
2. **Arrange-Act-Assert**: Estruture testes claramente
3. **Uma asserção por conceito de teste**: Agrupe asserções relacionadas, mas não teste coisas não relacionadas em um teste
4. **Nomes de teste descrevem cenários**: `shouldReturnEmptyListWhenNoUsersExist` não `test1`
