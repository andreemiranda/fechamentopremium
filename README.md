
# Lotofácil Premium - Fechamento 19 para 15

Aplicativo web profissional para geração de fechamentos matemáticos da Lotofácil, integração com resultados oficiais da Caixa Econômica Federal, calculadora financeira e exportação de relatórios em PDF personalizados.

## 🚀 Funcionalidades

- **Fechamento Matemático**: Algoritmo otimizado que gera 50 jogos a partir de 19 dezenas selecionadas.
- **Integração API**: Busca automática e em tempo real do último resultado oficial.
- **Calculadora Financeira**: Cálculo de custo, premiação e lucro com suporte a valores por extenso.
- **Exportação PDF Profissional**: Relatório detalhado com design limpo, cores harmonizadas e informações estratégicas.
- **PWA (Progressive Web App)**: Totalmente instalável em Android, iOS e Desktop.
- **SEO & Social Ready**: Metatags otimizadas para Google, WhatsApp, Facebook e Twitter.
- **Interface Premium**: Experiência de usuário fluida, animações de entrada e design responsivo.

## 📁 Estrutura Completa do Projeto

```text
/ (Projeto Root)
├── index.html           # SEO, Metatags Sociais e Scripts CDN
├── App.tsx              # Componente principal e Persistência de dados
├── types.ts             # Tipos globais e Stats do app
├── components/          # UI: Welcome, InputGrid e JogoCard
├── utils/               # Lógica: Currency, GameLogic e PDF
└── assets/              # Identidade Visual e Social
    └── icons/           # Ícones PWA e Banners Sociais
```

## 🖼️ Assets de Identidade Visual e Social

Para garantir que o aplicativo tenha um impacto visual alto em todas as plataformas, recomenda-se adicionar as seguintes imagens à pasta `assets/icons/`:

| Arquivo | Tamanho | Uso |
| :--- | :--- | :--- |
| `favicon.png` | 32x32 px | Aba do navegador. |
| `icon-192x192.png` | 192x192 px | Ícone PWA Android. |
| `icon-512x512.png` | 512x512 px | Splash screen PWA. |
| `social-banner.png` | 1200x630 px | **(Novo)** Preview no WhatsApp, Facebook e Twitter. |
| `og-preview.jpg` | 600x600 px | **(Novo)** Thumbnail para posts quadrados. |
| `screenshot-mobile.png` | 1080x1920 px | **(Novo)** Captura de tela para documentação/lojas. |
| `screenshot-desktop.png` | 1920x1080 px | **(Novo)** Visualização da interface principal. |

## 🔍 SEO e Auditoria

O aplicativo foi otimizado para passar em auditorias de SEO modernas:
- **Autor**: andremiranda.
- **Metatags OG/Twitter**: Configuradas para converter cliques em redes sociais.
- **Canonical URLs**: Proteção contra conteúdo duplicado.
- **Robots/Index**: Configurado para `index, follow`.

## 🛠️ Detalhes da Geração de PDF

O gerador de PDF (`utils/pdfGenerator.ts`) segue as seguintes diretrizes visuais:
- Nome do arquivo dinâmico: `Fechamento-lotofacil-premium-DDMMYYYY-HHMMSS.pdf`.
- Rodapé formatado com fonte tamanho **9** e símbolo de direitos autorais: **© 2026 Lotofacil Premium by André Miranda**.

---
Desenvolvido por **André Miranda** © 2026.
