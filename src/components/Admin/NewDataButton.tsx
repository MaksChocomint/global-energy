import React from "react";

type NewDataButtonProps = {
  text: string;
  onClick: () => void;
};

const NewDataButton: React.FC<NewDataButtonProps> = ({ text, onClick }) => {
  return (
    <div className="grid-col my-4">
      <button
        className="w-64 h-64 md:w-48 md:h-48 tracking-wider border-2 rounded-sm text-2xl whitespace-pre-line"
        onClick={onClick}
      >
        {text.split(" ").map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </button>
    </div>
  );
};

export default NewDataButton;
