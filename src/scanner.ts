export type RiskLevel = 'baixo' | 'moderado' | 'alto' | 'crítico'

export type Finding = {
  id: string
  label: string
  detail: string
  points: number
}

export type ScanResult = {
  input: string
  normalizedUrl: string | null
  hostname: string | null
  score: number
  level: RiskLevel
  findings: Finding[]
}

const urgencyTerms = /login|verify|verification|secure|update|account|wallet|pr[eê]mio|senha|password|confirm/i
const shorteners = new Set(['bit.ly', 'tinyurl.com', 't.co', 'cutt.ly', 'is.gd', 'rebrand.ly'])

function levelFor(score: number): RiskLevel {
  if (score >= 70) return 'crítico'
  if (score >= 40) return 'alto'
  if (score >= 20) return 'moderado'
  return 'baixo'
}

export function inspectUrl(input: string): ScanResult {
  const raw = input.trim()
  const findings: Finding[] = []
  const add = (id: string, label: string, detail: string, points: number) =>
    findings.push({ id, label, detail, points })

  let url: URL
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`)
  } catch {
    return {
      input,
      normalizedUrl: null,
      hostname: null,
      score: 100,
      level: 'crítico',
      findings: [{ id: 'invalid', label: 'URL inválida', detail: 'O endereço não pôde ser interpretado.', points: 100 }],
    }
  }

  const host = url.hostname.toLowerCase()
  if (url.protocol === 'http:') add('http', 'Conexão sem HTTPS', 'O conteúdo pode trafegar sem criptografia.', 25)
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) add('ip', 'Endereço IP direto', 'Sites legítimos normalmente usam um domínio reconhecível.', 25)
  if (host.includes('xn--')) add('punycode', 'Domínio internacionalizado', 'Punycode pode imitar visualmente letras de outro domínio.', 30)
  if (host.split('.').length > 4) add('subdomains', 'Muitos subdomínios', 'A parte confiável do endereço pode estar escondida à direita.', 15)
  if (raw.includes('@')) add('at', 'Símbolo @', 'O trecho anterior ao @ pode disfarçar o destino real.', 25)
  if (raw.length > 100) add('length', 'URL muito longa', 'Endereços longos dificultam a inspeção manual.', 10)
  if (urgencyTerms.test(url.pathname + url.search)) add('urgency', 'Vocabulário sensível', 'O caminho contém termos comuns em campanhas de engenharia social.', 15)
  if (shorteners.has(host)) add('shortener', 'Destino encurtado', 'O endereço real fica oculto até o redirecionamento.', 20)
  if (url.port && !['80', '443'].includes(url.port)) add('port', 'Porta incomum', `A URL usa explicitamente a porta ${url.port}.`, 10)
  if ((host.match(/-/g) ?? []).length >= 3) add('hyphens', 'Muitos hífens no domínio', 'Domínios artificiais costumam combinar várias palavras com hífens.', 10)

  const score = Math.min(100, findings.reduce((total, finding) => total + finding.points, 0))
  return { input, normalizedUrl: url.href, hostname: host, score, level: levelFor(score), findings }
}
