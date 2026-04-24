import React from 'react';
import { SvgXml } from 'react-native-svg';

type Props = {
  xml: string;
  width: string | number;
  height: string | number;
};

export function SvgRenderer({ xml, width, height }: Props) {
  return <SvgXml xml={xml} width={width} height={height} />;
}
