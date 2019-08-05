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
                    error: "Enter the your first name"
                },
                {
                    id: "lastNameField",
                    type: "text",
                    label: "Last Name",
                    width: "one-third",
                    validator: "^.+$",
                    error: "Enter the your last name"
                }
            ]
        },
        {
            id: "dateofbirth",
            description: "What's your date of birth?",
            nextPage: () => "addressLookup",
            preRequisiteData: ["typeField", "firstNameField", "lastNameField"],
            items: [
                {
                    id: "dateofBirthField",
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
            preRequisiteData: ["typeField", "firstNameField", "lastNameField", "dateOfBirthField"],
            items: [
                {
                    id: "homePostcodeField",
                    type: "text",
                    validator: "^.+$"
                }
            ]
        },
        {
            id: "chooseAddress",
            description: "What's your home address?",
            nextPage: () => "chooseAddress",
            preRequisiteData: ["typeField", "firstNameField", "lastNameField", "dateOfBirthField", "postcodeField"],
            items: [
                {
                    id: "homeAddressField",
                    type: "addressChooser"
                }
            ]
        }
    ]
};
