export function validarCNPJ(cnpj: string): boolean {
  const raw = cnpj.replace(/[^\d]/g, '')
  if (raw.length !== 14) return false
  if (/^(\d)\1+$/.test(raw)) return false

  const calc = (s: string, n: number) => {
    let soma = 0
    let pos = n - 7
    for (let i = n; i >= 1; i--) {
      soma += parseInt(s[n - i]) * pos--
      if (pos < 2) pos = 9
    }
    return soma % 11 < 2 ? 0 : 11 - (soma % 11)
  }

  return calc(raw, 12) === parseInt(raw[12]) && calc(raw, 13) === parseInt(raw[13])
}

export function formatarCNPJ(value: string): string {
  const raw = value.replace(/[^\d]/g, '').slice(0, 14)
  return raw
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

// Score simulado para demo: baseado nos últimos dígitos do CNPJ
export function simularScoreCNPJ(cnpj: string) {
  const raw = cnpj.replace(/[^\d]/g, '')
  const lastTwo = parseInt(raw.slice(-2))
  const score = 5.0 + (lastTwo % 50) / 10

  const tempoAnos = 2 + (lastTwo % 15)
  const situacao = score >= 6 ? 'Ativa' : 'Irregular'
  const capitais = ['R$ 50.000', 'R$ 100.000', 'R$ 250.000', 'R$ 500.000', 'R$ 1.000.000']
  const capital = capitais[lastTwo % capitais.length]

  return {
    score: Math.min(9.9, Math.round(score * 10) / 10),
    situacao,
    tempo_anos: tempoAnos,
    capital_social: capital,
  }
}
