# Spec: Implementação de Paginação em Tabela (Modal de Vendas)

## 1. Objetivo
Adicionar funcionalidade de paginação a uma tabela exibida dentro de um modal na página de vendas. O objetivo é melhorar a performance de carregamento e a usabilidade quando houver um grande volume de dados.

## 2. Contexto
- **Localização:** Página de Vendas (`/vendas`).
- **Componente Alvo:** Modal de detalhes/listagem que contém a `<table>`.
- **Tipo de Paginação:** [ ] Client-side (Front-end) | [ ] Server-side (API/Back-end). 
  *(Nota: Recomenda-se Server-side para grandes volumes).*

## 3. Requisitos Funcionais

### 3.1 Interface (UI)
- Adicionar um controle de paginação abaixo da tabela dentro do modal.
- O controle deve exibir:
    - Botão "Anterior" (`Previous`).
    - Números das páginas (ex: 1, 2, 3...).
    - Botão "Próximo" (`Next`).
- Indicar visualmente a página atual (estado `active`).
- Desabilitar o botão "Anterior" na primeira página e o "Próximo" na última.

### 3.2 Comportamento (UX)
- Ao trocar de página, o modal deve permanecer aberto.
- Se possível, aplicar um "scroll to top" automático dentro do corpo do modal ao mudar de página.
- Exibir um spinner de carregamento (loading) sobre a tabela enquanto os novos dados são processados.

## 4. Requisitos Técnicos

### 4.1 Lógica de Dados
- **Variáveis necessárias:**
    - `currentPage`: Página atual (padrão: 1).
    - `itemsPerPage`: Quantidade de itens por página (ex: 10).
    - `totalItems`: Total de registros retornados pela consulta.
- **Cálculo de Páginas:** `Math.ceil(totalItems / itemsPerPage)`.

### 4.2 Integração (API)
- A requisição que alimenta o modal deve aceitar parâmetros de paginação:
    - Ex: `GET /api/vendas/detalhes?page={n}&limit=10`.
- Certificar que a resposta da API retorne o objeto de dados e o metadado do total de registros.

## 5. Critérios de Aceite
- [ ] A tabela deve atualizar os dados corretamente ao clicar em um número de página.
- [ ] O estado do modal não deve ser resetado (não fechar) durante a navegação.
- [ ] O layout do modal deve ser responsivo e não quebrar com a inclusão dos controles.
