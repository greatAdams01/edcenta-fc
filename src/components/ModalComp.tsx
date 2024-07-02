import React from 'react';
import {
  XCircleIcon
} from '@heroicons/react/24/outline'

interface ModelProps{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  styling?: string;
  XIcon?: boolean;
}

const ModalAuth = ({ isOpen, onClose, children, styling, XIcon }: ModelProps) => {
  return (
    <div
      className={`fixed inset-0 flex overflow-y-scroll items-start justify-center z-50  ${
        isOpen ? '' : 'hidden'
      }`}
    >
      <div onClick={() => onClose()} className="fixed inset-0 bg-[#010B1ACC] h-full"></div>
      <div className={`bg-white rounded-md z-10 ${styling}`}>
      <div className={`flex justify-end px-4 py-4 ${
        XIcon ? '' : 'hidden'
      } `}>
        <XCircleIcon className='w-5 text-red-400 cursor-pointer'  onClick={onClose}  />
      </div>

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalAuth;