import { useLocalSearchParams } from 'expo-router';

import { ChampionDetailScreen } from '@/features/champion/presentation/screens/ChampionDetailScreen';

export default function ChampionDetailRoute() {
  const { championId } = useLocalSearchParams<{ championId: string }>();
  return <ChampionDetailScreen championId={championId ?? ''} />;
}
