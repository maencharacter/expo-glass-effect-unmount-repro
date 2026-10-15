import { GlassView } from 'expo-glass-effect';
import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

const STRIPES = ['#e63946', '#f4a261', '#2a9d8f', '#264653', '#8338ec', '#ffbe0b'];

export default function App() {
  const [panel, setPanel] = useState<'fade' | 'still' | null>(null);
  const [boxMounted, setBoxMounted] = useState(true);
  const [rows, setRows] = useState(true);

  return (
    <View style={styles.screen}>
      {STRIPES.map(color => (
        <View key={color} style={[styles.stripe, { backgroundColor: color }]}>
          <Text style={styles.stripeText}>Text behind the glass</Text>
        </View>
      ))}
      <View style={styles.controls}>
        <Pressable style={styles.button} onPress={() => setPanel('fade')}>
          <Text style={styles.buttonText}>1. Open glass panel (fades in)</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => setPanel('still')}>
          <Text style={styles.buttonText}>2. Open glass panel (no fade)</Text>
        </Pressable>
        <Pressable style={styles.outline} onPress={() => setRows(value => !value)}>
          <Text style={styles.outlineText}>
            Panel content: {rows ? 'rows (child Views)' : 'plain Text'}
          </Text>
        </Pressable>
        <Pressable style={styles.outline} onPress={() => setBoxMounted(value => !value)}>
          <Text style={styles.outlineText}>
            3. {boxMounted ? 'Unmount the box below' : 'Mount the box again'}
          </Text>
        </Pressable>
      </View>
      {boxMounted ? (
        <View style={styles.box}>
          <Text style={styles.boxText}>An ordinary View</Text>
        </View>
      ) : null}
      {panel ? <Panel fade={panel === 'fade'} rows={rows} onClose={() => setPanel(null)} /> : null}
    </View>
  );
}

function Panel({ fade, rows, onClose }: { fade: boolean; rows: boolean; onClose: () => void }) {
  const lines = [
    `${fade ? 'Faded in' : 'No fade'}, ${rows ? 'rows' : 'plain Text'}`,
    'Tap anywhere to close',
  ];
  const opacity = useRef(new Animated.Value(fade ? 0 : 1)).current;
  const started = useRef(false);
  if (fade && !started.current) {
    started.current = true;
    Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
  }

  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
      <Animated.View style={[styles.panel, { opacity }]}>
        <GlassView glassEffectStyle="regular" style={styles.glass}>
          {lines.map(line =>
            rows ? (
              <View key={line} style={styles.row}>
                <Text style={styles.panelText}>{line}</Text>
              </View>
            ) : (
              <Text key={line} style={[styles.panelText, styles.line]}>
                {line}
              </Text>
            ),
          )}
        </GlassView>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: 'white', flex: 1, paddingTop: 80 },
  stripe: { height: 70, justifyContent: 'center', paddingHorizontal: 24 },
  stripeText: { color: 'white', fontSize: 22, fontWeight: '700' },
  controls: { gap: 12, padding: 24 },
  button: { backgroundColor: '#111', borderRadius: 12, padding: 16 },
  buttonText: { color: 'white', fontSize: 16, textAlign: 'center' },
  outline: { borderColor: '#111', borderRadius: 12, borderWidth: 1, padding: 14 },
  outlineText: { color: '#111', fontSize: 16, textAlign: 'center' },
  box: { alignSelf: 'center', backgroundColor: '#ddd', borderRadius: 8, padding: 12 },
  boxText: { color: '#111' },
  panel: { left: 40, position: 'absolute', right: 40, top: 140 },
  glass: { borderRadius: 16, overflow: 'hidden', padding: 4 },
  line: { paddingHorizontal: 12, paddingVertical: 12 },
  row: { borderRadius: 8, justifyContent: 'center', minHeight: 44, paddingHorizontal: 12 },
  panelText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
