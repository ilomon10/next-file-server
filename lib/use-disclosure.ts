import React from "react";

export const useDisclosure = (props?: {
  onOpen?: () => void;
  onClose?: () => void;
}): [boolean, { open: () => void; close: () => void; toggle: () => void }] => {
  const [isOpen, setIsOpen] = React.useState(false);

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
      nextState ? props?.onOpen?.() : props?.onClose?.();
      return nextState;
    });
  };

  return [isOpen, { open, close, toggle }];
};
