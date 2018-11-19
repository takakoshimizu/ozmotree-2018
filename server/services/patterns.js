import createPattern from './pattern';

export const allColor1 = createPattern((lights, size) => {
  const light = lights[0];
  return new Array(size).fill(light);
});

export const allColor2 = createPattern((lights, size) => {
  const light = lights[1];
  return new Array(size).fill(light);
});

export const twoThree = createPattern((lights) => {
  return [lights[0], lights[0], lights[1], lights[1], lights[1]];
});

export const threeTwo = createPattern((lights) => {
  return [lights[0], lights[0], lights[0], lights[1], lights[1]];
});

export const chaserGen = (msPerStep = 100, startPosition = 0, spacing = 10, length = 1) => {
  let lastTime = new Date();
  let curPosition = startPosition;
  const totalPattern = spacing + length;

  let patternCache = null;

  return function(step = -1, overrideMsPerStep) {
    return function(lights, size) {
      const time = new Date();
      if (time.getTime() > lastTime.getTime() + (overrideMsPerStep || msPerStep)) {
        lastTime = time;
        curPosition = curPosition + step;

        if (curPosition < 0) {
          curPosition = totalPattern - 1;
        }

        if (curPosition >= totalPattern) {
          curPosition = 0;
        }

        patternCache = null;
      }

      if (patternCache) return patternCache;

      let arr = new Array(totalPattern).fill(lights[0]);
      for(let i = curPosition; i < curPosition + length; i++) {
        let pos = i;
        if (pos >= totalPattern) {
          pos = pos - totalPattern;
        }

        arr[pos] = lights[1];
      }

      while(arr.length < size) {
        arr = arr.concat(arr);
      }

      patternCache = arr.slice(0, size);
      return patternCache;
    }
  }
};

const chaserBase = chaserGen(30, 0, 5, 5);

export const singleChaser = createPattern(chaserBase());
export const singleChaserReverse = createPattern(chaserBase(1));