import React, { MouseEvent, ReactNode } from 'react';
import { CgCloseR } from 'react-icons/cg';
import { FaTrashAlt } from 'react-icons/fa';

interface ModalProps {
  open: boolean;
  item: string;
  onClose: (event: MouseEvent<HTMLElement>) => void;
  children: ReactNode;
}

const DeleteConfirmationModal: React.FC<ModalProps> = ({ open, item, onClose, children }) => {
  return (
    <>
      <div className={`fixed inset-0 flex justify-center items-center
          transition-colors ${open ? 'visible bg-black/20' : 'invisible'}`}>
        <div onClick={(event) => event.stopPropagation()} className={`bg-[#C6AC8E] rounded-sm shadow p-6 transition-all
                        ${open ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}`}>
          <button className='absolute top-2 right-2 p-2' onClick={onClose}>
            <CgCloseR fontSize={24} className='hover:text-red-700 text-[#22333B]'></CgCloseR>
          </button>
          <div className='flex flex-col justify-center items-center text-center w-60'>
            <FaTrashAlt fontSize={36} color='#B91C1C'></FaTrashAlt>
            <div className='mt-6 text-[#22333B]'>
              <h3 className='text-xl mb-4 font-extrabold'>Confirm Delete</h3>
              <p>Are you sure you want to delete the {item}?</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default DeleteConfirmationModal;