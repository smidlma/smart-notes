import { useAuthContext } from '@/auth';
import { Redirect, Slot } from 'expo-router';
import React from 'react';

const AppLayout = () => {
  const { authenticated, loading } = useAuthContext();

  if (loading) {
    return null;
  }

  if (!authenticated) {
    return <Redirect href="/sign-in" />;
  }

  return <Slot />;
};

export default AppLayout;
