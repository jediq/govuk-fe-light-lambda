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
      nextPage: () => "page2",
      preRequisiteData: [],
      items: [
        {
          id: "field1Field",
          type: "text",
          label: "Field1?",
          hint: "For example, FIELD1",
          width: "one-third",
          validation: {
            regex: "FIELD1",
            error: "Enter the field as : FIELD1"
          }
        }
      ],
      preValidation: []
    },
    {
      id: "page2",
      description: "Please enter field two",
      preRequisiteData: ["field1Field"],
      nextPage: () => "page3",
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
        },
        {
          id: "field3Field",
          type: "checkbox",
          label: "field3",
          options: ["option1", "option2"],
          validation: {
            regex: ".+",
            error: "Choose the option you want"
          }
        },
        {
          id: "field4Field",
          type: "inputSelect",
          label: "field4",
          options: ["option1", "option2"],
          validation: {
            regex: ".+",
            error: "Choose the option you want"
          }
        }
      ]
    },
    {
      id: "page3",
      description: "What is your date of birth?",
      nextPage: () => "confirmation",
      preRequisiteData: ["field3Field"],
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
