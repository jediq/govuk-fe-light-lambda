import FrameworkService from "../types/framework";
import {
  TextField,
  SubmitButton,
  Form,
  Heading,
  RadioField,
  SelectListField,
  Paragraph,
  ErrorList,
  DatePickerField,
  Summary
} from "../framework/elements/Elements";

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
      nextPage: () => "name",
      preRequisiteData: [],
      elements: [
        new Heading("Which fishing licence do you want to get?"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "durationField",
            type: "RadioField",
            options: [{ value: "1 day", text: "1 day" }, { value: "8 days", text: "8 days" }, { value: "12 months", text: "12 months" }],
            validation: {
              regex: ".+",
              error: "Choose the duration"
            }
          } as any) as RadioField,
          new SubmitButton("Save and Continue")
        ])
      ]
    },
    {
      id: "name",
      nextPage: () => "dateofbirth",
      preRequisiteData: ["durationField"],
      elements: [
        new Heading("What's your name?"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "firstNameField",
            type: "TextField",
            displayText: "First Name",
            validation: {
              regex: "^.+$",
              error: "Enter your first name"
            }
          } as any) as TextField,
          ({
            name: "lastNameField",
            type: "TextField",
            displayText: "Last Name",
            validation: {
              regex: "^.+$",
              error: "Enter your last name"
            }
          } as any) as TextField,

          new SubmitButton("Save and Continue")
        ])
      ]
    },
    {
      id: "dateofbirth",
      hint: "We use this information to find out if you're eligible for a senior or junior concession.",
      nextPage: () => "addressLookup",
      preRequisiteData: ["firstNameField", "lastNameField"],
      elements: [
        new Heading("What's your date of birth?"),
        new Paragraph("We use this information to find out if you're eligible for a senior or junior concession."),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "dateOfBirthField",
            type: "DatePickerField",
            displayText: "Date of Birth",
            validation: {
              regex: "^[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}$",
              error: "Enter your date of birth"
            }
          } as any) as DatePickerField,
          new SubmitButton("Save and Continue")
        ])
      ]
    },
    {
      id: "addressLookup",
      nextPage: () => "chooseAddress",
      preRequisiteData: ["dateOfBirthField-day", "dateOfBirthField-month", "dateOfBirthField-year"],
      elements: [
        new Heading("What's your home address?"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "homePostcodeField",
            type: "TextField",
            displayText: "Postcode",
            validation: {
              regex: "^.+$",
              error: "Choose an address"
            }
          } as any) as TextField,
          new SubmitButton("Save and Continue")
        ])
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
            return data.addresses.map((str: any) => str.replace(" ,", "")).splice(0, 5);
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
      hint: "Choose your address from the list",
      nextPage: () => "startType",
      preRequisiteData: ["addressList"],
      elements: [
        new Heading("What's your home address?"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "addressField",
            type: "SelectListField",
            options: "addressList",
            displayText: "Home Address",
            validation: {
              regex: "^(?!select one address).*",
              error: "Please choose an address"
            }
          } as any) as SelectListField,
          new SubmitButton("Save and Continue")
        ])
      ]
    },
    {
      id: "startType",
      nextPage(context: any) {
        if ("30 minutes after payment" === context.data.startTypeField) {
          return "type";
        } else {
          return "startDate";
        }
      },
      preRequisiteData: ["addressField"],
      elements: [
        new Heading("When would you like your licence to start?"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "startTypeField",
            displayText: "Start type",
            type: "RadioField",
            options: ["30 minutes after payment", "Another time or date"],
            validation: {
              regex: ".+",
              error: "Choose the start type"
            }
          } as any) as RadioField,
          new SubmitButton("Save and Continue")
        ])
      ]
    },
    {
      id: "startDate",
      nextPage: () => "type",
      preRequisiteData: ["startTypeField"],
      elements: [
        new Heading("When would you like your licence to start?"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "startDateField",
            type: "DatePickerField",
            displayText: "Start date",
            validation: {
              regex: "^[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}$",
              error: "Enter the date to start your licence"
            }
          } as any) as DatePickerField,
          new SubmitButton("Save and Continue")
        ])
      ]
    },
    {
      id: "type",
      nextPage: () => "channel-selection",
      preRequisiteData: ["startTypeField"],
      elements: [
        new Heading("What type of fishing licence do you want?"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "typeField",
            displayText: "Licence type",
            type: "RadioField",
            options: ["Trout and coarse", "Salmon and sea trout"],
            validation: {
              regex: ".+",
              error: "Choose the type"
            }
          } as any) as RadioField,
          new SubmitButton("Save and Continue")
        ])
      ]
    },
    {
      id: "channel-selection",
      preRequisiteData: ["startTypeField"],
      nextPage(context: any) {
        if (context.data.channelField === "Email") {
          return "email";
        } else {
          return "phone-number";
        }
      },
      elements: [
        new Heading("How can we send you your licence details?"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "channelField",
            displayText: "Start type",
            type: "RadioField",
            options: ["Email", "Text to my mobile phone"],
            validation: {
              regex: ".+",
              error: "Choose which channel you want"
            }
          } as any) as RadioField,
          new SubmitButton("Save and Continue")
        ])
      ]
    },
    {
      id: "email",
      preRequisiteData: ["channelField"],
      nextPage: () => "confirmation",
      elements: [
        new Heading("What is your email address?"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "emailField",
            type: "TextField",
            displayText: "Email",
            validation: {
              regex: "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$",
              error: "Enter your email address"
            }
          } as any) as TextField,
          new SubmitButton("Save and Continue")
        ])
      ]
    },
    {
      id: "phone-number",
      preRequisiteData: ["channelField"],
      nextPage: () => "confirmation",
      elements: [
        new Heading("What is your mobile number?"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "telephoneField",
            type: "TextField",
            displayText: "Mobile phone number",
            validation: {
              regex: "^d{5} ?d{3} ?d{3}$",
              error: "Enter your mobile number"
            }
          } as any) as TextField,
          new SubmitButton("Save and Continue")
        ])
      ]
    },
    {
      id: "summary",
      preRequisiteData: ["channelField", "contactField"],
      nextPage: () => null,
      elements: [
        new Form([
          new Heading("Check your new licence details"),
          new Summary("Personal details", ["firstNameField", "lastNameField", "channelField", "contactField", "dateOfBirthField", "addressField"]),
          new Summary("Licence details", ["typeField", "durationField", "startDateField"]),
          new SubmitButton("Finish")
        ])
      ]
    }
  ]
};

export default service;
