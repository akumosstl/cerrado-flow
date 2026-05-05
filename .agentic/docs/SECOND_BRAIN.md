# 🧠 OpenCode Self-Learning Wiki (Spring Boot Edition)

Este projeto é um sistema de **Wiki Gerenciada por IA** (baseado no padrão LLM-Wiki). Ele utiliza o OpenCode para processar arquivos brutos, extrair conceitos e manter uma base de conhecimento interconectada sobre Spring Boot e Java.

## 🏗️ Arquitetura do Sistema

O projeto segue a estrutura de três camadas:
1.  **`/raw`**: Repositório de fontes brutas (PDFs, notas, artigos). *O agente apenas lê daqui.*
2.  **`/wiki`**: O cérebro do projeto. Contém conceitos, resumos e logs organizados.
3.  **`.opencode`**: Contém os templates e comandos que automatizam a manutenção.

## 🚀 Comandos Customizados

Você pode executar estes comandos diretamente no terminal do OpenCode:


| Comando | Descrição | Uso |
| :--- | :--- | :--- |
| `/ingest` | Processa um arquivo da pasta `raw/` e cria páginas de conceitos. | `/ingest arquivo.md` |
| `/search` | Busca profunda e relacional em toda a wiki (conceitos + erros). | `/search termo` |
| `/lint` | Faxina técnica: encontra links quebrados e notas fora do padrão. | `/lint` |
| `/summarize-session` | Consolida o que foi aprendido no dia e gera o log de progresso. | `/summarize-session` |

## 🛠️ Como Contribuir com a Wiki

1.  **Adicionar Conteúdo**: Coloque qualquer anotação ou código em `/raw`.
2.  **Ingestão**: Rode `/ingest nome-do-arquivo.md`. O agente criará os arquivos em `wiki/concepts/` usando o template padronizado.
3.  **Troubleshooting**: Sempre que resolver um bug complexo, o agente perguntará se deve salvar a solução em `wiki/troubleshooting.md`. Diga "Sim".

## 📂 Organização da Wiki

- **`wiki/concepts/`**: Definições técnicas (ex: `@RestController`, `JPA`).
- **`wiki/summaries/`**: Visões gerais de tópicos extensos.
- **`wiki/troubleshooting.md`**: O seu diário de erros e soluções.
- **`wiki/index.md`**: O mapa central de todo o conhecimento.

## 👓 Visualização Recomendada
Para uma experiência completa, abra esta pasta no **[Obsidian](https://obsidian.md)**. Você conseguirá visualizar o **Gráfico de Conhecimento** e ver como os conceitos de Spring Boot se conectam visualmente.

---
*Este sistema foi configurado para evoluir organicamente conforme você estuda.*
