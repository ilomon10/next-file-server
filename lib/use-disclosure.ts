import React from "react";

export const useDisclosure = (props?: {
  initialValue: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}): [boolean, { open: () => void; close: () => void; toggle: () => void }] => {
  const [isOpen, setIsOpen] = React.useState(props?.initialValue || false);

  const open = () => {
    setIsOpen(true);
    props?.onOpen?.();
  };

  const close = () => {
    setIsOpen(false);
    props?.onClose?.();
  };

  const toggle = () => {
    setIsOpen((prev) => {
      const nextState = !prev;

      if (nextState) props?.onOpen?.();
      else props?.onClose?.();

      return nextState;
    });
  };

  return [isOpen, { open, close, toggle }];
};
