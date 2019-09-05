import FrameworkService from "../types/framework";
import TextField from "../framework/elements/TextField";
import SubmitButton from "../framework/elements/SubmitButton";
import Form from "../framework/elements/Form";
import Heading from "../framework/elements/Heading";
import RadioField from "../framework/elements/RadioField";
import CheckboxField from "../framework/elements/CheckboxField";
import SelectlistField from "../framework/elements/SelectListField";
import Paragraph from "../framework/elements/Paragraph";
import Phase from "../framework/elements/Phase";
import DatePickerField from "../framework/elements/DataPickerField";

const service: FrameworkService = {
    name: "Test Service",
    slug: "test-service",
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
            nextPage: () => "page2",
            preRequisiteData: [],

            elements: [
                new Phase("BETA", "This is a beta project"),
                new Heading("Please enter field one"),
                ({
                    type: "Form",
                    elements: [
                        ({
                            name: "textField",
                            type: "TextField",
                            displayText: "Text Field",
                            shortText: "Txt Fld",
                            hint: "The text field",
                            validation: {
                                regex: "^[A-Za-z0-9]{0,7}$",
                                error: "Enter the vehicle’s registration"
                            }
                        } as any) as TextField,
                        new RadioField("radios", "Radio buttons", ["radio 1", "radio 2", "radio 3"]),
                        new Paragraph("This is the paragraph in the middle of the form"),
                        new CheckboxField("checkboxes", "Checkbox"),
                        new SelectlistField("selectlist", "Select list", ["select 1", "select 2", "select 3"]),
                        new DatePickerField("datePicker", "Date Picker"),
                        new SubmitButton("Save and Continue")
                    ]
                } as any) as Form
            ],
            preValidation: []
        },
        {
            id: "page2",
            description: "Please enter field two",
            preRequisiteData: ["field1Field"],
            nextPage: () => "page3"
        },
        {
            id: "page3",
            description: "What is your date of birth?",
            nextPage: () => "confirmation",
            preRequisiteData: ["field3Field"]
        }
    ],
    confirmation: {
        description: "Make sure the details are correct.",
        preRequisiteData: ["field1Field", "field1Field", "field3Field", "field4Field"],
        groups: [
            {
                title: "Fields 1 & 2",
                items: ["field1Field", "field2Field"],
                ancillary: []
            },
            {
                title: "Fields 3 & 4",
                items: ["field3Field", "field4Field"],
                ancillary: []
            }
        ]
    }
};
export default service;
