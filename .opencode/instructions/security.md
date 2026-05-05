# Instruções: Segurança

Carregado no início da sessão. Regras de segurança aplicáveis a qualquer projeto.

## Regras Rígidas (Nunca Viole)

1. **Sem segredos no código fonte**: Chaves de API, senhas, tokens, certificados — nunca os codifique permanentemente. Use variáveis de ambiente, gerenciadores de segredos ou arquivos `.env` excluídos do controle de versão.
2. **Sem segredos em artefatos**: Saídas de agentes em `@.agentic/memory/` e `@.agentic/output/` NÃO DEVEM conter credenciais. Redatar antes de escrever.
3. **Valide todas as entradas**: Toda entrada externa (parâmetros HTTP, args CLI, conteúdo de arquivo, variáveis de ambiente) é validada antes do uso. Tipo, comprimento, formato, intervalo.
4. **Apenas consultas parametrizadas**: Nunca concatene entrada do usuário em SQL, LDAP ou comandos shell. Use instruções parametrizadas/preparadas.
5. **Sem `eval` ou equivalente**: Nunca avalie strings fornecidas pelo usuário. Nenhum `Runtime.exec(String)`, nenhum `eval()`, nenhum `exec()` com entrada não sanitizada.
6. **Princípio do menor privilégio**: Agentes, serviços e processos executam com as permissões mínimas necessárias. O Analyzer não precisa de acesso de escrita. O Verifier não precisa de acesso de edição de fonte.

## Tratamento de Dados

1. **Sem PII em logs**: Não registre dados pessoais (emails, nomes, IDs). Faça hash ou trunque se necessário para depuração.
2. **Criptografe em repouso e em trânsito**: Dados sensíveis em bancos de dados são criptografados. Chamadas de API usam HTTPS.
3. **Sanitize antes de renderizar**: Todo conteúdo fornecido pelo usuário renderizado em HTML/UI é escapado para HTML para prevenir XSS.

## Segurança de Dependências

1. **Verifique vulnerabilidades conhecidas**: Antes de adicionar uma dependência, verifique se não tem CVEs críticas.
2. **Fixe versões de dependências**: Use versões exatas, não intervalos. Builds reproduzíveis são builds seguros.
3. **Dependências mínimas**: Cada dependência é superfície de ataque. Se você pode fazer com a stdlib, faça.

## Segurança Específica de Agentes

1. **Allowlist de comandos do Implementer**: O Implementer só deve executar comandos necessários para o plano. Sem acesso shell arbitrário.
2. **Restrições de ferramenta de consulta**: Se implementar uma ferramenta de execução de consulta, permita apenas instruções `SELECT`. Bloqueie `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `CREATE` na camada de serviço — não apenas por convenção.
3. **Tratamento de credenciais de conexão**: Credenciais de banco de dados são injetadas via configuração Spring, nunca codificadas permanentemente. Use beans `DataSource`, não `DriverManager.getConnection(url, user, pass)` manual.
4. **Limites de timeout de consulta**: Todas as consultas de banco de dados DEVEM ter um timeout. Consultas ilimitadas são um vetor de DoS.
