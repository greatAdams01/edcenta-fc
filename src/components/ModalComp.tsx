import { useEffect, useRef, useState } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
  styling?: string
  XIcon?: boolean
}

const ModalAuth = ({ isOpen, onClose, children, styling, XIcon }: ModalProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Handle modal visibility and animations
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
      
      // Show modal with animation
      setIsVisible(true)
      setIsAnimating(true)
      
      // Focus the modal for accessibility
      setTimeout(() => {
        modalRef.current?.focus()
      }, 100)
    } else {
      // Hide modal with animation
      setIsAnimating(true)
      setTimeout(() => {
        setIsVisible(false)
        setIsAnimating(false)
        
        // Restore body scroll
        document.body.style.overflow = 'unset'
        
        // Restore focus to previous element
        if (previousActiveElement.current) {
          previousActiveElement.current.focus()
        }
      }, 200)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Handle click outside modal
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  // Handle modal content click to prevent closing
  const handleModalClick = (event: React.MouseEvent) => {
    event.stopPropagation()
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto ${
        isAnimating ? 'transition-opacity duration-200' : ''
      }`}
      style={{
        backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)',
        opacity: isOpen ? 1 : 0,
      }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-300"
        style={{
          opacity: isOpen ? 1 : 0,
        }}
      />
      
      {/* Close Button - Fixed positioning outside modal container */}
      {XIcon && (
        <div className="fixed top-4 right-4 z-[100]">
          <button
            type="button"
            className="rounded-full bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200 shadow-lg p-2 hover:bg-gray-50 border border-gray-200"
            onClick={onClose}
            aria-label="Close modal"
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}
      
      {/* Modal Container */}
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          ref={modalRef}
          className={`${styling} relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all duration-300 sm:my-8 sm:p-6`}
          style={{
            transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(4px) scale(0.95)',
            opacity: isOpen ? 1 : 0,
          }}
          onClick={handleModalClick}
          tabIndex={-1}
        >
          {/* Modal Content */}
          <div className="relative">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalAuth 