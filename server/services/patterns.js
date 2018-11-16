import createPattern from './pattern';

export const allColor1 = createPattern((lights, size) => {
  const light = lights[0];
  return new Array(size).fill(light);
});

export const allColor2 = createPattern((lights, size) => {
  const light = lights[1];
  return new Array(size).fill(light);
});