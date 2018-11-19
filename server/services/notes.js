export default function Note(pattern, duration) {
  const getPattern = () => pattern;
  const getDuration = () => duration;
  const getNextTime = () => {
    const now = new Date();
    return now.getTime() + duration;
  }

  return { getPattern, getDuration, getNextTime };
}