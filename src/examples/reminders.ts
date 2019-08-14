import FrameworkService from "../types/framework";

const service: FrameworkService = {
    name: "Get an annual MOT reminder",
    targetUrl: "https://someurl.gov.uk",
    gdsPhase: "alpha",
    firstPage: "vrn",
    successMessage: "Your details where saved correctly",
    failureMessage: "Your details failed to be saved",
    cookieSecret: "8y/B?D(G+KbPeShVmYq3t6w9z$C&F)H@",
    pages: [
        {
            id: "vrn",
            description: "What is the vehicle’s registration number?",
            nextPage: () => "chanel-selnection",
            preRequisiteData: [],
            items: [
                {
                    id: "vrnField",
                    type: "text",
                    label: "Registration number (number plate)",
                    hint: "For example, CU57ABC",
                    width: "one-third",
                    validation: {
                        regex: "^[A-Za-z0-9]{0,7}$",
                        error: "Enter the vehicle’s registration"
                    }
                }
            ],
            preValidation: [
                {
                    id: "vehicleData",
                    url:
            "https://uk1.ukvehicledata.co.uk/api/datapackage/MotHistoryAndTaxStatusData?v=2&api_nullitems=1&auth_apikey=21f37715-3198-474c-9fb2-ed1cdfc47604&key_VRM={{context.data.vrnField}}",

                    debugUrl: "http://jediq.com/ZZ99ABC.json",
                    headers: {
                        accept: "application/json"
                    }
                }
            ],
            validation: {
                validator: (context: any) => {
                    return context.data.vehicleData && context.data.vehicleData[0].registration;
                },
                error: "We don't hold information about this vehicle"
            }
        },
        {
            id: "channel-selection",
            description: "What type of reminder do you want to get?",
            preRequisiteData: ["vrnField"],
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
                    label: "Reminder type",
                    validation: {
                        regex: ".+",
                        error: "Choose one reminder you want"
                    }
                }
            ]
        },
        {
            id: "email",
            description: "What is your email address?",
            preRequisiteData: ["vrnField", "channelField"],
            nextPage: () => "tax-reminder",
            items: [
                {
                    id: "contactField",
                    type: "text",
                    label: "Email address",
                    hint: "Your reminder will be sent here",
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
            preRequisiteData: ["vrnField", "channelField"],
            nextPage: () => "tax-reminder",
            items: [
                {
                    id: "contactField",
                    type: "text",
                    label: "Mobile phone number",
                    hint: "Your reminder will be sent here",
                    width: "one-third",
                    validation: {
                        regex: "^d{5} ?d{3} ?d{3}$",
                        error: "Enter your mobile number"
                    }
                }
            ]
        },
        {
            id: "tax-reminder",
            description: "Do you also want a reminder about the vehicle tax?",
            preRequisiteData: ["vrnField"],
            nextPage: () => "confirmation",
            items: [
                {
                    id: "taxField",
                    label: "Tax reminder?",
                    type: "radio",
                    options: ["Yes", "No"],

                    validation: {
                        regex: ".+",
                        error: "Choose if you'd like a tax reminder"
                    }
                }
            ]
        }
    ],
    confirmation: {
        description: "Make sure the vehicle and your contact details are correct.",
        preRequisiteData: ["vrnField", "channelField", "contactField"],
        groups: [
            {
                title: "Personal details",
                items: ["contactField", "taxField"],
                ancillary: []
            },
            {
                title: "Vehicle details",
                items: ["vrnField"],
                ancillary: [
                    {
                        name: "Make",
                        location: "data.vehicleData[0].make"
                    }
                ]
            }
        ]
    }
};

export default service;
