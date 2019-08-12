import FrameworkService from "../types/framework";

const service: FrameworkService = {
    name: "Test Service",
    targetUrl: "https://someurl.gov.uk",
    gdsPhase: "alpha",
    firstPage: "page1",
    successMessage: "Your details where saved correctly",
    failureMessage: "Your details failed to be saved",
    cookieSecret: "8y/B?D(G+KbPeShHmYq3t6w9z$C&F)H@",
    pages: [
        {
            id: "page1",
            description: "Please enter field one",
            nextPage: () => "field2",
            preRequisiteData: [],
            items: [
                {
                    id: "field1Field",
                    type: "text",
                    label: "Field1?",
                    hint: "For example, f.i.e.l.d.1",
                    width: "one-third",
                    validation: {
                        regex: ".+",
                        error: "Enter the field"
                    }
                }
            ],
            preValidation: []
        },
        {
            id: "page2",
            description: "Please enter field two",
            preRequisiteData: ["field1Field"],
            nextPage: () => "confirmation",
            items: [
                {
                    id: "field2Field",
                    type: "radio",
                    label: "field2",
                    options: ["option1", "option2"],
                    validation: {
                        regex: ".+",
                        error: "Choose the option you want"
                    }
                }
            ]
        }
    ],
    confirmation: {
        description: "Make sure the details are correct.",
        preRequisiteData: ["field1Field", "field1Field"],
        groups: [
            {
                title: "Fields",
                items: ["field1Field", "field2Field"],
                ancillary: []
            }
        ]
    }
};
export default service;
