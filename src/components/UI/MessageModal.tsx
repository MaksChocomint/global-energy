import React from "react";
import Modal from "@/components/UI/Modal";

interface ModalProps {
  message: string | null;
  onClose: () => void;
  buttonColor?: string;
  isOpen: boolean;
}

const MessageModal: React.FC<ModalProps> = ({
  message,
  onClose,
  buttonColor,
  isOpen,
}) => {
  return (
    <Modal
      onClose={onClose}
      buttonColor={buttonColor}
      isOpen={isOpen}
      hideCloseButton={true}
    >
      <div className="p-4 text-center max-w-full sm:max-w-md">
        <p className="text-xl">{message}</p>
        <button
          onClick={onClose}
          className={`mt-4 px-4 py-2 bg-${buttonColor} border-2 rounded-md text-xl`}
        >
          закрыть
        </button>
      </div>
    </Modal>
  );
};

export default MessageModal;
