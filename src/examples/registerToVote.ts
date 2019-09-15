import FrameworkService from "../types/framework";
import {
  TextField,
  SubmitButton,
  Form,
  Heading,
  SubHeading,
  RadioField,
  SelectListField,
  Paragraph,
  ErrorList,
  DatePickerField,
  Summary
} from "../framework/elements/Elements";

const service: FrameworkService = {
  name: "Register to vote",
  slug: "register-to-vote",
  targetUrl: "https://someurl.gov.uk",
  gdsPhase: "alpha",
  firstPage: "location",
  successMessage: "Your details where saved correctly",
  failureMessage: "Your details failed to be saved",
  cookieSecret: "8y/BBC(G+KbPeShVmYq3t6w9z$C&F)H@",
  pages: [
    {
      id: "location",
      nextPage: () => "nationality",
      preRequisiteData: [],
      elements: [
        new Heading("Where do you live?"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "locationField",
            displayText: "Location",
            type: "RadioField",
            options: [
              "England",
              "Scotland",
              "Wales",
              "Northern Ireland",
              "British citizen or eligible Irish citizen living in another country (including the Channel Islands or Isle of Man)"
            ],
            validation: {
              regex: ".+",
              error: "Choose your location"
            }
          } as any) as RadioField,
          new SubmitButton("Save and Continue")
        ])
      ]
    },
    {
      id: "nationality",
      nextPage: () => "dateOfBirth",
      preRequisiteData: ["locationField"],
      elements: [
        new Heading("What is your nationality?"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "nationalityField",
            displayText: "Nationality",
            type: "RadioField",
            options: [
              "British (including English, Scottish, Welsh or from Northern Ireland)",
              "Irish (including from Northern Ireland)",
              "Citizen of a different country"
            ],
            validation: {
              regex: ".+",
              error: "Choose your nationality"
            }
          } as any) as RadioField,
          new SubmitButton("Save and Continue")
        ])
      ]
    },
    {
      id: "dateOfBirth",
      nextPage: () => "name",
      preRequisiteData: ["locationField"],
      elements: [
        new Heading("What is your date of birth?"),
        new Paragraph("For example, 31 12 1970"),
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
      id: "name",
      nextPage: () => "nationalInsurance",
      preRequisiteData: [], //["dateOfBirth"], // TODO : Need to post-process date fields properly
      elements: [
        new Heading("What is your full name?"),
        new Paragraph("Enter all your names in full - don't use initials"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "firstNameField",
            type: "TextField",
            displayText: "First name",
            validation: {
              regex: "^.+$",
              error: "Enter your first name"
            }
          } as any) as TextField,
          ({
            name: "middleNamesField",
            type: "TextField",
            displayText: "Middle names",
            validation: {
              regex: "^.+$",
              error: "Enter your middle names"
            }
          } as any) as TextField,
          ({
            name: "lastNameField",
            type: "TextField",
            displayText: "Last name",
            validation: {
              regex: "^.+$",
              error: "Enter your last name"
            }
          } as any) as TextField,
          new Paragraph("Have you ever changed your name?"),
          ({
            name: "changedNameField",
            type: "RadioField",
            displayText: "Changed name?",
            options: ["No, I haven’t changed my name", "Yes, I changed my name", "Prefer not to say"],
            validation: {
              regex: ".+",
              error: "Select one option"
            }
          } as any) as RadioField,
          new SubmitButton("Save and Continue")
        ])
      ]
    },
    {
      id: "nationalInsurance",
      preRequisiteData: ["channelField"],
      nextPage: () => "addressLookup",
      elements: [
        new Heading("What is your National Insurance number?"),
        new Paragraph("Example: QQ 12 34 56 C"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "nationalInsurance",
            type: "TextField",
            displayText: "NI Number",
            validation: {
              regex: "^.+$",
              error: "Enter your National Insurance number"
            }
          } as any) as TextField,
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
      nextPage: () => "secondAddressQuestion",
      preRequisiteData: ["addressList"],
      elements: [
        new Heading("What's your home address?"),
        new Paragraph("Choose your address from the list"),
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
      id: "secondAddressQuestion",
      nextPage: () => "openRegisterQuestion",
      preRequisiteData: ["addressField"],
      elements: [
        new Heading("Do you also live at a second address?"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "secondAddressField",
            displayText: "Second address",
            type: "RadioField",
            options: ["No", "Yes, I spend time living at two homes", "Yes, I’m a student with home and term-time addresses"],
            validation: {
              regex: ".+",
              error: "Choose a second address option"
            }
          } as any) as RadioField,
          new SubmitButton("Save and Continue")
        ])
      ]
    },

    {
      id: "openRegisterQuestion",
      nextPage: () => "postalVoteQuestion",
      preRequisiteData: ["secondAddressQuestionField"],
      elements: [
        new Heading("Do you want to include your name and address on the open register?"),
        new ErrorList("There is a problem"),
        new Paragraph(
          "The open register is an extract of the electoral register, but is not used for elections. It can be bought by any person, company or organisation. For example, it is used by businesses and charities to confirm name and address details.  Your decision won’t affect your right to vote."
        ),
        new Form([
          ({
            name: "openRegisterField",
            displayText: "Open register",
            type: "RadioField",
            options: ["No", "Yes, I spend time living at two homes", "Yes, I’m a student with home and term-time addresses"],
            validation: {
              regex: ".+",
              error: "Choose an open register option"
            }
          } as any) as RadioField,
          new SubmitButton("Save and Continue")
        ])
      ]
    },
    {
      id: "postalVoteQuestion",
      nextPage: () => "otherVoters",
      preRequisiteData: ["secondAddressQuestionField"],
      elements: [
        new Heading("Do you want to apply for a postal vote?"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "postalVoteField",
            displayText: "Postal vote",
            type: "RadioField",
            options: [
              "No, I prefer to vote in person",
              "No, I already have a postal vote",
              "Yes, email me a postal vote application form",
              "Yes, post me a postal vote application form"
            ],
            validation: {
              regex: ".+",
              error: "Choose a postal vote option"
            }
          } as any) as RadioField,
          new SubmitButton("Save and Continue")
        ])
      ]
    },
    {
      id: "otherVoters",
      nextPage: () => "channel-selection",
      preRequisiteData: ["secondAddressQuestionField"],
      elements: [
        new Heading("Is there anyone else aged 16 or over living at your current address?"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "otherVotersField",
            displayText: "Other voters",
            type: "RadioField",
            options: ["Yes", "No", "Not sure", "Prefer not to say"],
            validation: {
              regex: ".+",
              error: "Choose an option"
            }
          } as any) as RadioField,
          new SubmitButton("Save and Continue")
        ])
      ]
    },
    {
      id: "channel-selection",
      preRequisiteData: [],
      nextPage(context: any) {
        if (context.data.channelField === "Email") {
          return "email";
        } else {
          return "phone-number";
        }
      },
      elements: [
        new Heading("If we have questions about your application, how should we contact you?"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "channelField",
            displayText: "Contact channel",
            type: "RadioField",
            options: ["Email", "Text to my mobile phone", "Post"],
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
      nextPage: () => "summary",
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
      nextPage: () => "summary",
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
      preRequisiteData: ["channelField"],
      nextPage: () => null,
      elements: [
        new Form([
          new Heading("Check your new licence details"),
          new Summary("Personal details", [
            "firstNameField",
            "middleNamesField",
            "lastNameField",
            "changedNameField",
            "dateOfBirthField",
            "nationalityField",
            "nationalInsurance",
            "addressField",
            "secondAddressField",
            "openRegisterField",
            "postalVoteField",
            "otherVotersField",
            "channelField",
            "contactField",
            "dateOfBirthField"
          ]),
          new SubHeading("Send your application"),
          new Paragraph("By sending your application you confirm that the information you have provided is true."),
          new Paragraph(
            "Your information may be shared with other government departments to check your identity and that you’re entitled to register to vote."
          ),
          new SubmitButton("Finish")
        ])
      ]
    }
  ]
};

export default service;
