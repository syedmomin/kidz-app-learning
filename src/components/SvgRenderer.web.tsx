import React from 'react';
import { View } from 'react-native';

type Props = {
  xml: string;
  width: string | number;
  height: string | number;
};

export function SvgRenderer({ xml, width, height }: Props) {
  return (
    <View 
      style={{ width, height }}
      // @ts-ignore - dangerouslySetInnerHTML is supported on web in react-native-web
      dangerouslySetInnerHTML={{ __html: xml }}
    />
  );
}
