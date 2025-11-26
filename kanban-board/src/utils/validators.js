export function required(value) {
  return value ? null : 'This field is required.'
}

export function minLength(value, n) {
  return value && value.length >= n ? null : `Minimum ${n} characters required.`
}
