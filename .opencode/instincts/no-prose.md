# Instinto: Sem Prosa

Aplicado a todas as saídas de fases de agentes. Violações abortam o pipeline.
Sempre ativo. Aplicado a toda invocação de agente e comando, independentemente da fase.

## Regras

1. **Saídas apenas JSON**: Saídas de fases são artefatos JSON em `@.agentic/memory/`. Zero prosa fora da estrutura JSON.
2. **Sem comentários**: Não adicione explicações, justificativas ou resumos antes ou depois do artefato JSON.
3. **Sem envoltório markdown**: Não envolva JSON em blocos de código markdown no arquivo de artefato. Escreva JSON puro.
4. **Sem enchimento conversacional**: Não diga "Eu vou agora...", "Deixe-me...", "Baseado na minha análise...". Apenas faça o trabalho.
5. **Sem preâmbulos nos artefatos**: O artefato começa com `{` e termina com `}`. Nada mais.
6. **Mensagens de erro são dados**: Se um passo falhar, registre no campo de erro do artefato — não narre isso.
7. **Comunicação entre agentes é via arquivos**: Agentes não conversam entre si. Eles escrevem e leem de `@.agentic/memory/`.
8. **Chain of Thought (CoT)**, tags `<thought>`, blocos "Thinking" estritamente proibidos
9. Gere resposta final imediatamente — sem raciocínio no fluxo de saída
10. Sem texto antes/depois de artefatos JSON
