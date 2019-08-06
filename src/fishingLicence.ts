module.exports = {
  name: "Get a fishing licence",
  targetUrl: "https://someurl.gov.uk",
  gdsPhase: "beta",
  firstPage: "duration",
  successMessage: "Your details where saved correctly",
  failureMessage: "Your details failed to be saved",
  cookieSecret: "8y/BBC(G+KbPeShVmYq3t6w9z$C&F)H@",
  pages: [
    {
      id: "duration",
      description: "Which fishing licence do you want to get?",
      nextPage: () => "name",
      preRequisiteData: [],
      items: [
        {
          id: "durationField",
          type: "radio",
          options: ["1 day", "8 days", "12 months"],
          validator: ".+",
          error: "Choose the duration"
        }
      ]
    },
    {
      id: "name",
      description: "What's your name?",
      nextPage: () => "dateofbirth",
      preRequisiteData: ["durationField"],
      items: [
        {
          id: "firstNameField",
          type: "text",
          label: "First Name",
          width: "one-third",
          validator: "^.+$",
          error: "Enter your first name"
        },
        {
          id: "lastNameField",
          type: "text",
          label: "Last Name",
          width: "one-third",
          validator: "^.+$",
          error: "Enter your last name"
        }
      ]
    },
    {
      id: "dateofbirth",
      description: "What's your date of birth?",
      nextPage: () => "addressLookup",
      preRequisiteData: ["firstNameField", "lastNameField"],
      items: [
        {
          id: "dateOfBirthField",
          type: "datePicker",
          label: "We use this information to find out if you're eligible for a senior or junior concession.",
          hint: "For example, 23 3 1972",
          error: "Enter your date of birth"
        }
      ]
    },
    {
      id: "addressLookup",
      description: "What's your home address?",
      nextPage: () => "chooseAddress",
      preRequisiteData: ["dateOfBirthField-day", "dateOfBirthField-month", "dateOfBirthField-year"],
      items: [
        {
          id: "homePostcodeField",
          type: "text",
          width: "one-third",
          validator: "^.+$"
        }
      ],
      preValidation: [
        {
          id: "addressList",
          url: "https://api.getAddress.io/find/{{homePostcodeField}}?api-key=z3s2qP97vkWJN7gyhpFtaQ14238",

          debugUrl: "https://api.getAddress.io/find/HU120HE?api-key=z3s2qP97vkWJN7gyhpFtaQ14238",
          headers: {
            accept: "application/json"
          },
          postProcess(data: any) {
            return data.addresses.map((str: any) => str.replace(" ,", ""));
          }
        }
      ],
      validation: {
        validator: (context: any) => {
          return context.data.addressList && context.data.addressList.length > 0;
        },
        error: "We couldn't find that postcode"
      }
    },
    {
      id: "chooseAddress",
      description: "Select your address",
      nextPage: () => "startType",
      preRequisiteData: ["addressList"],
      items: [
        {
          id: "addressField",
          options: "addressList",
          type: "inputSelect",
          label: "Choose your address from the list",
          width: "one-third",
          validator: "^.+$",
          error: "Please choose an address"
        }
      ]
    },
    {
      id: "startType",
      description: "When would you like your licence to start?",
      nextPage(context: any) {
        if (context.data.startType === "Choose the duration") {
          return "type";
        } else {
          return "startDate";
        }
      },
      preRequisiteData: ["addressField"],
      items: [
        {
          id: "startTypeField",
          type: "radio",
          options: ["30 minutes after payment", "Another time or date"],
          validator: ".+",
          error: "Choose the duration"
        }
      ]
    },
    {
      id: "startDate",
      description: "When would you like your licence to start?",
      nextPage: () => "type",
      preRequisiteData: ["startTypeField"],
      items: [
        {
          id: "startDateField",
          type: "datePicker",
          hint: "For example, 23 3 1972",
          error: "Enter your date of birth"
        }
      ]
    },
    {
      id: "type",
      description: "What type of fishing licence do you want?",
      nextPage: () => "channel-selection",
      preRequisiteData: ["startTypeField"],
      items: [
        {
          id: "typeField",
          type: "radio",
          options: ["Trout and coarse", "Salmon and sea trout"],
          validator: ".+",
          error: "Choose the type"
        }
      ]
    },
    {
      id: "channel-selection",
      description: "How can we send you your licence details?",
      preRequisiteData: ["typeField"],
      nextPage(context: any) {
        if (context.data.channelField === "Email") {
          return "email";
        } else {
          return "phone-number";
        }
      },
      items: [
        {
          id: "channelField",
          type: "radio",
          options: ["Email", "Text to my mobile phone"],
          validator: ".+",
          error: "Choose one reminder you want"
        }
      ]
    },
    {
      id: "email",
      description: "What is your email address?",
      preRequisiteData: ["channelField"],
      nextPage: () => "confirmation",
      items: [
        {
          id: "contactField",
          type: "text",
          label: "Email address",
          hint: "Your licence will be sent here",
          width: "one-third",
          validator: "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$",
          error: "Enter your email address"
        }
      ]
    },
    {
      id: "phone-number",
      description: "What is your mobile number?",
      preRequisiteData: ["channelField"],
      nextPage: () => "confirmation",
      items: [
        {
          id: "contactField",
          type: "text",
          label: "Mobile phone number",
          hint: "Your licence will be sent here",
          width: "one-third",
          validator: "^d{5} ?d{3} ?d{3}$",
          error: "Enter your mobile number"
        }
      ]
    }
  ],
  confirmation: {
    description: "Check your new licence details.",
    preRequisiteData: ["channelField", "contactField"],
    groups: [
      {
        title: "Personal details",
        items: ["firstNameField", "lastNameField", "contactField", "dateOfBirthField", "addressField"],
        ancillary: []
      },
      {
        title: "Licence details",
        items: ["typeField", "durationField", "startDateField"],
        ancillary: []
      }
    ]
  }
};
