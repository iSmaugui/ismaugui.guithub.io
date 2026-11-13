# Mapa dos Evangelhos — app web (PWA)

Mapa interativo de paralelos entre os Evangelhos, no estilo de tricô: cartões de passagens ligados por fios de lã. Funciona no navegador, pode ser instalado no celular e no computador e roda sem internet depois do primeiro acesso.

## O que tem na pasta

| Arquivo | Para que serve |
|---|---|
| `index.html` | Página do app e o carregador do código |
| `app.css` | Aparência: cores, tricô, tamanhos, versão para celular |
| `app.js` | Comportamento: cartões, fios, quadros, salvamento, importar/exportar |
| `sw.js` | Service worker: guarda o app para funcionar offline |
| `manifest.webmanifest` | Nome, ícones e cores usados na instalação |
| `icons/` | Ícones normais, "maskable" (Android), Apple e favicon |
| `fonts/` | Fontes Fredoka e Nunito, incluídas para funcionar offline (licença OFL) |
| `screenshots/` | Capturas usadas pela tela de instalação e pelo PWABuilder |

Não há etapa de build, dependências nem servidor próprio. São só arquivos estáticos.

## Testar no computador

O service worker não funciona abrindo o arquivo direto (`file://`). Rode um servidor local dentro da pasta:

```
python3 -m http.server 8000
```

e abra `http://localhost:8000`.

## Publicar (necessário para instalar no celular)

Um PWA precisa estar num endereço **https**. Opções gratuitas:

1. **Netlify Drop** (mais simples): abra https://app.netlify.com/drop e arraste esta pasta. Você recebe um endereço `....netlify.app`. Para atualizar, arraste a pasta de novo na área de deploys do projeto.
2. **GitHub Pages**: crie um repositório, envie os arquivos e ative *Settings → Pages*.
3. **Vercel**, **Cloudflare Pages** ou qualquer hospedagem estática.

## Instalar no celular

- **Android (Chrome)**: abra o endereço e toque em *Instalar app*, no aviso ou no menu ⋮. O botão *Mais → Instalar app* também chama a instalação.
- **iPhone/iPad (Safari)**: *Compartilhar → Adicionar à Tela de Início*.

## Gerar pacotes de loja

Com o app publicado em https, use o **PWABuilder** (https://www.pwabuilder.com): cole o endereço, confira a nota e gere o pacote.

- **Google Play**: ele gera um pacote Android (Trusted Web Activity) para enviar pelo Google Play Console. Você vai precisar de uma conta de desenvolvedor Google e de publicar o arquivo `assetlinks.json` que o PWABuilder fornece, em `/.well-known/assetlinks.json` no seu site. Sem esse arquivo, o app abre com a barra de endereço.
- **Microsoft Store**: pacote MSIX, também pelo PWABuilder.
- **App Store (Apple)**: a Apple não aceita PWAs diretamente. O PWABuilder gera um projeto Xcode experimental, que exige Mac, conta Apple Developer e passa por uma revisão mais rígida.

## Atualizar o app

1. Edite `app.css` e/ou `app.js`.
2. Em `sw.js`, mude `VERSAO` (por exemplo `mapa-v1.0.1`). Em `app.js`, mude `APP_VERSION`.
3. Publique de novo. Quem já tem o app vê o aviso "Nova versão disponível → Atualizar".

## Painéis de código dentro do app

- **Front-end** (*Mais → Front-end*): mostra `app.css`, `app.js`, `index.html`, `sw.js` e o manifest.
  - *Aplicar neste aparelho* passa a usar o seu CSS/JS só naquele aparelho, por cima do original.
  - *Baixar arquivo* serve para substituir o arquivo do projeto e publicar a mudança para todos.
  - Se um código personalizado quebrar o app, abra o endereço com `?seguro` no fim (ex.: `https://seu-site.netlify.app/?seguro`) e use *Restaurar original*.
- **Back-end** (*Mais → Back-end*): não existe servidor. Os dados ficam no próprio aparelho. O painel mostra o JSON do quadro (editável), o uso de armazenamento e o código de persistência.

## Onde ficam os dados

- No `localStorage` do navegador, salvos automaticamente a cada alteração. O app também pede armazenamento persistente.
- **Não há sincronização entre aparelhos.** Use *Exportar* e *Importar* (arquivo `.json`) para backup e para levar quadros de um aparelho a outro.
- Apagar os dados do site ou desinstalar o app apaga os quadros. Exporte com regularidade.
- Exportações da versão do mapa feita no Claude também podem ser importadas aqui.

## Leitura da Bíblia

O botão 📖 de cada cartão abre a passagem no BibleGateway, na tradução escolhida em *Mais → Leitura* (ARC, NVI, NTLH, NVT ou O Livro). Precisa de internet.
