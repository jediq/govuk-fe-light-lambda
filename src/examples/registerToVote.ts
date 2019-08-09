import FrameworkService from "../types/framework";

const service: FrameworkService = {
    name: "Register to vote",
    targetUrl: "https://someurl.gov.uk",
    gdsPhase: "alpha",
    firstPage: "location",
    successMessage: "Your details where saved correctly",
    failureMessage: "Your details failed to be saved",
    cookieSecret: "8y/BBC(G+KbPeShVmYq3t6w9z$C&F)H@",
    pages: [
        {
            id: "location",
            description: "Where do you live?",
            nextPage: () => "nationality",
            preRequisiteData: [],
            items: [
                {
                    id: "locationField",
                    label: "Location",
                    type: "radio",
                    options: [
                        "England",
                        "Scotland",
                        "Wales",
                        "Northern Ireland",
                        "British citizen or eligible Irish citizen living in another country (including the Channel Islands or Isle of Man)"
                    ],
                    validation: {
                        regex: ".+",
                        error: "Choose your location"
                    }
                }
            ]
        },
        {
            id: "nationality",
            description: "What is your nationality?",
            nextPage: () => "dateOfBirth",
            preRequisiteData: ["locationField"],
            items: [
                {
                    id: "nationalityField",
                    label: "Nationality",
                    type: "radio",
                    options: [
                        "British (including English, Scottish, Welsh or from Northern Ireland)",
                        "Irish (including from Northern Ireland)",
                        "Citizen of a different country"
                    ],
                    validation: {
                        regex: ".+",
                        error: "Choose your nationality"
                    }
                }
            ]
        },
        {
            id: "dateOfBirth",
            description: "What is your date of birth?",
            nextPage: () => "addressLookup",
            preRequisiteData: ["locationField"],
            items: [
                {
                    id: "dateOfBirthField",
                    type: "datePicker",
                    label: "Date of Birth",
                    hint: "For example, 31 12 1970",

                    validation: {
                        regex: "^[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}$",
                        error: "Enter your date of birth"
                    }
                }
            ]
        },
        {
            id: "name",
            description: "What is your full name?",
            hint: "Enter all your names in full - don't use initials",
            nextPage: () => "nationalInsurance",
            preRequisiteData: ["dateOfBirth"],
            items: [
                {
                    id: "firstNameField",
                    type: "text",
                    label: "First name",

                    validation: {
                        regex: ".+",

                        error: "Enter your first name"
                    }
                },
                {
                    id: "middleNamesField",
                    type: "text",
                    label: "Middle names",

                    validation: {
                        regex: ".*",
                        error: "Enter your middle names"
                    }
                },
                {
                    id: "lastNameField",
                    type: "text",
                    label: "Last name",

                    validation: {
                        regex: ".+",
                        error: "Enter your last name"
                    }
                },
                {
                    id: "changedNameField",
                    label: "Changed name?",
                    hint: "Have you ever changed your name?",
                    type: "radio",
                    options: ["No, I haven’t changed my name", "Yes, I changed my name", "Prefer not to say"],

                    validation: {
                        regex: ".+",
                        error: "Select one option"
                    }
                }
            ]
        },
        {
            id: "nationalInsurance",
            description: "What is your National Insurance number?",
            preRequisiteData: ["channelField"],
            nextPage: () => "addressLookup",
            items: [
                {
                    id: "contactField",
                    type: "text",
                    label: "Email address",
                    hint: "Example: QQ 12 34 56 C",
                    width: "one-third",
                    validation: {
                        regex: ".+",
                        error: "Enter your National Insurance number"
                    }
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
                    label: "",
                    type: "text",
                    width: "one-third",
                    validation: {
                        regex: "^.+$",
                        error: "Enter your postcode"
                    }
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
            hint: "Choose your address from the list",
            nextPage: () => "secondAddressQuestion",
            preRequisiteData: ["addressList"],
            items: [
                {
                    id: "addressField",
                    options: "addressList",
                    placeholder: "select one address",
                    type: "inputSelect",
                    label: "Home address",
                    width: "one-third",

                    validation: {
                        regex: "^(?!select one address).*",
                        error: "Please choose an address"
                    }
                }
            ]
        },
        {
            id: "secondAddressQuestion",
            description: "Do you also live at a second address?",
            nextPage: () => "openRegisterQuestion",
            preRequisiteData: ["addressField"],
            items: [
                {
                    id: "secondAddressQuestionField",
                    label: "Second address?",
                    type: "radio",
                    options: ["No", "Yes, I spend time living at two homes", "Yes, I’m a student with home and term-time addresses"],

                    validation: {
                        regex: ".+",
                        error: "Choose a second address option"
                    }
                }
            ]
        },

        {
            id: "openRegisterQuestion",
            description: "Do you want to include your name and address on the open register?",
            hint:
        "The open register is an extract of the electoral register, but is not used for elections. It can be bought by any person, company or organisation. For example, it is used by businesses and charities to confirm name and address details.  Your decision won’t affect your right to vote.",
            nextPage: () => "postalVoteQuestion",
            preRequisiteData: ["secondAddressQuestionField"],
            items: [
                {
                    id: "openRegisterField",
                    label: "Open register?",
                    type: "radio",
                    options: ["No, I don’t want my name and address on the open register"],

                    validation: {
                        regex: ".+",
                        error: "Choose a open register option"
                    }
                }
            ]
        },
        {
            id: "postalVoteQuestion",
            description: "Do you want to apply for a postal vote?",
            nextPage: () => "otherVoters",
            preRequisiteData: ["secondAddressQuestionField"],
            items: [
                {
                    id: "postalVoteField",
                    label: "Postal vote?",
                    type: "radio",
                    options: [
                        "No, I prefer to vote in person",
                        "No, I already have a postal vote",
                        "Yes, email me a postal vote application form",
                        "Yes, post me a postal vote application form"
                    ],

                    validation: {
                        regex: ".+",
                        error: "Choose a postal vote option"
                    }
                }
            ]
        },
        {
            id: "otherVoters",
            description: "Is there anyone else aged 16 or over living at your current address?",
            nextPage: () => "channel-selection",
            preRequisiteData: ["secondAddressQuestionField"],
            items: [
                {
                    id: "otherVotersField",
                    label: "Other voters?",
                    type: "radio",
                    options: ["Yes", "No", "Not sure", "Prefer not to say"],

                    validation: {
                        regex: ".+",
                        error: "Choose an option"
                    }
                }
            ]
        },
        {
            id: "channel-selection",
            description: "If we have questions about your application, how should we contact you?",
            preRequisiteData: [],
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
                    label: "Contact type",
                    options: ["Email", "Text to my mobile phone"],

                    validation: {
                        regex: ".+",
                        error: "Choose which channel you want"
                    }
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
                    hint: "We'll use this to contact you",
                    width: "one-third",

                    validation: {
                        regex: "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$",
                        error: "Enter your email address"
                    }
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
                    hint: "We'll use this to contact you",
                    width: "one-third",

                    validation: {
                        regex: "^d{5} ?d{3} ?d{3}$",
                        error: "Enter your mobile number"
                    }
                }
            ]
        }
    ],
    confirmation: {
        description: "Check your answers before sending your application.",
        preRequisiteData: ["channelField", "contactField"],
        groups: [
            {
                title: "",
                items: ["firstNameField", "middleNamesField", "lastNameField"],
                ancillary: []
            }
        ]
    }
};

export default service;
