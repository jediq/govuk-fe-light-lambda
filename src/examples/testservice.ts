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
import Summary from "../framework/elements/Summary";
import ErrorList from "../framework/elements/ErrorList";

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
            id: "intro",
            nextPage: () => "page1",
            preRequisiteData: [],
            elements: [
                new Phase("BETA", "This is a beta project"),
                new Heading("Introduction page"),
                new ErrorList("There is a problem"),
                new Form([
                    new TextField("tf", "STTTF"),
                    new RadioField("radios", "Radio buttons", ["radio 1", "radio 2", "radio 3"]),
                    new Paragraph("This is the paragraph in the middle of the form"),
                    new CheckboxField("checkboxes", "Checkbox", ["checkbox 1", "checkbox 2", "checkbox 3"]),
                    new SelectlistField("selectlist", "Select list", ["select 1", "select 2", "select 3"]),
                    new DatePickerField("datePicker", "Date Picker"),
                    new SubmitButton("Save and Continue")
                ])
            ]
        },
        {
            id: "page1",
            nextPage: () => "summary",
            preRequisiteData: [],

            elements: [
                new Phase("BETA", "This is a beta project"),
                new Heading("Please enter field one"),
                new ErrorList("There is a problem"),
                new Form([
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
                    new CheckboxField("checkboxes", "Checkbox", ["checkbox 1", "checkbox 2", "checkbox 3"]),
                    new SelectlistField("selectlist", "Select list", ["select 1", "select 2", "select 3"]),
                    new DatePickerField("datePicker", "Date Picker"),
                    new SubmitButton("Save and Continue")
                ])
            ],
            preValidation: []
        },
        {
            id: "summary",
            preRequisiteData: ["textField"],
            nextPage: () => null,
            elements: [
                new Form([
                    new Heading("Please check your info"),
                    new Summary("Summary 1", ["textField", "checkboxes", "selectlist"]),
                    new Paragraph("spacer"),
                    new Summary("Summary 2", ["radios"]),
                    new SubmitButton("Finish")
                ])
            ]
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
