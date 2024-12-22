import { ModalWrapper } from '@/components/modal-wrapper/modal-wrapper';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';

type Props = {};

const SmartModal = ({}: Props) => {
  return (
    <ModalWrapper>
      <View>
        <Text>SmartModal</Text>
      </View>
    </ModalWrapper>
  );
};

export default SmartModal;
