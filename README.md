<div align="center">
  <img src="public/home_section.png" alt="Fiamma Pizza home section" width="100%">

  <h1>🍕 Fiamma Pizza</h1>

  <p>
    A modern Angular storefront for a Neapolitan-inspired pizzeria, with menu browsing,
    persistent cart state, payment flow, and order status tracking.
  </p>

  <p>
    <a href="#english">English</a> •
    <a href="#portugues">Português</a> •
    <a href="#screenshots">Screenshots</a> •
    <a href="#license">License</a>
  </p>
</div>

---

## Tech Stack

<div align="center">

![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Mercado Pago](https://img.shields.io/badge/Mercado_Pago-Payments-00B1EA?style=for-the-badge)

</div>

---

## English

### Project Overview

**Fiamma Pizza** is a digital storefront for a Neapolitan-inspired pizzeria. It presents the brand, organizes the menu into product sections, lets customers add pizzas to a persistent cart, and connects the order flow to a payment API.

The project’s goal is to deliver a polished online ordering experience: strong visual identity, direct navigation, responsive UI, cart management, checkout integration, and payment/order status feedback.

### Main Sections

| Section | Description |
| --- | --- |
| **Home** | Brand hero with the main tagline and dark/red visual identity. |
| **About** | Short institutional section focused on the handcrafted pizzeria concept. |
| **Menu** | Product categories with images, descriptions, prices, and add-to-cart actions. |
| **Cart** | Item review, quantity controls, removal actions, and order summary. |
| **Payment** | Payment preference creation, external checkout opening, and status lookup. |
| **Completed Orders** | Simple list of finalized orders returned by the API. |

### Features

- API-based menu loading through `/api/menu`.
- Reactive cart state powered by Angular Signals.
- Cart persistence using `localStorage`.
- Quantity update and item removal controls.
- Subtotal, service fee, and total calculation through the API.
- Payment preference creation for external checkout.
- Payment status lookup by external order reference.
- Finalized order listing.
- Responsive layout built with Tailwind CSS.
- Custom scrollbar matching the project’s visual identity.

### Running Locally

```bash
npm install
npm start
```

Then open:

```text
http://localhost:4200/
```

Useful commands:

```bash
npm run build
npm test
```

---

## Screenshots

### Cart Review

<img src="public/cart_section.png" alt="Fiamma Pizza cart section" width="100%">

### Payment Flow

<img src="public/payment_section.png" alt="Fiamma Pizza payment section" width="100%">

---

<a id="portugues"></a>

## Português

### Visão Geral

**Fiamma Pizza** é uma vitrine digital para uma pizzaria de inspiração napolitana. O projeto apresenta a marca, organiza o cardápio em seções de produtos, permite adicionar pizzas a um carrinho persistente e conecta o fluxo do pedido a uma API de pagamentos.

O objetivo é entregar uma experiência de pedido online bem-acabada: identidade visual forte, navegação direta, interface responsiva, gerenciamento de carrinho, integração com checkout e retorno de status do pagamento/pedido.

### Principais Seções

| Seção | Descrição |
| --- | --- |
| **Início** | Hero da marca com chamada principal e identidade visual escura/vermelha. |
| **Sobre** | Seção institucional curta focada na proposta artesanal da pizzaria. |
| **Cardápio** | Categorias de produtos com imagens, descrições, preços e ações de adicionar. |
| **Carrinho** | Revisão dos itens, controle de quantidade, remoção e resumo do pedido. |
| **Pagamento** | Criação de preferência, abertura do checkout externo e consulta de status. |
| **Pedidos Feitos** | Lista simples de pedidos finalizados retornados pela API. |

### Funcionalidades

- Cardápio carregado via API em `/api/menu`.
- Estado reativo do carrinho com Angular Signals.
- Persistência do carrinho usando `localStorage`.
- Controle de quantidade e remoção de itens.
- Cálculo de subtotal, taxa de serviço e total via API.
- Criação de preferência de pagamento para checkout externo.
- Consulta de status por referência externa do pedido.
- Listagem de pedidos finalizados.
- Layout responsivo construído com Tailwind CSS.
- Barra de rolagem personalizada de acordo com a identidade visual.

### Como Executar

```bash
npm install
npm start
```

Depois acesse:

```text
http://localhost:4200/
```

Comandos úteis:

```bash
npm run build
npm test
```

---

## License

This project is licensed under the **MIT License**. See the full text in [`LICENSE`](LICENSE).
