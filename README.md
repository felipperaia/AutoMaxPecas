# AutoMax Peças — Versão melhorada

Breve instruções para rodar e personalizar a landing page localmente.

## Como rodar

- Abra a pasta do projeto no VS Code.
- Abra `index.html` com o Live Server (recomendado) ou abra diretamente no navegador.

## Como trocar o número do WhatsApp

- Abra `script.js` e altere `config.whatsappNumber` para o número no formato internacional sem sinal `+`, por exemplo: `5511999999999`.
- A mensagem padrão está em `config.whatsappDefaultMessage`.

## Como trocar o endereço do mapa

- Abra `script.js` e altere `config.mapQuery` para o endereço desejado. O iframe será atualizado automaticamente.

## Como trocar imagens

- No `index.html` há imagens externas (Unsplash). Substitua as URLs por imagens próprias ou outras imagens públicas.

## CDNs utilizadas

- Google Fonts — Inter (legibilidade)
- Font Awesome (ícones) via cdnjs

Essas escolhas mantêm o projeto leve e fáceis de editar localmente.

## Deploy para GitHub

- Faça commit das mudanças e dê push para o repositório `https://github.com/felipperaia/AutoMaxPecas` (use suas credenciais do VS Code/GitHub).
