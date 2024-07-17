import React from "react";

type Props = {
  styles?: string;
};

export default function Container({
  children,
  styles,
}: Readonly<{
  children: React.ReactNode;
}> &
  Props) {
  return (
    <div className={"px-4 sm:px-6 md:px-10 lg:px-40 xl:px-60 " + styles}>
      {children}
    </div>
  );
}
