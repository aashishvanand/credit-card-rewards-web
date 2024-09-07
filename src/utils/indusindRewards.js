export const indusIndCardRewards = {
  "Avios": {
    cardType: "miles",
    defaultRate: 1 / 200, // 1 Avios per INR 200 spent
    rates: {
      "preferredInternational": 5 / 200,
      "preferredInternationalOnline": 1 / 200,
      "domesticAndOtherInternational": 1 / 200,
      "qatarBritishAirways": 2 / 200,
    },
    mccRates: {
      "5541": 0, // Fuel transactions
      "5542": 0, // Fuel transactions
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = indusIndCardRewards["Avios"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (indusIndCardRewards["Avios"].mccRates[mcc] !== undefined) {
        rate = indusIndCardRewards["Avios"].mccRates[mcc];
        category = "Excluded Category";
        rateType = "excluded";
      } else if (additionalParams.spendCategory) {
        rate = indusIndCardRewards["Avios"].rates[additionalParams.spendCategory];
        category = additionalParams.spendCategory;
        rateType = "category";
      }

      const miles = Math.floor(amount * rate);
      return { miles, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange, selectedMcc) => {
      const inputs = [
        {
          type: 'select',
          label: 'Spend Category',
          name: 'spendCategory',
          options: [
            { label: 'Preferred International POS', value: 'preferredInternational' },
            { label: 'Preferred International Online', value: 'preferredInternationalOnline' },
            { label: 'Domestic and Other International', value: 'domesticAndOtherInternational' },
            { label: 'Qatar Airways & British Airways', value: 'qatarBritishAirways' },
            { label: 'Other', value: 'default' }
          ],
          value: currentInputs.spendCategory || 'default',
          onChange: (value) => onChange('spendCategory', value)
        }
      ];

      // Auto-select based on MCC
      if (selectedMcc === "3005" || selectedMcc === "3136") {
        onChange('spendCategory', 'qatarBritishAirways');
      }

      return inputs;
    }
  },
  "Celesta": {
    cardType: "points",
    mccRates: {
    },
    defaultRate: 1 / 100, // 1 Reward Point for every ₹100 spent on Domestic transactions
    internationalRate: 3 / 100, // 3 Reward Points for every ₹100 spent on International transactions
    redemptionRate: {
      airmiles: 1, // 1 Reward Point = 1 Air mile
      cashCredit: 0.75 // 1 Reward Point = ₹ 0.75
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = indusIndCardRewards["Celesta"].defaultRate;
      let category = "Domestic Spends";
      let rateType = "default";

      if (additionalParams.isInternational) {
        rate = indusIndCardRewards["Celesta"].internationalRate;
        category = "International Spends";
        rateType = "international";
      }

      const points = Math.floor(amount * rate);
      const airmiles = points * indusIndCardRewards["Celesta"].redemptionRate.airmiles;
      const cashCredit = points * indusIndCardRewards["Celesta"].redemptionRate.cashCredit;

      return { points, rate, rateType, category, airmiles, cashCredit };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this an international transaction?',
        name: 'isInternational',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isInternational || false,
        onChange: (value) => onChange('isInternational', value === 'true')
      }
    ]
  },
  "Club Vistara Explorer": {
    cardType: "points",
    mccRates: {
    },
    defaultRate: 2 / 200, // 2 CV Points per INR 200 spent on all other spends
    rates: {
      "vistara": 8 / 200, // 8 CV Points per INR 200 spent on Vistara website/app
      "hotelAirlineTravel": 6 / 200, // 6 CV Points per INR 200 spent on Hotel, Airline, Travel
      "utilityInsuranceGovernmentFuel": 1 / 200, // 1 CV Point per INR 200 spent on Utility, Insurance, Government Payment, Fuel
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = indusIndCardRewards["Club Vistara Explorer"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isVistaraWebsite) {
        rate = indusIndCardRewards["Club Vistara Explorer"].rates.vistara;
        category = "Vistara Website/App";
        rateType = "vistara";
      } else if (additionalParams.isHotelAirlineTravel) {
        rate = indusIndCardRewards["Club Vistara Explorer"].rates.hotelAirlineTravel;
        category = "Hotel, Airline, Travel";
        rateType = "travel";
      } else if (additionalParams.isUtilityInsuranceGovernmentFuel) {
        rate = indusIndCardRewards["Club Vistara Explorer"].rates.utilityInsuranceGovernmentFuel;
        category = "Utility, Insurance, Government, Fuel";
        rateType = "utility";
      }

      const points = Math.floor(amount * rate);
      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Spend Category',
        name: 'spendCategory',
        options: [
          { label: 'Vistara Website/App', value: 'vistara' },
          { label: 'Hotel, Airline, Travel', value: 'travel' },
          { label: 'Utility, Insurance, Government, Fuel', value: 'utility' },
          { label: 'Other', value: 'other' }
        ],
        value: currentInputs.spendCategory || 'other',
        onChange: (value) => {
          onChange('spendCategory', value);
          onChange('isVistaraWebsite', value === 'vistara');
          onChange('isHotelAirlineTravel', value === 'travel');
          onChange('isUtilityInsuranceGovernmentFuel', value === 'utility');
        }
      }
    ]
  },
  "Crest": {
    cardType: "points",
    mccRates: {
    },
    defaultRate: 1 / 100, // 1 Reward point on every ₹ 100 spent on domestic transactions
    internationalRate: 2.5 / 100, // 2.5 Reward Points on every ₹ 100 spent on international transactions
    redemptionRate: {
      airmiles: 1, // 1 Reward Point = 1 Air mile
      cashCredit: 0.75 // 1 Reward Point = ₹ 0.75
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = indusIndCardRewards["Crest"].defaultRate;
      let category = "Domestic Spends";
      let rateType = "default";

      if (additionalParams.isInternational) {
        rate = indusIndCardRewards["Crest"].internationalRate;
        category = "International Spends";
        rateType = "international";
      }

      const points = Math.floor(amount * rate);
      const airmiles = points * indusIndCardRewards["Crest"].redemptionRate.airmiles;
      const cashCredit = points * indusIndCardRewards["Crest"].redemptionRate.cashCredit;

      return { points, rate, rateType, category, airmiles, cashCredit };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this an international transaction?',
        name: 'isInternational',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isInternational || false,
        onChange: (value) => onChange('isInternational', value === 'true')
      }
    ]
  },
  "Duo": {
    cardType: "points",
    mccRates: {
    },
    defaultRate: 1 / 150, // 1 Reward Point for every ₹ 150 spent
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = indusIndCardRewards["Duo"].defaultRate;
      const category = "All Spends";
      const rateType = "default";

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },
  "EazyDiner Platinum": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 Reward Points on every INR 100 spent
    specialRate: 0.7 / 100, // 0.7 Reward Points on Insurance, Rent, Utility and Government spends
    eazyPointsMultiplier: 2, // 2X EazyPoints
    mccRates: {
      "5541": 0, // Fuel transactions
      "5542": 0, // Fuel transactions
      // Add more excluded MCCs as needed
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = indusIndCardRewards["EazyDiner Platinum"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";
      let eazyPoints = 0;

      if (indusIndCardRewards["EazyDiner Platinum"].mccRates[mcc] !== undefined) {
        rate = indusIndCardRewards["EazyDiner Platinum"].mccRates[mcc];
        category = "Excluded Category";
        rateType = "excluded";
      } else if (additionalParams.isSpecialCategory) {
        rate = indusIndCardRewards["EazyDiner Platinum"].specialRate;
        category = "Special Category";
        rateType = "special";
      }

      const points = Math.floor(amount * rate);
      if (additionalParams.isEazyDiner) {
        eazyPoints = points * indusIndCardRewards["EazyDiner Platinum"].eazyPointsMultiplier;
      }

      return { points, eazyPoints, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction Type',
        name: 'transactionType',
        options: [
          { label: 'Special Category', value: 'special' },
          { label: 'EazyDiner', value: 'eazyDiner' },
          { label: 'Other', value: 'other' }
        ],
        value: currentInputs.transactionType || 'other',
        onChange: (value) => {
          onChange('transactionType', value);
          onChange('isSpecialCategory', value === 'special');
          onChange('isEazyDiner', value === 'eazyDiner');
        },
        helperText: 'Special categories typically include utilities, insurance, government payments, education, and real estate transactions. Check your card\'s terms for specific details.'
      }
    ]
  },
  "EazyDiner Signature": {
    cardType: "points",
    defaultRate: 4 / 100, // 4 Reward Points on every Rs 100 spent on all other spends
    diningShoppingEntertainmentRate: 10 / 100, // 10 Reward Points on every ₹100 spent on dining, shopping and entertainment
    eazyPointsMultiplier: 3, // 3X EazyPoints
    mccRates: {
      "5541": 0, // Fuel transactions
      "5542": 0, // Fuel transactions
      // Add more excluded MCCs as needed
    },
    diningShoppingEntertainmentMCCs: [
      "5812", "5813", "5814", // Dining
      "5311", "5411", "5611", "5621", "5631", "5641", "5651", "5661", "5691", "5699", // Shopping
      "7832", "7922", "7929", "7991", "7996", "7998", "7999" // Entertainment
    ],
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = indusIndCardRewards["EazyDiner Signature"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";
      let eazyPoints = 0;

      if (indusIndCardRewards["EazyDiner Signature"].mccRates[mcc] !== undefined) {
        rate = indusIndCardRewards["EazyDiner Signature"].mccRates[mcc];
        category = "Excluded Category";
        rateType = "excluded";
      } else if (indusIndCardRewards["EazyDiner Signature"].diningShoppingEntertainmentMCCs.includes(mcc)) {
        rate = indusIndCardRewards["EazyDiner Signature"].diningShoppingEntertainmentRate;
        category = "Dining, Shopping & Entertainment";
        rateType = "accelerated";
      }

      const points = Math.floor(amount * rate);
      if (additionalParams.isEazyDiner) {
        eazyPoints = points * indusIndCardRewards["EazyDiner Signature"].eazyPointsMultiplier;
      }

      return { points, eazyPoints, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this an EazyDiner transaction?',
        name: 'isEazyDiner',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isEazyDiner || false,
        onChange: (value) => onChange('isEazyDiner', value === 'true')
      }
    ]
  },
  "Indulge": {
    cardType: "points",
    mccRates: {
    },
    defaultRate: 1.5 / 100, // 1.5 Reward Points for every ₹100 spent
    redemptionRate: {
      cashCredit: 1, // 1 Reward Point = ₹1 Cash Credit
      airmiles: 1 // 1 Reward Point = 1 Air Mile
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = indusIndCardRewards["Indulge"].defaultRate;
      const category = "All Spends";
      const rateType = "default";

      const points = Math.floor(amount * rate);
      const cashCredit = points * indusIndCardRewards["Indulge"].redemptionRate.cashCredit;
      const airmiles = points * indusIndCardRewards["Indulge"].redemptionRate.airmiles;

      return { points, rate, rateType, category, cashCredit, airmiles };
    },
    dynamicInputs: () => []
  },
  "InterMiles Odyssey": {
    cardType: "miles",
    mccRates: {
    },
    defaultRates: {
      amex: {
        weekday: 4 / 100, // 4 InterMiles for every ₹100 spent on weekdays
        weekend: 6 / 100, // 6 InterMiles for every ₹100 spent on weekends
      },
      visa: {
        weekday: 3 / 100, // 3 InterMiles for every ₹100 spent on weekdays
        weekend: 4 / 100, // 4 InterMiles for every ₹100 spent on weekends
      }
    },
    travelRates: {
      amex: {
        weekday: 8 / 100, // 8 InterMiles for every ₹100 spent on weekdays
        weekend: 12 / 100, // 12 InterMiles for every ₹100 spent on weekends
      },
      visa: {
        weekday: 6 / 100, // 6 InterMiles for every ₹100 spent on weekdays
        weekend: 8 / 100, // 8 InterMiles for every ₹100 spent on weekends
      }
    },
    milesCap: 75000, // Cap of 75,000 InterMiles per year
    calculateRewards: (amount, mcc, additionalParams) => {
      const cardVariant = additionalParams.cardVariant || 'visa';
      const isWeekend = additionalParams.isWeekend || false;
      const isTravel = additionalParams.isTravel || false;

      let rate;
      if (isTravel) {
        rate = indusIndCardRewards["InterMiles Odyssey"].travelRates[cardVariant][isWeekend ? 'weekend' : 'weekday'];
      } else {
        rate = indusIndCardRewards["InterMiles Odyssey"].defaultRates[cardVariant][isWeekend ? 'weekend' : 'weekday'];
      }

      let category = isTravel ? "Travel Spends" : "Other Spends";
      let rateType = `${cardVariant}-${isWeekend ? 'weekend' : 'weekday'}${isTravel ? '-travel' : ''}`;

      const miles = Math.floor(amount * rate);

      return { miles, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Card Variant',
        name: 'cardVariant',
        options: [
          { label: 'American Express', value: 'amex' },
          { label: 'Visa', value: 'visa' }
        ],
        value: currentInputs.cardVariant || 'visa',
        onChange: (value) => onChange('cardVariant', value)
      },
      {
        type: 'radio',
        label: 'Is this a weekend transaction?',
        name: 'isWeekend',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isWeekend || false,
        onChange: (value) => onChange('isWeekend', value === 'true')
      },
      {
        type: 'radio',
        label: 'Is this a travel transaction?',
        name: 'isTravel',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isTravel || false,
        onChange: (value) => onChange('isTravel', value === 'true')
      }
    ]
  },
  "InterMiles Voyage": {
    cardType: "miles",
    mccRates: {
    },
    defaultRates: {
      amex: {
        weekday: 3 / 100, // 3 InterMiles for every ₹100 spent on weekdays
        weekend: 4 / 100, // 4 InterMiles for every ₹100 spent on weekends
      },
      visa: {
        weekday: 2 / 100, // 2 InterMiles for every ₹100 spent on weekdays
        weekend: 3 / 100, // 3 InterMiles for every ₹100 spent on weekends
      }
    },
    travelRates: {
      amex: {
        weekday: 6 / 100, // 6 InterMiles for every ₹100 spent on weekdays
        weekend: 8 / 100, // 8 InterMiles for every ₹100 spent on weekends
      },
      visa: {
        weekday: 4 / 100, // 4 InterMiles for every ₹100 spent on weekdays
        weekend: 6 / 100, // 6 InterMiles for every ₹100 spent on weekends
      }
    },
    milesCap: 50000, // Cap of 50,000 InterMiles per year
    calculateRewards: (amount, mcc, additionalParams) => {
      const cardVariant = additionalParams.cardVariant || 'visa';
      const isWeekend = additionalParams.isWeekend || false;
      const isTravel = additionalParams.isTravel || false;

      let rate;
      if (isTravel) {
        rate = indusIndCardRewards["InterMiles Voyage"].travelRates[cardVariant][isWeekend ? 'weekend' : 'weekday'];
      } else {
        rate = indusIndCardRewards["InterMiles Voyage"].defaultRates[cardVariant][isWeekend ? 'weekend' : 'weekday'];
      }

      let category = isTravel ? "Travel Spends" : "Other Spends";
      let rateType = `${cardVariant}-${isWeekend ? 'weekend' : 'weekday'}${isTravel ? '-travel' : ''}`;

      const miles = Math.floor(amount * rate);

      return { miles, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Card Variant',
        name: 'cardVariant',
        options: [
          { label: 'American Express', value: 'amex' },
          { label: 'Visa', value: 'visa' }
        ],
        value: currentInputs.cardVariant || 'visa',
        onChange: (value) => onChange('cardVariant', value)
      },
      {
        type: 'radio',
        label: 'Is this a weekend transaction?',
        name: 'isWeekend',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isWeekend || false,
        onChange: (value) => onChange('isWeekend', value === 'true')
      },
      {
        type: 'radio',
        label: 'Is this a travel transaction?',
        name: 'isTravel',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isTravel || false,
        onChange: (value) => onChange('isTravel', value === 'true')
      }
    ]
  },
  "Legend": {
    cardType: "points",
    defaultRate: 1 / 100, // 1 reward point for every ₹ 100 spent on weekdays
    weekendRate: 2 / 100, // 2 reward points for every ₹ 100 spent on weekends
    specialRate: 0.7 / 100, // 0.7 Reward Points on select categories
    redemptionRate: {
      nonCash: 0.75, // 1 RP = Rs.0.75 for non-cash redemption (excluding airmiles)
      cash: 0.50 // 1 RP = Rs.0.50 for cash redemption
    },
    mccRates: {
      "5541": 0, // Fuel transactions
      "5542": 0, // Fuel transactions
      // Add more excluded MCCs as needed
    },
    specialCategories: ["Utility", "Insurance", "Government", "Education"],
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = indusIndCardRewards["Legend"].defaultRate;
      let category = "Weekday Spend";
      let rateType = "default";

      if (additionalParams.isWeekend) {
        rate = indusIndCardRewards["Legend"].weekendRate;
        category = "Weekend Spend";
        rateType = "weekend";
      } else if (indusIndCardRewards["Legend"].mccRates[mcc] !== undefined) {
        rate = indusIndCardRewards["Legend"].mccRates[mcc];
        category = "Excluded Category";
        rateType = "excluded";
      } else if (additionalParams.isSpecialCategory) {
        rate = indusIndCardRewards["Legend"].specialRate;
        category = "Special Category";
        rateType = "special";
      }

      const points = Math.floor(amount * rate);
      const cashValue = points * indusIndCardRewards["Legend"].redemptionRate.cash;
      const nonCashValue = points * indusIndCardRewards["Legend"].redemptionRate.nonCash;

      return { points, rate, rateType, category, cashValue, nonCashValue };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction Type',
        name: 'transactionType',
        options: [
          { label: 'Weekend', value: 'weekend' },
          { label: 'Special Category', value: 'special' },
          { label: 'Other', value: 'other' }
        ],
        value: currentInputs.transactionType || 'other',
        onChange: (value) => {
          onChange('transactionType', value);
          onChange('isWeekend', value === 'weekend');
          onChange('isSpecialCategory', value === 'special');
        },
        helperText: 'Special categories typically include utilities, insurance, government payments, education, and real estate transactions. Check your card\'s terms for specific details.'
      }
    ],
  },
  "Nexxt": {
    cardType: "points",
    defaultRate: 1 / 150, // 1 Reward Point for every ₹ 150 spent
    mccRates: {
      "5541": 0, // Fuel transactions
      "5542": 0, // Fuel transactions
    },
    specialCategories: {
      rate: 0.7 / 150, // Assuming 0.7 Reward Points for every INR 150 on special categories
      categories: ["Utility", "Insurance", "Government", "Education", "RealEstate"]
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = indusIndCardRewards["Nexxt"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (indusIndCardRewards["Nexxt"].mccRates[mcc] !== undefined) {
        rate = indusIndCardRewards["Nexxt"].mccRates[mcc];
        category = "Excluded Category";
        rateType = "excluded";
      } else if (additionalParams.isSpecialCategory) {
        rate = indusIndCardRewards["Nexxt"].specialCategories.rate;
        category = "Special Category";
        rateType = "special";
      }

      const points = Math.floor(amount * rate);
      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a special category transaction?',
        name: 'isSpecialCategory',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isSpecialCategory || false,
        onChange: (value) => onChange('isSpecialCategory', value === 'true'),
        helperText: 'Special categories typically include utilities, insurance, government payments, education, and real estate transactions. Check your card\'s terms for specific details.'
      }
    ]
  },
  "Pinnacle": {
    cardType: "points",
    defaultRate: 1 / 100, // 1 reward point per INR 100 spent on POS, MoTo, IVR transactions and Standing instructions
    rates: {
      "ecommerce": 2.5 / 100,
      "ecomTravelAirline": 1.5 / 100,
    },
    mccRates: {
      "5541": 0, // Fuel transactions
      "5542": 0, // Fuel transactions
    },
    specialCategories: {
      rate: 0.7 / 100, // Assuming 0.7 Reward Points for every INR 100 on special categories
      categories: ["Utility", "Insurance", "Government", "Education"]
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = indusIndCardRewards["Pinnacle"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (indusIndCardRewards["Pinnacle"].mccRates[mcc] !== undefined) {
        rate = indusIndCardRewards["Pinnacle"].mccRates[mcc];
        category = "Excluded Category";
        rateType = "excluded";
      } else if (additionalParams.isEcommerce) {
        rate = indusIndCardRewards["Pinnacle"].rates.ecommerce;
        category = "E-commerce";
        rateType = "ecommerce";
      } else if (additionalParams.isEcomTravelAirline) {
        rate = indusIndCardRewards["Pinnacle"].rates.ecomTravelAirline;
        category = "E-com Travel and Airline";
        rateType = "ecomTravelAirline";
      } else if (additionalParams.isSpecialCategory) {
        rate = indusIndCardRewards["Pinnacle"].specialCategories.rate;
        category = "Special Category";
        rateType = "special";
      }

      const points = Math.floor(amount * rate);
      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction Type',
        name: 'transactionType',
        options: [
          { label: 'E-commerce', value: 'ecommerce' },
          { label: 'E-com Travel/Airline', value: 'ecomTravelAirline' },
          { label: 'Special Category', value: 'special' },
          { label: 'Other', value: 'other' }
        ],
        value: currentInputs.transactionType || 'other',
        onChange: (value) => {
          onChange('transactionType', value);
          onChange('isEcommerce', value === 'ecommerce');
          onChange('isEcomTravelAirline', value === 'ecomTravelAirline');
          onChange('isSpecialCategory', value === 'special');
        },
        helperText: 'Special categories typically include utilities, insurance, government payments, education, and real estate transactions. Check your card\'s terms for specific details.'
      }
    ]
  },
  "Pioneer Heritage": {
    cardType: "points",
    mccRates: {
    },
    defaultRate: 1 / 100, // 1 Reward point on every ₹ 100 spent on domestic transactions
    internationalRate: 2.5 / 100, // 2.5 Reward Points on every ₹ 100 spent on international transactions
    specialRate: 0.7 / 100, // Assuming 0.7 Reward Points for special categories
    specialCategories: ["Utility", "Government", "Education"],
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = indusIndCardRewards["Pioneer Heritage"].defaultRate;
      let category = "Domestic Spends";
      let rateType = "default";

      if (additionalParams.isInternational) {
        rate = indusIndCardRewards["Pioneer Heritage"].internationalRate;
        category = "International Spends";
        rateType = "international";
      } else if (additionalParams.isSpecialCategory) {
        rate = indusIndCardRewards["Pioneer Heritage"].specialRate;
        category = "Special Category";
        rateType = "special";
      }

      const points = Math.floor(amount * rate);
      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction Type',
        name: 'transactionType',
        options: [
          { label: 'International', value: 'international' },
          { label: 'Special Category', value: 'special' },
          { label: 'Other', value: 'other' }
        ],
        value: currentInputs.transactionType || 'other',
        onChange: (value) => {
          onChange('transactionType', value);
          onChange('isInternational', value === 'international');
          onChange('isSpecialCategory', value === 'special');
        },
        helperText: 'Special categories typically include utilities, insurance, government payments, education, and real estate transactions. Check your card\'s terms for specific details.'
      }
    ],
  },
  "Pioneer Legacy": {
    cardType: "points",
    defaultRate: 1 / 100, // 1 reward point on every ₹ 100 spent on weekday spends
    weekendRate: 2 / 100, // 2 reward points on every ₹ 100 spent on weekend spends
    specialRate: 0.7 / 100, // Assuming 0.7 Reward Points for special categories
    specialCategories: ["Utility", "Government", "Education"],
    mccRates: {
      "5541": 0, // Fuel transactions
      "5542": 0, // Fuel transactions
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = indusIndCardRewards["Pioneer Legacy"].defaultRate;
      let category = "Weekday Spends";
      let rateType = "default";

      if (additionalParams.isWeekend) {
        rate = indusIndCardRewards["Pioneer Legacy"].weekendRate;
        category = "Weekend Spends";
        rateType = "weekend";
      } else if (indusIndCardRewards["Pioneer Legacy"].mccRates[mcc] !== undefined) {
        rate = indusIndCardRewards["Pioneer Legacy"].mccRates[mcc];
        category = "Excluded Category";
        rateType = "excluded";
      } else if (additionalParams.isSpecialCategory) {
        rate = indusIndCardRewards["Pioneer Legacy"].specialRate;
        category = "Special Category";
        rateType = "special";
      }

      const points = Math.floor(amount * rate);
      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction Type',
        name: 'transactionType',
        options: [
          { label: 'Weekend', value: 'weekend' },
          { label: 'Special Category', value: 'special' },
          { label: 'Other', value: 'other' }
        ],
        value: currentInputs.transactionType || 'other',
        onChange: (value) => {
          onChange('transactionType', value);
          onChange('isWeekend', value === 'weekend');
          onChange('isSpecialCategory', value === 'special');
        },
        helperText: 'Special categories typically include utilities, insurance, government payments, education, and real estate transactions. Check your card\'s terms for specific details.'
      }
    ],
  },
  "Pioneer Private": {
    cardType: "points",
    mccRates: {
    },
    defaultRate: 3 / 100, // 3 Reward Points on all other spends
    specialRate: 0.7 / 100, // 0.7 Reward Points on certain spends
    specialCategories: ["Utility", "Government", "Education"],
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = indusIndCardRewards["Pioneer Private"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isSpecialCategory) {
        rate = indusIndCardRewards["Pioneer Private"].specialRate;
        category = "Special Category";
        rateType = "special";
      }

      const points = Math.floor(amount * rate);
      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a special category transaction?',
        name: 'isSpecialCategory',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isSpecialCategory || false,
        onChange: (value) => onChange('isSpecialCategory', value === 'true')
      }
    ]
  },
  "Platinum Aura Edge": {
    cardType: "points",
    defaultRate: 0.5 / 100, // 0.5 savings points for all other spends
    plans: {
      "Shop": {
        rates: {
          "Department Stores": 4 / 100,
          "Consumer Durables": 2 / 100,
          "Restaurants": 1.5 / 100,
          "Books": 1.5 / 100
        }
      },
      "Home": {
        rates: {
          "Grocery": 4 / 100,
          "Cellphone Bills": 1.4 / 100,
          "Electricity Bills": 1.4 / 100,
          "Insurance Premium": 1.4 / 100,
          "Medical": 1.5 / 100
        }
      },
      "Travel": {
        rates: {
          "Hotels": 4 / 100,
          "Airline Tickets": 2.5 / 100,
          "Car Rental": 1.5 / 100,
          "Rail Tickets": 1.5 / 100
        }
      },
      "Party": {
        rates: {
          "Restaurants": 4 / 100,
          "Department Stores": 2 / 100,
          "Bars and Pubs": 2 / 100,
          "Movie Tickets": 1.5 / 100
        }
      }
    },
    mccRates: {
      "5541": 0, // Fuel transactions
      "5542": 0, // Fuel transactions
      // Add more excluded MCCs as needed
    },
    specialCategories: {
      rate: 0.7 / 100, // 0.7 Reward Points on select categories
      categories: ["Utility", "Insurance", "Government", "Education", "RealEstate"]
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = indusIndCardRewards["Platinum Aura Edge"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.selectedPlan && additionalParams.selectedCategory) {
        const planRates = indusIndCardRewards["Platinum Aura Edge"].plans[additionalParams.selectedPlan].rates;
        if (planRates[additionalParams.selectedCategory]) {
          rate = planRates[additionalParams.selectedCategory];
          category = additionalParams.selectedCategory;
          rateType = "plan";
        }
      } else if (indusIndCardRewards["Platinum Aura Edge"].mccRates[mcc] !== undefined) {
        rate = indusIndCardRewards["Platinum Aura Edge"].mccRates[mcc];
        category = "Excluded Category";
        rateType = "excluded";
      } else if (additionalParams.isSpecialCategory) {
        rate = indusIndCardRewards["Platinum Aura Edge"].specialCategories.rate;
        category = "Special Category";
        rateType = "special";
      }

      const points = Math.floor(amount * rate);
      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'select',
        label: 'Select Reward Plan',
        name: 'selectedPlan',
        options: [
          { label: 'Shop Plan', value: 'Shop' },
          { label: 'Home Plan', value: 'Home' },
          { label: 'Travel Plan', value: 'Travel' },
          { label: 'Party Plan', value: 'Party' }
        ],
        value: currentInputs.selectedPlan || '',
        onChange: (value) => onChange('selectedPlan', value)
      },
      {
        type: 'select',
        label: 'Select Category',
        name: 'selectedCategory',
        options: (currentInputs) => {
          const plan = indusIndCardRewards["Platinum Aura Edge"].plans[currentInputs.selectedPlan];
          return plan ? Object.keys(plan.rates).map(category => ({ label: category, value: category })) : [];
        },
        value: currentInputs.selectedCategory || '',
        onChange: (value) => onChange('selectedCategory', value),
        condition: (inputs) => inputs.selectedPlan
      },
      {
        type: 'radio',
        label: 'Is this a special category transaction?',
        name: 'isSpecialCategory',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isSpecialCategory || false,
        onChange: (value) => onChange('isSpecialCategory', value === 'true')
      }
    ]
  },
  "Platinum RuPay": {
    cardType: "points",
    defaultRate: 1 / 100, // 1 Reward Point for every ₹ 100 on non UPI transactions
    upiRate: 2 / 100, // 2 Reward Points on every ₹ 100 transaction done through UPI
    mccRates: {
      "5541": 0, // Fuel transactions
      "5542": 0, // Fuel transactions
      // Add more excluded MCCs as needed
    },
    specialCategories: {
      rate: 0.7 / 100, // ₹ 0.70 for every ₹ 100 on select merchant categories
      categories: ["Utility", "Insurance", "Government", "Education", "RealEstate"]
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = indusIndCardRewards["Platinum RuPay"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isUPI) {
        rate = indusIndCardRewards["Platinum RuPay"].upiRate;
        category = "UPI Transaction";
        rateType = "upi";
      } else if (indusIndCardRewards["Platinum RuPay"].mccRates[mcc] !== undefined) {
        rate = indusIndCardRewards["Platinum RuPay"].mccRates[mcc];
        category = "Excluded Category";
        rateType = "excluded";
      } else if (additionalParams.isSpecialCategory) {
        rate = indusIndCardRewards["Platinum RuPay"].specialCategories.rate;
        category = "Special Category";
        rateType = "special";
      }

      const points = Math.floor(amount * rate);
      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction Type',
        name: 'transactionType',
        options: [
          { label: 'UPI', value: 'upi' },
          { label: 'Special Category', value: 'special' },
          { label: 'Other', value: 'other' }
        ],
        value: currentInputs.transactionType || 'other',
        onChange: (value) => {
          onChange('transactionType', value);
          onChange('isUPI', value === 'upi');
          onChange('isSpecialCategory', value === 'special');
        },
        helperText: 'Special categories typically include utilities, insurance, government payments, education, and real estate transactions. Check your card\'s terms for specific details.'
      }
    ],
  },
  "Platinum": {
    cardType: "points",
    defaultRate: 1.5 / 150, // 1.5 Reward Points for every INR 150 spent
    mccRates: {
      "5541": 0, // Fuel transactions
      "5542": 0, // Fuel transactions
    },
    specialCategories: {
      rate: 0.7 / 150, // Assuming 0.7 Reward Points for every INR 150 on special categories
      categories: ["Utility", "Insurance", "Government", "Education", "RealEstate"]
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = indusIndCardRewards["Platinum"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (indusIndCardRewards["Platinum"].mccRates[mcc] !== undefined) {
        rate = indusIndCardRewards["Platinum"].mccRates[mcc];
        category = "Excluded Category";
        rateType = "excluded";
      } else if (additionalParams.isSpecialCategory) {
        rate = indusIndCardRewards["Platinum"].specialCategories.rate;
        category = "Special Category";
        rateType = "special";
      }

      const points = Math.floor(amount * rate);
      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a special category transaction?',
        name: 'isSpecialCategory',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isSpecialCategory || false,
        onChange: (value) => onChange('isSpecialCategory', value === 'true'),
        helperText: 'Special categories typically include utilities, insurance, government payments, education, and real estate transactions. Check your card\'s terms for specific details.'
      }
    ]
  },
  "Samman": {
    cardType: "cashback",
    mccRates: {
    },
    defaultRate: 0.01, // 1% cashback on all spends
    maxCashback: 200, // Maximum cashback of ₹200 per statement cycle
    maxSpend: 20000, // Maximum spend of ₹20,000 per statement cycle for cashback
    calculateRewards: (amount, mcc, additionalParams) => {
      let cashback = Math.min(amount, indusIndCardRewards["Samman"].maxSpend) * indusIndCardRewards["Samman"].defaultRate;
      cashback = Math.min(cashback, indusIndCardRewards["Samman"].maxCashback);
      return { cashback, rate: indusIndCardRewards["Samman"].defaultRate, rateType: "default", category: "All Spends" };
    },
    dynamicInputs: () => []
  },
  "Solitaire": {
    cardType: "points",
    defaultRate: 1 / 100, // 1 Reward Point on every INR 100 spent
    specialRate: 0.7 / 100, // 0.7 Reward Point for every Rs 100 spent on special categories
    specialCategories: ["Utility", "Insurance", "Government", "Education", "RealEstate"],
    bonusPoints: 5000, // Bonus points for spending INR 1 lakh in first 30 days
    mccRates: {
      "5541": 0, // Fuel transactions
      "5542": 0, // Fuel transactions
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = indusIndCardRewards["Solitaire"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";
      let bonusPoints = 0;

      if (indusIndCardRewards["Solitaire"].mccRates[mcc] !== undefined) {
        rate = indusIndCardRewards["Solitaire"].mccRates[mcc];
        category = "Excluded Category";
        rateType = "excluded";
      } else if (additionalParams.isSpecialCategory) {
        rate = indusIndCardRewards["Solitaire"].specialRate;
        category = "Special Category";
        rateType = "special";
      }

      if (additionalParams.isFirstMonth && additionalParams.totalSpend >= 100000) {
        bonusPoints = indusIndCardRewards["Solitaire"].bonusPoints;
      }

      const points = Math.floor(amount * rate) + bonusPoints;
      return { points, rate, rateType, category, bonusPoints };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction Type',
        name: 'transactionType',
        options: [
          { label: 'Special Category', value: 'special' },
          { label: 'First 30 Days', value: 'firstMonth' },
          { label: 'Other', value: 'other' }
        ],
        value: currentInputs.transactionType || 'other',
        onChange: (value) => {
          onChange('transactionType', value);
          onChange('isSpecialCategory', value === 'special');
          onChange('isFirstMonth', value === 'firstMonth');
        }
      },
      {
        type: 'select',
        label: 'Total spend in first 30 days',
        name: 'totalSpend',
        options: [
          { label: 'Up to ₹100,000', value: 0 },
          { label: '₹100,000 or more', value: 100000 }
        ],
        value: currentInputs.totalSpend || 0,
        onChange: (value) => onChange('totalSpend', parseInt(value)),
        condition: (inputs) => inputs.transactionType === 'firstMonth'
      }
    ]
  },
  "Tiger": {
    cardType: "points",
    defaultRate: 1 / 100, // 1 Reward Point on every ₹ 100 spent
    rewardMultipliers: [
      { threshold: 100000, multiplier: 1 },
      { threshold: 250000, multiplier: 2 },
      { threshold: 500000, multiplier: 4 },
      { threshold: Infinity, multiplier: 6 }
    ],
    redemptionRate: {
      airmiles: 1.2, // 1 Reward Point = 1.2 Airmiles
      cashCredit: 0.4 // 1 Reward Point = ₹ 0.40 (Cash credit)
    },
    mccRates: {
      "5541": 0, // Fuel transactions
      "5542": 0, // Fuel transactions
    },
    specialCategories: {
      rate: 0, // No rewards for special categories
      categories: ["Utility", "Insurance", "Government", "Education", "RealEstate"]
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = indusIndCardRewards["Tiger"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";
      let multiplier = 1;

      if (indusIndCardRewards["Tiger"].mccRates[mcc] !== undefined) {
        rate = indusIndCardRewards["Tiger"].mccRates[mcc];
        category = "Excluded Category";
        rateType = "excluded";
      } else if (additionalParams.isSpecialCategory) {
        rate = indusIndCardRewards["Tiger"].specialCategories.rate;
        category = "Special Category";
        rateType = "special";
      } else if (additionalParams.annualSpend) {
        for (let tier of indusIndCardRewards["Tiger"].rewardMultipliers) {
          if (additionalParams.annualSpend <= tier.threshold) {
            multiplier = tier.multiplier;
            break;
          }
        }
        rateType = "multiplied";
      }

      const points = Math.floor(amount * rate * multiplier);
      const airmiles = points * indusIndCardRewards["Tiger"].redemptionRate.airmiles;
      const cashCredit = points * indusIndCardRewards["Tiger"].redemptionRate.cashCredit;

      return { points, rate, rateType, category, multiplier, airmiles, cashCredit };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'select',
        label: 'Annual Spend so far',
        name: 'annualSpend',
        options: [
          { label: 'Up to ₹100,000', value: 0 },
          { label: '₹100,001 - ₹250,000', value: 100000 },
          { label: '₹250,001 - ₹500,000', value: 250000 },
          { label: 'Above ₹500,000', value: 500000 }
        ],
        value: currentInputs.annualSpend || 0,
        onChange: (value) => onChange('annualSpend', parseInt(value))
      },
      {
        type: 'radio',
        label: 'Is this a special category transaction?',
        name: 'isSpecialCategory',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isSpecialCategory || false,
        onChange: (value) => onChange('isSpecialCategory', value === 'true')
      }
    ]
  },
};

export const calculateIndusIndRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = indusIndCardRewards[cardName];
  if (!cardReward) {
    return {
      points: 0,
      miles: 0,
      rewardText: "Card not found",
      uncappedPoints: 0,
      cappedPoints: 0,
      appliedCap: null
    };
  }

  const result = cardReward.calculateRewards(amount, mcc, additionalParams);

  if (cardReward.cardType === "miles") {
    return applyMilesCapping(result, cardReward, cardName);
  } else {
    return applyPointsCapping(result, cardReward, cardName);
  }
};

export const applyMilesCapping = (result, cardReward, cardName) => {
  let { miles, rate, rateType, category } = result;
  let cappedMiles = miles;
  let appliedCap = null;

  if (cardReward.capping && cardReward.capping.maxMiles) {
    cappedMiles = Math.min(miles, cardReward.capping.maxMiles);
    if (cappedMiles < miles) {
      appliedCap = {
        category: "Total Miles",
        maxMiles: cardReward.capping.maxMiles,
        period: cardReward.capping.period
      };
    }
  }

  const rewardText = generateMilesRewardText(cardName, cappedMiles, rate, rateType, category, appliedCap);

  return {
    miles: cappedMiles,
    rewardText,
    uncappedMiles: miles,
    cappedMiles,
    appliedCap,
    rateUsed: rate,
    rateType,
    category
  };
};

export const applyPointsCapping = (result, cardReward, cardName) => {
  let { points, rate, rateType, category } = result;
  let cappedPoints = points;
  let appliedCap = null;

  if (cardReward.capping && cardReward.capping.maxPoints) {
    cappedPoints = Math.min(points, cardReward.capping.maxPoints);
    if (cappedPoints < points) {
      appliedCap = {
        category: "Total Points",
        maxPoints: cardReward.capping.maxPoints,
        period: cardReward.capping.period
      };
    }
  }

  const rewardText = generatePointsRewardText(cardName, cappedPoints, rate, rateType, category, appliedCap);

  return {
    points: cappedPoints,
    rewardText,
    uncappedPoints: points,
    cappedPoints,
    appliedCap,
    rateUsed: rate,
    rateType,
    category
  };
};

export const generateMilesRewardText = (cardName, miles, rate, rateType, category, appliedCap) => {
  let rewardText = `${miles} Miles`;

  if (category !== "Other Spends") {
    rewardText += ` (${category})`;
  }

  if (appliedCap) {
    rewardText += ` (Capped at ${appliedCap.maxMiles} miles per ${appliedCap.period})`;
  }

  return rewardText;
};

const generatePointsRewardText = (cardName, points, rate, rateType, category, appliedCap) => {
  let rewardText = `${points} Reward Points`;

  if (category !== "Other Spends") {
    rewardText += ` (${category})`;
  }

  if (appliedCap) {
    rewardText += ` (Capped at ${appliedCap.maxPoints} points per ${appliedCap.period})`;
  }

  return rewardText;
};

export const getIndusIndCardInputs = (cardName, currentInputs, onChange) => {
  const cardReward = indusIndCardRewards[cardName];
  return cardReward && cardReward.dynamicInputs ? cardReward.dynamicInputs(currentInputs, onChange) : [];
};