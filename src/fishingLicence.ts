module.exports = {
    name: "Get a fishing licence",
    targetUrl: "https://someurl.gov.uk",
    gdsPhase: "beta",
    firstPage: "type",
    successMessage: "Your details where saved correctly",
    failureMessage: "Your details failed to be saved",
    cookieSecret: "8y/BBC(G+KbPeShVmYq3t6w9z$C&F)H@",
    pages: [
        {
            id: "type",
            description: "Which fishing licence do you want to get?",
            nextPage: () => "name",
            preRequisiteData: [],
            items: [
                {
                    id: "typeField",
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
            preRequisiteData: ["typeField"],
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
                    }
                }
            ],
            validation: {
                validator: (context: any) => {
                    return context.data.addressList && context.data.addressList.addresses.length > 0;
                },
                error: "We don't hold information about this vehicle"
            }
        },
        {
            id: "chooseAddress",
            description: "Select your address",
            nextPage: () => "chooseAddress",
            preRequisiteData: ["addressList"],
            items: [
                {
                    id: "address",
                    options: "context.data.addressList.addresses",
                    type: "inputSelect",
                    label: "Choose your address from the list",
                    width: "one-third",
                    validator: "^.+$",
                    error: "Please choose an address"
                }
            ]
        }
    ]
};
