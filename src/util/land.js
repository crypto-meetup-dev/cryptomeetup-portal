import * as CountryCode from 'i18n-iso-countries';

const Land = {
  countryCodeToLandId(countryCode) {
    // TODO: Directly use country id code
    return Object.keys(CountryCode.getAlpha3Codes()).indexOf(countryCode);
  },

  landIdToCountryCode(landId) {
    return Object.keys(CountryCode.getAlpha3Codes())[landId];
  },
};

export default Land;
