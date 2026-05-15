# 📄 Especificação de Desenvolvimento de IA: [Nome da Funcionalidade]

## 1. Visão Geral
*   **Objetivo:** Descrever o problema que a IA está resolvendo.
*   **Usuário-Alvo:** Quem irá interagir com a saída da IA?
*   **Métrica de Sucesso:** Como saber que a IA está performando bem? (ex: taxa de alucinação < 5%, tom de voz adequado).

## 2. Stack de IA & Configuração
*   **Modelo:** (ex: GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro)
*   **Temperatura:** [0.0 - 1.0] (Baixa para fatos/lógica, alta para criatividade)
*   **Máximo de Tokens:** Limite para o tamanho da resposta.
*   **Formato da Resposta:** ( ) Texto Simples  ( ) Objeto JSON  ( ) Markdown.

## 3. Engenharia de Prompt (Prompt Engineering)
### Prompt de Sistema (Persona)
> "Você é um [Papel/Cargo]. Seu tom de voz é [Estilo]. Sua tarefa principal é [Objetivo]..."

### Contexto / Restrições
*   **O que DEVE fazer:** Listar comportamentos obrigatórios.
*   **O que NÃO DEVE fazer:** Listar tópicos proibidos ou comportamentos indesejados (Guardrails).

### Exemplos (Few-Shot)
*   **Input:** "Exemplo de texto de entrada aqui."
*   **Output:** "Resposta esperada da IA aqui."

## 4. Estrutura de Dados (Schema de Saída)
*Se estiver usando JSON, definir as chaves esperadas:*
```json
{
  "status": "string",
  "resumo": "text",
  "score_confianca": "float",
  "tags": ["array"]
}
```

## 5. Recuperação de Conhecimento (RAG)
*Preencher apenas se a IA precisar acessar documentos específicos.*
*   **Fonte de Dados:** (ex: Banco Vetorial, pasta de PDFs, documentação via API).
*   **Top-K Results:** Quantos trechos de documentos serão enviados ao contexto da IA.

## 6. Tratamento de Erros & Fallbacks
*   **Falha na API:** O que acontece se o provedor (OpenAI/Anthropic) cair?
*   **JSON Inválido:** Lógica para tentar novamente (retry) ou tratar um JSON malformado.
*   **Filtro de Segurança:** Estratégia para conteúdos bloqueados (ex: mensagem de desculpas genérica).

## 7. Roadmap de Desenvolvimento
- [ ] Prototipagem do prompt no Playground.
- [ ] Integração com a API/Backend.
- [ ] Testes de acurácia e avaliação (Evals).
- [ ] Estimativa de custo por cada 1.000 requisições.
