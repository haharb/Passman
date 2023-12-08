// LogoutButton.tsx
import React, { Dispatch, SetStateAction } from 'react';
import { Button } from '@chakra-ui/react';

const LogoutButton = ({ setStep }: { setStep: Dispatch<SetStateAction<'login' | 'register' | 'vault'>> }) => {
  const handleLogoutClick = () => {
    setStep('login');
  };

  return (
    <Button
      onClick={handleLogoutClick}
      ml="8"
      color="white"
      background="gray"
      type="submit"
    >
      Log Out
    </Button>
  );
};

export default LogoutButton;