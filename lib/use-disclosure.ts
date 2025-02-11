import React from "react";

export const useDisclosure = (): [
  boolean,
  { open: () => void; close: () => void; toggle: () => void }
] => {
  const [isOpen, setIsOpen] = React.useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);
  return [isOpen, { open, close, toggle }];
};
