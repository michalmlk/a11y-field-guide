export interface WcagCriterion {
  id: string
  title: string
  level: 'A' | 'AA' | 'AAA'
  url: string
}

export const wcagCriteria: Record<string, WcagCriterion> = {
  '1.1.1': { id: '1.1.1', title: 'Non-text Content', level: 'A', url: 'https://www.w3.org/TR/WCAG21/#non-text-content' },
  '1.3.1': { id: '1.3.1', title: 'Info and Relationships', level: 'A', url: 'https://www.w3.org/TR/WCAG21/#info-and-relationships' },
  '1.4.3': { id: '1.4.3', title: 'Contrast (Minimum)', level: 'AA', url: 'https://www.w3.org/TR/WCAG21/#contrast-minimum' },
  '2.1.1': { id: '2.1.1', title: 'Keyboard', level: 'A', url: 'https://www.w3.org/TR/WCAG21/#keyboard' },
  '2.1.2': { id: '2.1.2', title: 'No Keyboard Trap', level: 'A', url: 'https://www.w3.org/TR/WCAG21/#no-keyboard-trap' },
  '4.1.2': { id: '4.1.2', title: 'Name, Role, Value', level: 'A', url: 'https://www.w3.org/TR/WCAG21/#name-role-value' },
}
