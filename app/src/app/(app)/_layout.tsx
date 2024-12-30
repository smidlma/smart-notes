import { useAuthContext } from '@/auth';
import { Redirect, Slot } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

const AppLayout = () => {
  const { authenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!authenticated) {
    return <Redirect href="/sign-in" />;
  }

  return <Slot />;
};

export default AppLayout;
