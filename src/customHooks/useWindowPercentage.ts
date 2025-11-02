import { useWindowDimensions } from "react-native";

export function useWindowPercentage() {
  const { width, height,fontScale,scale } = useWindowDimensions();

  /**
   * Calculate width percentage (e.g., 50 => 50% of screen width)
   */
  const wp = (percent: number) => (width * percent) / 100;

  /**
   * Calculate height percentage (e.g., 30 => 30% of screen height)
   */
  const hp = (percent: number) => (height * percent) / 100;


  return { wp, hp, width, height,fontScale,scale };
}