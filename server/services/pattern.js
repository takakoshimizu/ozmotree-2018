function createPattern(genFunc) {
  const retFunc = function(lights, size) {
    let pattern = [];

    while(pattern.length < size) {
      pattern = pattern.concat(genFunc(lights, size));
    }
    
    const shiftPoint = Math.floor(Math.random() * size + 1);

    if (genFunc.randomSlice) {
      return pattern.slice(shiftPoint, size).concat(pattern.slice(0, shiftPoint));
    } else {
      return pattern;
    }
  };

  retFunc.reset = function() {
    if (genFunc.reset) {
      genFunc.reset();
    }
  }

  return retFunc;
}

export default createPattern;