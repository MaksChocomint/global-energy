import React, { ReactNode } from "react";
import Modal from "react-modal";
import { AiOutlineClose } from "react-icons/ai";

interface CustomModalProps {
  children: ReactNode;
  onClose: () => void;
  buttonColor?: string;
  isOpen: boolean;
  hideCloseButton?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  children,
  onClose,
  buttonColor,
  isOpen,
  hideCloseButton,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="outline-none fixed top-1/2 left-1/2 transform -translate-x-1/2 bg-white max-h-[90%] -translate-y-1/2 z-[110] p-0 rounded-lg shadow-2xl border-4 w-full max-w-full sm:w-auto overflow-x-hidden overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[100]"
      ariaHideApp={false}
    >
      <div className="relative">
        {children}
        {!hideCloseButton && (
          <button
            onClick={onClose}
            className={`absolute top-1 right-1 font-bold text-${
              buttonColor || "white"
            } outline-none`}
          >
            <AiOutlineClose className="text-[24px] sm:text-[18px]" />
          </button>
        )}
      </div>
    </Modal>
  );
};

export default CustomModal;
