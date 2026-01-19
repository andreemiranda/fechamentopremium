
# Lotofácil Premium - Fechamento 19 para 15

Aplicativo web profissional para geração de fechamentos matemáticos da Lotofácil, integração com resultados oficiais da Caixa Econômica Federal, calculadora financeira e exportação de relatórios em PDF personalizados.

## 🚀 Funcionalidades

- **Fechamento Matemático**: Algoritmo otimizado que gera 50 jogos a partir de 19 dezenas selecionadas.
- **Integração API**: Busca automática e em tempo real do último resultado oficial.
- **Calculadora Financeira**: Cálculo de custo, premiação e lucro com suporte a valores por extenso.
- **Exportação PDF Profissional**: Relatório detalhado com design limpo, cores harmonizadas e informações estratégicas.
- **PWA (Progressive Web App)**: Totalmente instalável em Android, iOS e Desktop.
- **Interface Premium**: Experiência de usuário fluida, animações de entrada e design responsivo.

## 📁 Estrutura Completa do Projeto

O projeto segue uma arquitetura modular em React com TypeScript. Use esta estrutura para futuras edições e organização do repositório:

```text
/ (Projeto Root)
├── index.html           # Ponto de entrada HTML (Bibliotecas Tailwind, jsPDF via CDN)
├── index.tsx            # Ponto de entrada do React (Bootstrap do App)
├── App.tsx              # Componente principal (Estados globais e Fluxo de dados)
├── types.ts             # Definições de Tipos e Interfaces TypeScript
├── manifest.json        # Manifesto PWA (Configurações de instalação e cores)
├── metadata.json        # Metadados e permissões do projeto
├── README.md            # Este arquivo de documentação e orientações
│
├── components/          # Componentes de Interface de Usuário (UI)
│   ├── WelcomeScreen.tsx    # Tela de splash animada com Logo SVG dinâmico
│   ├── NumberInputGrid.tsx  # Grid inteligente para entrada de dezenas (01-25)
│   └── JogoCard.tsx         # Card para visualização de jogo individual e conferência
│
├── services/            # Serviços de Backend e Integrações
│   └── lotteryService.ts    # Consumo de APIs de Loterias (Caixa e fallback)
│
├── utils/               # Funções Utilitárias e Regras de Negócio
│   ├── currency.ts          # Formatação de moeda e conversão de valores para extenso
│   ├── gameLogic.ts         # Algoritmo matemático de fechamento (19 -> 15)
│   └── pdfGenerator.ts      # Motor de geração de relatórios PDF customizados
│
└── assets/              # Recursos Estáticos do Projeto
    └── icons/           # Pasta de Ícones do PWA e Identidade Visual
        ├── favicon.png        # Ícone da aba do navegador (32x32px)
        ├── icon-192x192.png   # Ícone mobile Android / Instalação
        ├── icon-512x512.png   # Ícone de splash screen (alta resolução)
        └── apple-touch-icon.png # Ícone otimizado para dispositivos Apple (iOS)
```

## 📱 Relação de Imagens e Recursos (PWA)

Para que o aplicativo funcione corretamente como PWA e possua uma identidade visual completa após a publicação, as seguintes imagens devem estar presentes na pasta `assets/icons/`:

| Arquivo | Tamanho Recomendado | Uso Principal |
| :--- | :--- | :--- |
| `favicon.png` | 32x32 px | Ícone exibido na aba do navegador. |
| `icon-192x192.png` | 192x192 px | Ícone exibido no menu de apps e homescreen do Android. |
| `icon-512x512.png` | 512x512 px | Ícone exibido na splash screen do sistema durante o carregamento. |
| `apple-touch-icon.png` | 180x180 px | Ícone de alta qualidade específico para dispositivos iOS. |

*Nota: O logotipo principal na tela de "Welcome" é gerado via código SVG dentro do componente `WelcomeScreen.tsx` para garantir nitidez máxima em qualquer resolução.*

## 🌐 Publicação e Deploy

O aplicativo está configurado para ser publicado em qualquer serviço de hospedagem estática.

1.  **Pasta de Publicação**: Raiz do repositório (`/`).
2.  **Protocolo**: Requer obrigatoriamente suporte a **HTTPS** para o correto registro do Service Worker e funcionamento do manifesto PWA.
3.  **Provedores Recomendados**: GitHub Pages, Vercel, Netlify ou Firebase Hosting.

## 🛠️ Detalhes da Geração de PDF

O gerador de PDF (`utils/pdfGenerator.ts`) segue as seguintes diretrizes visuais:
- Nome do arquivo dinâmico: `Fechamento-lotofacil-premium-DDMMYYYY-HHMMSS.pdf`.
- Rodapé formatado com fonte tamanho **9** (mesmo tamanho da descrição informativa do Item 6).
- Rodapé exibe exclusivamente a data e hora, sem rótulos como "Gerado em:".

---
Desenvolvido por **André Miranda** @ 2026.
