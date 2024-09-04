const cardOptionForMopType = [
    {
        paymentOption: 'VISA',
        code: 'VI'
    },
    {
        paymentOption: 'AMEX',
        code: 'AX'
    },
    {
        paymentOption: 'DISCOVER',
        code: 'DI'
    },
    {
        paymentOption: 'JCB',
        code: 'JC'
    },
    {
        paymentOption: 'MASTERCARD',
        code: 'MC'
    },
    {
        paymentOption: 'MAESTRO',
        code: 'MS'
    },
    {
        paymentOption: 'DINERS',
        code: 'DN'
    },
    {
        paymentOption: 'RUPAY',
        code: 'RU'
    }
];


const walletOptionForMopType = [
    {
      paymentOption: 'PAYTM WALLET',
      code: '101'
    },
    {
      paymentOption: 'MOBIKWIK WALLET',
      code: '102'
    },
    {
      paymentOption: 'AIRTEL MONEY WALLET',
      code: '103'
    },
    {
      paymentOption: 'VODAFONE MPESA WALLET',
      code: '104'
    },
    {
      paymentOption: 'RELIANCE JIO WALLET',
      code: '106'
    },
    {
      paymentOption: 'OLA MONEY WALLET',
      code: '107'
    },
    {
      paymentOption: 'FREECHARGE WALLET',
      code: '113'
    },
    {
      paymentOption: 'PHONEPE WALLET',
      code: '115'
    },
    {
      paymentOption: 'OXIGEN WALLET',
      code: '116'
    },
    {
      paymentOption: 'SBIBUDDY WALLET',
      code: '123'
    },
    {
      paymentOption: 'Amazon WALLET',
      code: '124'
    }
];

const netBankingOptionForMopType = [
    {
    paymentOption: 'AXIS BANK',
    code: '1005'
    },
    {
    paymentOption: 'BANK OF INDIA',
    code: '1009'
    },
    {
    paymentOption: 'BANK OF MAHARASHTRA',
    code: '1064'
    },
    {
    paymentOption: 'CANARA BANK',
    code: '1025'
    },
    {
    paymentOption: 'CENTRAL BANK OF INDIA',
    code: '1063'
    },
    {
    paymentOption: 'CITY UNION BANK',
    code: '1043'
    },
    {
    paymentOption: 'CORPORATION BANK',
    code: '1034'
    },
    {
    paymentOption: 'DEUTSCHE BANK',
    code: '1026'
    },
    {
    paymentOption: 'DEVELOPMENT CREDIT BANK',
    code: '1040'
    },
    {
    paymentOption: 'FEDERAL BANK',
    code: '1027'
    },
    {
    paymentOption: 'HDFC BANK',
    code: '1004'
    },
    {
    paymentOption: 'ICICI BANK',
    code: '1013'
    },
    {
    paymentOption: 'INDIAN BANK',
    code: '1069'
    },
    {
    paymentOption: 'INDIAN OVERSEAS BANK',
    code: '1049'
    },
    {
    paymentOption: 'INDUSIND BANK',
    code: '1054'
    },
    {
    paymentOption: 'INDUSTRIAL DEVELOPMENT BANK OF INDIA',
    code: '1003'
    },
    {
    paymentOption: 'JAMMU AND KASHMIR BANK',
    code: '1041'
    },
    {
    paymentOption: 'KARNATAKA BANK LTD',
    code: '1032'
    },
    {
    paymentOption: 'KARUR VYSYA BANK',
    code: '1048'
    },
    {
    paymentOption: 'KOTAK BANK',
    code: '1012'
    },
    {
    paymentOption: 'ORIENTAL BANK OF COMMERCE',
    code: '1042'
    },
    {
    paymentOption: 'RATNAKAR BANK',
    code: '1053'
    },
    {
    paymentOption: 'SOUTH INDIAN BANK',
    code: '1045'
    },
    {
    paymentOption: 'STATE BANK OF BIKANER AND JAIPUR',
    code: '1050'
    },
    {
    paymentOption: 'STATE BANK OF INDIA',
    code: '1030'
    },
    {
    paymentOption: 'UNION BANK OF INDIA',
    code: '1038'
    },
    {
    paymentOption: 'UNITED BANK OF INDIA',
    code: '1046'
    },
    {
    paymentOption: 'VIJAYA BANK',
    code: '1044'
    },
    {
    paymentOption: 'YES BANK',
    code: '1001'
    },
    {
    paymentOption: 'ANDHRA BANK',
    code: '1091'
    },
    {
    paymentOption: 'BANK OF BARODA RETAIL ACCOUNTS',
    code: '1093'
    },
    {
    paymentOption: 'CATHOLIC SYRIAN BANK',
    code: '1094'
    },
    {
    paymentOption: 'UCO BANK',
    code: '1103'
    },
    {
    paymentOption: 'ALLAHABAD BANK',
    code: '1000'
    },
    {
    paymentOption: 'AU SMALL FINANCE BANK',
    code: '1135'
    }
];

const validatedCardType =  (cur_val) => {
  //JCB
  const jcb_regex = new RegExp('^(?:2131|1800|35)[0-9]{0,}$'); //2131, 1800, 35 (3528-3589)
  // American Express
  const amex_regex = new RegExp('^3[47][0-9]{0,}$'); //34, 37
  // Diners Club
  const diners_regex = new RegExp('^3(?:0[0-59]{1}|[689])[0-9]{0,}$'); //300-305, 309, 36, 38-39
  // Visa
  const visa_regex = new RegExp('^4[0-9]{0,}$'); //4
  // MasterCard
  const mastercard_regex = new RegExp('^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)[0-9]{0,}$'); //2221-2720, 51-55
  const maestro_regex = new RegExp('^(5[06789]|6)[0-9]{0,}$'); //always growing in the range: 60-69, started with / not something else, but starting 5 must be encoded as mastercard anyway
  //Discover
  const discover_regex = new RegExp('^(6011|65|64[4-9]|62212[6-9]|6221[3-9]|622[2-8]|6229[01]|62292[0-5])[0-9]{0,}$');
  ////6011, 622126-622925, 644-649, 65
  // get rid of anything but numbers
  cur_val = cur_val.replace(/\D/g, '');
  // checks per each, as their could be multiple hits
  //fix: ordering matter in detection, otherwise can give false results in rare cases
  let sel_brand = "unknown";
  if (cur_val.match(jcb_regex)) {
      sel_brand = "JCB";
  } else if (cur_val.match(amex_regex)) {
      sel_brand = "AMEX";
  } else if (cur_val.match(diners_regex)) {
      sel_brand = "DINERS";
  } else if (cur_val.match(visa_regex)) {
      sel_brand = "VISA";
  } else if (cur_val.match(mastercard_regex)) {
      sel_brand = "MASTERCARD";
  } else if (cur_val.match(discover_regex)) {
      sel_brand = "DISCOVER";
  } else if (cur_val.match(maestro_regex)) {
      if (cur_val[0] === '5') { //started 5 must be mastercard
          sel_brand = "MASTERCARD";
      } else {
          sel_brand = "MAESTRO"; //maestro is all 60-69 which is not something else, thats why this condition in the end
      }
  }

  return sel_brand;
}

const DashhPayCode = {
    netBankingOptionForMopType,
    walletOptionForMopType,
    cardOptionForMopType,
    validatedCardType
}

export default DashhPayCode;