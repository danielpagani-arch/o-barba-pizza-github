# O Barba Pizza

Site profissional da O Barba Pizza, com cardápio, imagens, localização, links para pedidos no iFood e contato para eventos.

## Como colocar no GitHub

1. Baixe este pacote e descompacte o arquivo.
2. Crie um repositório no GitHub.
3. Envie **o conteúdo desta pasta** para o repositório — envie os arquivos e pastas que estão dentro dela, não o arquivo ZIP.
4. Para editar o site, altere principalmente `src/App.tsx` e `src/index.css`.

## Como rodar localmente

Você precisa ter Node.js instalado.

```bash
npm install
npm run dev
```

Depois abra o endereço mostrado no terminal, normalmente `http://localhost:5173`.

## Como gerar a versão publicada

```bash
npm run build
```

A pasta pronta para publicação será `dist/`.

## Arquivos principais

- `src/App.tsx` — conteúdo, cardápio, links e comportamento da página.
- `src/index.css` — identidade visual e responsividade.
- `public/` — imagens, favicon, sitemap e robots.txt.
- `index.html` — título, SEO e dados estruturados do restaurante.
