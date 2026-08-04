import { useState } from 'react'
import { inspectUrl, type ScanResult } from './scanner'
import './App.css'

const examples = [
  { label: 'URL comum', value: 'github.com/paulo-santzs' },
  { label: 'Link suspeito', value: 'http://conta-segura-login.example.com/verify-password' },
  { label: 'Encurtador', value: 'https://bit.ly/oferta' },
]

export default function App() {
  const [value, setValue] = useState('')
  const [result, setResult] = useState<ScanResult | null>(null)

  function analyze(nextValue = value) {
    setValue(nextValue)
    setResult(inspectUrl(nextValue))
  }

  return <main>
    <header>
      <span>LINKSENTRY / URL INSPECTOR</span>
      <h1>Confie menos.<br />Inspecione melhor.</h1>
      <p>Uma análise local e explicável de sinais comuns em links suspeitos. Nenhuma URL sai do seu navegador.</p>
    </header>

    <section className="scanner" aria-labelledby="scanner-title">
      <label id="scanner-title" htmlFor="url">Cole um endereço</label>
      <form onSubmit={(event) => { event.preventDefault(); analyze() }}>
        <input id="url" value={value} onChange={(event) => setValue(event.target.value)} placeholder="exemplo.com/conta" autoComplete="off" spellCheck="false" />
        <button type="submit" disabled={!value.trim()}>Analisar</button>
      </form>
      <div className="examples" aria-label="Exemplos para testar">
        {examples.map((example) => <button type="button" key={example.label} onClick={() => analyze(example.value)}>{example.label}</button>)}
      </div>
    </section>

    {result && <section className={`result level-${result.level}`} aria-live="polite">
      <div className="score">
        <span className="eyebrow">RISCO {result.level.toUpperCase()}</span>
        <strong>{result.score}</strong>
        <span>/100 pontos indicativos</span>
        {result.hostname && <code>{result.hostname}</code>}
      </div>
      <div className="findings">
        <h2>{result.findings.length ? `${result.findings.length} ${result.findings.length === 1 ? 'sinal encontrado' : 'sinais encontrados'}` : 'Nenhum sinal básico encontrado'}</h2>
        {result.findings.length === 0 && <p className="empty">Isso não prova que o endereço é seguro. Confira o domínio e o contexto antes de prosseguir.</p>}
        {result.findings.map((finding) => <article key={finding.id}>
          <b>+{finding.points} · {finding.label}</b>
          <p>{finding.detail}</p>
        </article>)}
        <aside><b>Importante</b> Esta ferramenta usa heurísticas educativas, não reputação em tempo real. Não abra links que você não reconhece.</aside>
      </div>
    </section>}

    <footer><span>PROCESSAMENTO 100% LOCAL</span><a href="https://github.com/paulo-santzs/linksentry" target="_blank" rel="noreferrer">Ver código no GitHub ↗</a></footer>
  </main>
}
