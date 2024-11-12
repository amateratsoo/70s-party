import { ReactNode } from 'react'
import * as RadixPopover from '@radix-ui/react-popover'

interface PopoverProps {
  children: ReactNode
  content: ReactNode
}

export function Popover({ children, content }: PopoverProps) {
  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger asChild>{children}</RadixPopover.Trigger>

      <RadixPopover.Portal>
        <RadixPopover.Content
          side='bottom'
          sideOffset={10}
          className='p-1 bg-slate-100 ring-1 ring-slate-300 rounded-md mr-2'
        >
          {/* <RadixPopover.Arrow className='fill-slate-200 h-2 w-5' /> */}
          {content}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  )
}
