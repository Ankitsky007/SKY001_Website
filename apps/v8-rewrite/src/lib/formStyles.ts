// Shared field styling for the pop-up forms.

export const ERROR_TEXT = 'text-[13px] tracking-[-0.01em] text-[#C2362F]'

/** Input styling, red-bordered when the field shows an error. */
export const inputClass = (bad: boolean) =>
  `mt-2 block w-full border bg-paper px-3.5 text-[16px] tracking-[-0.02em] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-brand focus:ring-1 focus:ring-brand ${
    bad ? 'border-[#C2362F]' : 'border-ink/25 hover:border-ink/50'
  }`
