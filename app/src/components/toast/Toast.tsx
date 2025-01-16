import { ToastConfig } from 'react-native-toast-message';
import { Card, CardContent } from '../ui/card';
import { H4 } from '../ui/typography';
import { CheckSquare } from '@/lib/icons/';
import { Text } from '../ui/text';
import { View } from 'react-native';
import { OctagonAlert } from 'lucide-react-native';

export const Toast = () => {};

export const toastConfig: ToastConfig = {
  /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
  success: (props) => (
    <Card {...props} className="w-full max-w-sm border-emerald-500">
      <CardContent className="flex-row items-start gap-3 py-3 px-3">
        <CheckSquare size={24} className="text-emerald-500 mt-1" />
        <View>
          <H4>{props.text1}</H4>
          <Text>{props.text2}</Text>
        </View>
      </CardContent>
    </Card>
  ),

  error: (props) => (
    <Card {...props} className="w-full max-w-sm border-none">
      <CardContent className="flex-row gap-3 py-3 px-3">
        <OctagonAlert size={24} className="text-destructive mt-1 self-center " />
        <View>
          <H4>{props.text1}</H4>
          <Text>{props.text2}</Text>
        </View>
      </CardContent>
    </Card>
  ),
};
