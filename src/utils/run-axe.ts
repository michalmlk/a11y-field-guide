export interface AxeViolation {
  id: string
  description: string
  impact: 'minor' | 'moderate' | 'serious' | 'critical' | null
  nodes: unknown[]
}

export interface AxeResult {
  violations: AxeViolation[]
  passes: unknown[]
  incomplete: unknown[]
}

export async function runAxe(context?: Element): Promise<AxeResult> {
  const axe = await import('axe-core')
  return axe.default.run(context ?? document) as Promise<AxeResult>
}
