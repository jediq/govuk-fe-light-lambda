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
            nextPage: () => "channel-selection",
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
        }
    ]
};
