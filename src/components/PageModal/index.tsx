import React, { PropsWithChildren } from 'react';

type ModalProps = {
  modalTitle: string
  isOpen: boolean,
  onClose: () => void,
}

export default function Modal({ isOpen, onClose, modalTitle, children } : PropsWithChildren<ModalProps>) {

  if(isOpen) {
    return (
      <>
        
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="relative z-50 bg-white p-8 rounded-md shadow-lg">
          <button
            className="absolute top-0 right-0 p-4 focus:outline-none"
            onClick={onClose}
          >
            &times;
          </button>
          <h1 className='text-2xl'>{modalTitle}</h1>
          {children}
        </div>
        </div>
      </>
    )
  }
  
  return null;
};

