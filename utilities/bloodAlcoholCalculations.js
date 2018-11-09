import Moment from 'moment';

const DRINK_SERVINGS = {
  Wine: 148,
  Beer: 354,
  Ciders: 354,
  Spirits: 44,
};

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

const calculateStandardDrinks = (drinkCategory, alcoholContent, volume) => {
  const ethanolDensity = 0.789;
  const percentage = alcoholContent / 100;
  const servingSize = drinkCategory
    ? DRINK_SERVINGS[drinkCategory]
    : volume;
  return (servingSize / 1000) * percentage * ethanolDensity;
};

const calculateBAC = (
  standardDrinks,
  bodyWater,
  weight,
  metabolismConstant,
  startedDrinkingMoment,
) => {
  const bodyWaterInBlood = 0.806;
  const swedishStandard = 1.2;
  const currentMoment = new Moment();
  const drinkingTime = Moment.duration(currentMoment.diff(startedDrinkingMoment)).asHours();
  return (
    (bodyWaterInBlood * standardDrinks * swedishStandard) / (bodyWater * weight)
  ) - (metabolismConstant * drinkingTime);
};

export {
  getBodyWaterConstant,
  getMetabolismConstant,
  calculateStandardDrinks,
  calculateBAC,
};
