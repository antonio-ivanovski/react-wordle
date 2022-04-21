import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
}

export const WaitingForPlayer2Modal = ({ isOpen }: Props) => {
  return (
    <BaseModal title="Waiting for second player..." isOpen={isOpen}>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Just share the entire link of this page with your friend and you will be
        matched to play one against the other. Have fun.
      </p>
      <button
        type="button"
        className="inline-flex items-center mt-2 rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
        onClick={() => {
          navigator.clipboard.writeText(window.location.toString())
        }}
      >
        <CopyIcon />
        COPY JOIN LINK
      </button>
    </BaseModal>
  )
}

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    className="w-5 h-5 mr-2 -ml-1"
    fill="currentColor"
  >
    <path d="M384 96L384 0h-112c-26.51 0-48 21.49-48 48v288c0 26.51 21.49 48 48 48H464c26.51 0 48-21.49 48-48V128h-95.1C398.4 128 384 113.6 384 96zM416 0v96h96L416 0zM192 352V128h-144c-26.51 0-48 21.49-48 48v288c0 26.51 21.49 48 48 48h192c26.51 0 48-21.49 48-48L288 416h-32C220.7 416 192 387.3 192 352z" />
  </svg>
)
