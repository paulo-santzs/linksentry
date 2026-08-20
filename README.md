# LinkSentry

Scanner local e explicável de sinais comuns em URLs suspeitas. Cada ponto de risco vem acompanhado de uma evidência; nenhum endereço é enviado para servidores.

**Demo:** [paulo-santzs.github.io/linksentry](https://paulo-santzs.github.io/linksentry/)

## O que torna o projeto diferente

- Motor de análise independente da interface e coberto por testes
- Regras para HTTP, IP direto, punycode, excesso de subdomínios, `@`, encurtadores, portas incomuns e vocabulário sensível
- Resultado graduado em risco baixo, moderado, alto ou crítico
- Exemplos interativos para demonstrar o produto sem procurar links perigosos
- Processamento inteiramente local

## Executar

```bash
npm install
npm run dev
```

## Validar

```bash
npm run check
```

O comando executa lint, testes automatizados e build de produção.

## Como interpretar o resultado

Use a pontuação como uma lista de perguntas, não como um veredito. Abra o domínio em uma aba separada, confira o contexto da mensagem e procure a fonte oficial por um canal conhecido. Um endereço com pontuação baixa ainda pode ser fraudulento; um endereço com pontuação alta merece investigação antes de qualquer clique.

## Limitações

O LinkSentry é uma ferramenta educativa baseada em heurísticas. Ele não consulta reputação de domínio, não acessa o endereço analisado e não substitui as proteções do navegador ou uma investigação humana.

## Stack

React 19, TypeScript 6, Vite 8 e testes nativos do Node.js. Licença MIT.
