import FrameworkService from "../types/framework";

const service: FrameworkService = {
    name: "Get a fishing licence",
    slug: "fishing-licence",
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
                    label: "Licence duration",
                    type: "radio",
                    options: ["1 day", "8 days", "12 months"],
                    validation: {
                        regex: ".+",
                        error: "Choose the duration"
                    }
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
                    validation: {
                        regex: "^.+$",
                        error: "Enter your first name"
                    }
                },
                {
                    id: "lastNameField",
                    type: "text",
                    label: "Last Name",
                    width: "one-third",
                    validation: {
                        regex: "^.+$",
                        error: "Enter your last name"
                    }
                }
            ]
        },
        {
            id: "dateofbirth",
            description: "What's your date of birth?",
            hint: "We use this information to find out if you're eligible for a senior or junior concession.",
            nextPage: () => "addressLookup",
            preRequisiteData: ["firstNameField", "lastNameField"],
            items: [
                {
                    id: "dateOfBirthField",
                    type: "datePicker",
                    label: "Date of Birth",
                    hint: "For example, 23 3 1972",
                    validation: {
                        regex: "^[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}$",
                        error: "Enter your date of birth"
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
                    type: "text",
                    width: "one-third",
                    label: "postcode",
                    validation: {
                        regex: "^.+$",
                        error: "Choose an address"
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
            nextPage: () => "startType",
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
            id: "startType",
            description: "When would you like your licence to start?",
            nextPage(context: any) {
                if (context.data.startTypeField === "30 minutes after payment") {
                    return "type";
                } else {
                    return "startDate";
                }
            },
            preRequisiteData: ["addressField"],
            items: [
                {
                    id: "startTypeField",
                    label: "Start type",
                    type: "radio",
                    options: ["30 minutes after payment", "Another time or date"],
                    validation: {
                        regex: ".+",
                        error: "Choose the start type"
                    }
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
                    label: "Start date",
                    type: "datePicker",
                    hint: "For example, 23 3 1972",
                    validation: {
                        regex: "^[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}$",
                        error: "Enter the date to start your licence"
                    }
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
                    label: "Licence type",
                    options: ["Trout and coarse", "Salmon and sea trout"],
                    validation: {
                        regex: ".+",
                        error: "Choose the type"
                    }
                }
            ]
        },
        {
            id: "channel-selection",
            description: "How can we send you your licence details?",
            preRequisiteData: ["startTypeField"],
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
                    hint: "Your licence will be sent here",
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
                    hint: "Your licence will be sent here",
                    width: "one-third",
                    validation: {
                        regex: "^d{5} ?d{3} ?d{3}$",
                        error: "Enter your mobile number"
                    }
                }
            ]
        }
    ] // ,
    // confirmation: {
    //     description: "Check your new licence details.",
    //     preRequisiteData: ["channelField", "contactField"],
    //     groups: [
    //         {
    //             title: "Personal details",
    //             items: ["firstNameField", "lastNameField", "channelField", "contactField", "dateOfBirthField", "addressField"],
    //             ancillary: []
    //         },
    //         {
    //             title: "Licence details",
    //             items: ["typeField", "durationField", "startDateField"],
    //             ancillary: []
    //         }
    //     ]
    // }
};

export default service;
