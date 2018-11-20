import createPattern from "./pattern";

export const allColor1 = createPattern((lights, size) => {
  const light = lights[0];
  return new Array(size).fill(light);
});

export const allColor2 = createPattern((lights, size) => {
  const light = lights[1];
  return new Array(size).fill(light);
});

const twoThreeGen = lights => [
  lights[0],
  lights[0],
  lights[1],
  lights[1],
  lights[1]
];
export const twoThree = createPattern(twoThreeGen);

const threeTwoGen = lights => [
  lights[0],
  lights[0],
  lights[0],
  lights[1],
  lights[1]
];
export const threeTwo = createPattern(threeTwoGen);

export const chaserGen = (
  msPerStep = 100,
  startPosition = 0,
  spacing = 10,
  length = 1
) => {
  let lastTime = new Date();
  let curPosition = startPosition;
  const totalPattern = spacing + length;

  let patternCache = null;

  return function(step = -1, overrideMsPerStep) {
    return function(lights, size) {
      const time = new Date();
      if (
        time.getTime() >
        lastTime.getTime() + (overrideMsPerStep || msPerStep)
      ) {
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
      for (let i = curPosition; i < curPosition + length; i++) {
        let pos = i;
        if (pos >= totalPattern) {
          pos = pos - totalPattern;
        }

        arr[pos] = lights[1];
      }

      while (arr.length < size) {
        arr = arr.concat(arr);
      }

      patternCache = arr.slice(0, size);
      return patternCache;
    };
  };
};

const chaserBase = chaserGen(30, 0, 5, 1);

export const singleChaser = createPattern(chaserBase());
export const singleChaserReverse = createPattern(chaserBase(1));

export const spread = (lightIndex = 0, msPerStep = 100, growthExponent = 2) => {
  let lastTime = new Date();
  let growthTerm = 1;
  let lightCache = null;

  const retFunc = function(lights, size) {
    const light = lights[lightIndex];
    const halfLength = Math.round(size / 2);
    const now = new Date();

    let toCreate = Math.min(
      halfLength,
      Math.round(Math.log(growthTerm) ** Math.log(growthTerm)) * growthExponent
    );

    if (now.getTime() > lastTime.getTime() + msPerStep) {
      lightCache = null;
      if (toCreate != halfLength) growthTerm++;
    }

    if (lightCache) return lightCache;

    let startArray = [];
    if (lightIndex == -1) {
      while (startArray.length <= toCreate) {
        startArray = startArray.concat([
          ...allColor1(lights, 3),
          ...allColor2(lights, 3)
        ]);
      }
      startArray = startArray.slice(0, toCreate);
    } else {
      startArray = new Array(toCreate).fill(light);
    }
    const endArray = new Array(Math.max(0, halfLength - toCreate)).fill({
      r: 0,
      g: 0,
      b: 0
    });
    const halfArray = startArray.concat(endArray);

    const fullArray = halfArray
      .slice(0, halfLength)
      .reverse()
      .concat(halfArray)
      .slice(0, size);
    lightCache = fullArray;
    return fullArray;
  };

  retFunc.reset = function() {
    growthTerm = 1;
    lightCache = null;
  };

  return retFunc;
};
