const getBodyWaterConstant = (gender) => {
  let BW = 0.0;
  switch (gender) {
    case 'Male':
      BW = 0.58;
      break;
    case 'Female': case 'Other': default:
      BW = 0.49;
      break;
  }
  return BW;
};

const getMetabolismConstant = (gender) => {
  let MR = 0.0;
  switch (gender) {
    case 'Male':
      MR = 0.015;
      break;
    case 'Female': case 'Other': default:
      MR = 0.017;
      break;
  }
  return MR;
};

export {
  getBodyWaterConstant,
  getMetabolismConstant,
};
