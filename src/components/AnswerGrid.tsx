import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface Props {
  options: string[];
  picked: string | null;
  correct: string;
  onPick: (option: string) => void;
}

export default function AnswerGrid({ options, picked, correct, onPick }: Props) {
  return (
    <View style={s.grid}>
      {options.map(opt => {
        const isSelected     = picked === opt;
        const isCorrectPick  = isSelected && opt === correct;
        const isWrongPick    = isSelected && opt !== correct;
        const bg = isCorrectPick ? '#5EE39F' : isWrongPick ? '#FF5E5E' : '#fff';

        return (
          <Pressable
            key={opt}
            onPress={() => onPick(opt)}
            disabled={picked !== null}
            style={[s.opt, { backgroundColor: bg, elevation: isSelected ? 0 : 5 }]}
          >
            <Text style={[s.optT, { color: isSelected ? '#fff' : '#333' }]}>{opt}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15, paddingHorizontal: 20 },
  opt:  { width: '45%', paddingVertical: 20, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6 },
  optT: { fontSize: 22, fontWeight: '900', letterSpacing: 1 },
});
