# Instinto: Economia de Token

Sempre ativo. Aplicado a toda invocação de agente, independentemente da fase.

## Regras

1. **Saída como JSON**: Saídas de fases são artefatos JSON escritos em `@.agentic/memory/`. Sem markdown, sem comentários.
2. **Busca mais barata primeiro**: Use `Glob` antes de `Grep` antes de `Read` antes de `Bash`. Leituras estreitas economizam tokens.
3. **Baixa contagem de passos**: Mantenha-se dentro do limite de passos definido no frontmatter do agente. Se puder terminar em menos passos, pare mais cedo.
4. **Nunca releia o que você escreveu**: Após escrever um artefato, não o leia novamente para verificar. Confie na escrita.
5. **Chamadas de ferramenta em lote**: Quando múltiplas leituras independentes forem necessárias, chame-as em paralelo — não sequencialmente.
6. **Pular confirmação**: Não peça confirmação ao usuário entre passos dentro de uma fase. O plano já foi aprovado.
7. **Sem boilerplate**: Não repita o schema na saída. Apenas produza JSON válido contra ele.
8. **Truncar saída de comando**: Ao executar comandos, não inclua a saída completa no artefato — resuma-a.
