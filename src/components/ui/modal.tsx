import { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

interface ModalProps {
  title: string
  children: ReactNode
  open: boolean
  onOpenChange: (state: boolean) => void
  onClose?: () => void
}

export function Modal({
  title,
  children,
  open,
  onOpenChange,
  onClose = () => {}
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black/60 backdrop-blur-sm' />
        <Dialog.Description />
        <Dialog.Content className='fixed left-1/2 top-1/2 max-h-96 w-80 -translate-x-1/2 -translate-y-1/2 rounded-md bg-slate-50 ring-1 ring-slate-200 p-5 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none font-sans'>
          <div className='flex justify-between items-start'>
            <Dialog.Title className='font-bold font-sans text-lg leading-tight'>
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className='p-1 rounded-md focus:bg-slate-300/45 ring-1 ring-transparent focus:ring-slate-300 outline-none hover:bg-slate-300/45 active:bg-slate-300/45'
                onClick={onClose}
              >
                <X className='size-4' />
              </button>
            </Dialog.Close>
          </div>

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
