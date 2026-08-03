# LinkSentry

Scanner local e explicável de sinais comuns em URLs suspeitas. O projeto não envia o endereço a servidores e não promete determinar sozinho se um site é seguro.

## Recursos
- Regras para HTTP, IP direto, punycode, subdomínios, `@`, comprimento e vocabulário de urgência
- Pontuação acompanhada das evidências
- Interface responsiva e acessível

## Executar
```bash
npm install
npm run dev
```

## Limitações
Análise heurística não substitui reputação de domínio, proteção do navegador ou investigação humana. Nunca abra um link apenas porque a pontuação foi baixa.

## Stack
React, TypeScript e Vite. Licença MIT.
