import * as RadixToast from '@radix-ui/react-toast'
import { ThumbsDown, ThumbsUp } from 'lucide-react'

interface ToastProps {
  description: string
  title: string
  open: boolean
  type?: 'danger' | 'good'
  setOpen: (state: boolean) => void
}

export function Toast({ description, title, open, setOpen, type }: ToastProps) {
  return (
    <RadixToast.Provider duration={3000}>
      <RadixToast.Root
        open={open}
        onOpenChange={setOpen}
        className='rounded-lg bg-slate-100 ring-1 ring-slate-200 overflow-hidden'
      >
        <div className='py-3 px-6'>
          <RadixToast.Title className='text-lg flex items-center justify-between font-semibold font-serif text-slate-900 mb-1'>
            {title}
            {type == 'good' ? (
              <ThumbsUp className='size-5 fill-green-400 text-green-500' />
            ) : (
              type == 'danger' && (
                <ThumbsDown className='size-5 fill-red-400 text-red-500' />
              )
            )}
          </RadixToast.Title>
          <RadixToast.Description className='text-base text-sans text-slate-400'>
            {description}
          </RadixToast.Description>
        </div>

        <div
          data-type={type}
          className='w-full h-2 data-[type="danger"]:bg-red-500 bg-green-500 animate-toast-countdown'
        />
      </RadixToast.Root>
      <RadixToast.Viewport className='fixed bottom-2 right-3 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5' />
    </RadixToast.Provider>
  )
}
