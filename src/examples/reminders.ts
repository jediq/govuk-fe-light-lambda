import FrameworkService from "../types/framework";
import Heading from "../framework/elements/Heading";
import Form from "../framework/elements/Form";
import TextField from "../framework/elements/TextField";
import SubmitButton from "../framework/elements/SubmitButton";
import RadioField from "../framework/elements/RadioField";
import ErrorList from "../framework/elements/ErrorList";
import Summary from "../framework/elements/Summary";
import Paragraph from "../framework/elements/Paragraph";
import Details from "../framework/elements/Details";

const service: FrameworkService = {
  name: "Get an annual MOT reminder",
  slug: "reminders",
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
      nextPage: () => "channel-selection",
      preRequisiteData: [],
      elements: [
        new Heading("What is the vehicle’s registration number?"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "vrnField",
            type: "TextField",
            displayText: "Registration number (number plate)",
            shortText: "Number Plate",
            hint: "For example, CU57ABC",
            validation: {
              regex: "[A-Za-z0-9]{5,7}",
              error: "Enter the vehicle’s registration"
            }
          } as any) as TextField,
          new SubmitButton("Save and Continue")
        ])
      ],
      preValidation: [
        {
          id: "vehicleData",
          url:
            "https://uk1.ukvehicledata.co.uk/api/datapackage/MotHistoryAndTaxStatusData?v=2&api_nullitems=1&auth_apikey=21f37715-3198-474c-9fb2-ed1cdfc47604&key_VRM={{context.data.vrnField}}",

          debugUrl: "http://jediq.com/ZZ99ABC.json",
          headers: {
            accept: "application/json"
          },
          postProcess(data: any) {
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            data = data[0];
            data.yomDate = "" + new Date(data.manufactureDate).getFullYear();
            var dates: Date[] = data.motTests
              .filter((test: any) => test.testResult == "PASSED")
              .map((test: any) => new Date(test.expiryDate))
              .sort();

            data.motDate = dates[0].getDate() + " " + months[dates[0].getMonth()] + " " + dates[0].getFullYear();
            return data;
          }
        }
      ],
      validation: {
        validator: (context: any) => {
          return context.data.vehicleData && context.data.vehicleData.registration;
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
      elements: [
        new Heading("What type of reminder do you want to get?"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "channelField",
            displayText: "Contact channel",
            type: "RadioField",
            hint: "Reminder type",
            validation: {
              regex: ".+",
              error: "Choose one reminder you want"
            },
            options: [{ value: "Email", text: "Email" }, { value: "Text to my mobile phone", text: "Text to my mobile phone" }]
          } as any) as RadioField,
          new SubmitButton("Save and Continue")
        ])
      ]
    },
    {
      id: "email",
      description: "What is your email address?",
      preRequisiteData: ["vrnField", "channelField"],
      nextPage: () => "tax-reminder",
      elements: [
        new Heading("What is your email address?"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "emailField",
            displayText: "Email address",
            type: "TextField",
            hint: "Your reminder will be sent here",
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
      description: "What is your mobile number?",
      preRequisiteData: ["vrnField", "channelField"],
      nextPage: () => "tax-reminder",
      elements: [
        new Heading("What is your mobile phone number?"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "phoneField",
            displayText: "Telephone number",
            type: "TextField",
            hint: "Your reminder will be sent here",
            validation: {
              regex: "[ 0-9]{5,17}",
              error: "Enter your mobile number"
            }
          } as any) as TextField,
          new SubmitButton("Save and Continue")
        ])
      ]
    },
    {
      id: "tax-reminder",
      description: "Do you also want a reminder about the vehicle tax?",
      preRequisiteData: ["vrnField"],
      nextPage: () => "summary",
      elements: [
        new Heading("Do you also want a reminder about the vehicle tax?"),
        new ErrorList("There is a problem"),
        new Form([
          ({
            name: "taxField",
            type: "RadioField",
            displayText: "Tax reminder",
            hint: "Tax reminder",
            validation: {
              regex: ".+",
              error: "Choose if you'd like a tax reminder"
            },
            options: [{ value: "Yes", text: "Yes" }, { value: "No", text: "No" }]
          } as any) as RadioField,
          new SubmitButton("Save and Continue")
        ])
      ]
    },
    {
      id: "summary",
      preRequisiteData: ["vrnField", "channelField"],
      nextPage: () => null,
      elements: [
        new Form([
          new Heading("Check your details"),
          new Paragraph("Make sure the vehicle and your email address are correct."),
          ({
            type: "Summary",
            title: "Vehicle details",
            fieldNames: ["vrnField"],
            ancillaryItems: [
              { displayText: "Make", location: "data.vehicleData.make" },
              { displayText: "Model", location: "data.vehicleData.model" },
              { displayText: "Colour", location: "data.vehicleData.primaryColour" },
              { displayText: "Year of manufacture", location: "data.vehicleData.yomDate" },
              { displayText: "MOT due date", location: "data.vehicleData.motDate" }
            ]
          } as any) as Summary,
          new Details("Incorrect vehicle details?", "If you think any of the vehicle details are wrong, contact DVSA"),
          new Summary("Your details", ["channelField", "emailField", "phoneField", "taxField"]),
          new SubmitButton("Finish")
        ])
      ]
    }
  ],

  confirmation: {
    description: "Make sure the vehicle and your contact details are correct.",
    preRequisiteData: ["vrnField", "channelField"],
    groups: [
      {
        title: "Personal details",
        items: ["channelField", "emailField", "phoneField", "taxField"],
        ancillary: []
      },
      {
        title: "Vehicle details",
        items: ["vrnField"],
        ancillary: [
          {
            label: "Make",
            location: "data.vehicleData.make"
          },
          {
            label: "Model",
            location: "data.vehicleData.model"
          },
          {
            label: "Colour",
            location: "data.vehicleData.primaryColour"
          },
          {
            label: "Year of manufacture",
            location: "data.vehicleData.yomDate"
          },
          {
            label: "MOT due date",
            location: "data.vehicleData.motDate"
          }
        ]
      }
    ]
  }
};

export default service;
