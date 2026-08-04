import assert from 'node:assert/strict'
import test from 'node:test'
import { inspectUrl } from '../src/scanner.ts'

test('normaliza um domínio simples e mantém risco baixo', () => {
  const result = inspectUrl('example.com')
  assert.equal(result.normalizedUrl, 'https://example.com/')
  assert.equal(result.score, 0)
  assert.equal(result.level, 'baixo')
})

test('explica múltiplos sinais sem ultrapassar 100 pontos', () => {
  const result = inspectUrl('http://user@192.168.0.1:8080/login/verify-password')
  assert.equal(result.score, 100)
  assert.equal(result.level, 'crítico')
  assert.deepEqual(result.findings.map((finding) => finding.id), ['http', 'ip', 'at', 'urgency', 'port'])
})

test('identifica encurtadores conhecidos', () => {
  const result = inspectUrl('https://bit.ly/oferta')
  assert.equal(result.score, 20)
  assert.equal(result.findings[0]?.id, 'shortener')
})

test('retorna uma evidência clara para entrada inválida', () => {
  const result = inspectUrl('https:// endereço inválido')
  assert.equal(result.score, 100)
  assert.equal(result.normalizedUrl, null)
  assert.equal(result.findings[0]?.id, 'invalid')
})
