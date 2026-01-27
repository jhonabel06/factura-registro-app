import * as React from 'react'

export function VisuallyHidden({
  children,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      className="sr-only"
      {...props}
    >
      {children}
    </span>
  )
}
