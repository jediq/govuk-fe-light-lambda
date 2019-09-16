import FrameworkService from "../types/framework";
import {
  TextField,
  SubmitButton,
  Form,
  Heading,
  RadioField,
  Paragraph,
  Summary,
  ErrorList,
  Phase,
  SelectListField,
  DatePickerField,
  CheckboxField,
  PlainMarkup,
  Row
} from "../framework/elements/Elements";

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
        new Heading("Intro page"),
        new ErrorList("There is a problem"),
        new Row([3, 4, 4], [new PlainMarkup("three"), new PlainMarkup("four"), new PlainMarkup("four")]),
        new PlainMarkup(`<div style="color:red;">Plain markup</div>`),
        new Form([
          new TextField("constructedTF", "Constructed Text Field"),
          new Paragraph("This is the paragraph in the middle of the form"),
          new CheckboxField("checkboxes", "Checkbox", ["checkbox 1", "checkbox 2", "checkbox 3"]),
          new SelectListField("selectlist", "Select list", ["select 1", "select 2", "select 3"]),
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
        new Heading("Page 1"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "objectTF",
            type: "TextField",
            displayText: "Object Text Field",
            shortText: "Txt Fld",
            hint: "The text field",
            validation: {
              regex: "^[A-Za-z0-9]{0,7}$",
              error: "Enter the vehicle’s registration"
            }
          } as any) as TextField,

          new RadioField("radios", "Radio buttons", ["radio 1", "radio 2", "radio 3"]),
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
          new Summary("Intro page", ["constructedTF", "checkboxes", "selectlist"]),
          new Paragraph("spacer"),
          new Summary("Page 1", ["objectTF", "radios", "datePicker"]),
          new SubmitButton("Finish")
        ])
      ]
    }
  ]
};
export default service;
