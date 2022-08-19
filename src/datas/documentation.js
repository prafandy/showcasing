/**
 * @type {Item[]}
 */
let items = [
  {
    title: "Showcasing App",
    descriptions: [
      "This app contains the most common production features, built with vue."
    ],
    items: [
      {
        title: "Auth page",
        descriptions: [
        ],
        items: [
          {
            title: "Register",
            descriptions: [
              "Registering new account can be auto joined, or can also need some kind of account activation.",
              "This app just registers new user with auto joined.",
            ],
          },
          {
            title: "Activate",
            descriptions: [
              "After register, usually an account needs to be activated via link sent to email. This app doesn't implement this yet.",
            ],
          },
          {
            title: "Login",
            descriptions: [
              "Can use username/email/phone/both. This app uses email.",
              "Use JWT Authentication. This app save the token on local storage.",
            ],
          },
          {
            title: "Forget password & reset password by user",
            descriptions: [
              "If users forget their password, they can request password recovery using forget password page.",
              "Later, they will get a link sent to their email, it's a page to reset their password.",
              "This app doesn't implement this yet.",
            ],
          },
          {
            title: "Reset password by admin & create new password by user",
            descriptions: [
              "This app doesn't implement this yet.",
            ],
          },
          {
            title: "Change password",
            descriptions: [
              "This app doesn't implement this yet.",
            ],
          },
          {
            title: "Logout",
            descriptions: [
              "Delete auth token stored on local storage.",
            ],
          },
        ],
      },
      {
        title: "List page",
        descriptions: [
        ],
        items: [
          {
            title: "When the data is requested",
            descriptions: [
              "One time request: it means all the data are fetched once at the beginning. This app implement this.",
              "On demand request: it means only current viewed data is requested, if users want to see another data (eg: go to another page), the app will re-request the data again.",
              "Infinite scroll: it means only when users scroll the page down, the app will request another data. Unlike on demand request, going back to previous data doesn't repeat the request.",
            ],
          },
          {
            title: "Paginated data",
            descriptions: [
              "Change per page: An ability to set how many data are shown in one single page.",
              "Change page: An ability to go to another page to see another bunch of data.",
            ],
          },
          {
            title: "Sorting",
            descriptions: [
              "Sort the data based on particular column, ascending or descending.",
            ],
          },
          {
            title: "Filtering",
            descriptions: [
              "Filter the data by custom function:",
              "• search by text, range filter by text",
              "• single select by dropdown / radio / toggle",
              "• multi select by checkbox",
            ],
          },
          {
            title: "Changing the url",
            descriptions: [
              "When user go to specific page, sort the data or filter the data, it'll also change the url's address.",
              "This app doesn't implement this yet.",
            ],
          },
          {
            title: "Action to one data / row",
            descriptions: [
              "go to another page. This app doesn't implement this yet.",
              "pop the modal up. This app doesn't implement this yet.",
              "call api: with confirmation pop up and redraw the data. This app doesn't implement this yet.",
            ],
          },
          {
            title: "Action to multiple data / rows",
            descriptions: [
              "Bulk action by checkbox (ex: for delete). This app doesn't implement this yet.",
            ],
          },
          {
            title: "Exporting the data",
            descriptions: [
              "Data can be exported to excel, pdf, clipboard, etc. This app doesn't implement this yet."
            ],
          },
        ],
      },
      {
        title: "Form page",
        descriptions: [
        ],
        items: [
          {
            title: "Input types",
            descriptions: [
              "• text, textarea",
              "• 1 to many & enum (dropdown, radio, dropdown by search). This app doesn't implement this yet.",
              "• many to many & set (checkbox, dropdown multiple). This app doesn't implement this yet.",
              "• upload file & picture with preview. This app doesn't implement this yet.",
              "• time, date & datetime. This app doesn't implement this yet.",
              "• masked input (phone, currency). This app doesn't implement this yet.",
              "• WYSIWYG. This app doesn't implement this yet.",
            ],
          },
          {
            title: "Validating form data",
            descriptions: [
              "There are behavior options you can choose to validate form data:",
              "• real-time validation: it means if user doesn't finish typing / inputting the data, they will see an error message right away.",
              "• on-blur validation: it means the inputted data will only be validated when user out of focus from the input. It means if the data is incorrectly validated, they need to go back to the input to fix it.",
              "• on-before submit validation: it means they need to go back to fix the data one by one if the inputted data are incorrectly validated.",
              "• server-side validation: it means user needs to wait for api request to finish, to just know what errors do the data have.",
              "But this app doesn't implement any kind of those validations. Rather it implements combinations of these:",
              "• .",
              "• .",
              "• .",
            ],
          },
          {
            title: "Loading state when submit",
            descriptions: [
              "Show an indicator when submitting the data.",
              "It can prevent user to double click submit button."
            ],
          },
          {
            title: "Dynamic input",
            descriptions: [
              "This app doesn't implement this yet.",
            ],
          },
        ],
      },
      {
        title: "Routing",
        descriptions: [
          "Router in this app is localized. Here's some rules that are implemented:",
          "• visiting / will be redirect to default app's locale which in this case is /en. The other option is to redirect user to their locale preference that's usually saved on database.",
          "• visiting /unknown will be redirected to not found page",
          "• visiting /lang/path will be redirected to a page with correct translation",
          "We also provide localized url, so you just have to write /path instead of /language/path",
          "• method url('/path') to get path without defining language",
          "• method url('/path', language) to get path with language defined",
          "• method url(null, language) to get current path with new language",
        ],
      },
      {
        title: "Language localisation",
        descriptions: [
          "",
        ],
      },
      {
        title: "Auth",
        descriptions: [
          "",
        ],
      },
      {
        title: "Accessing api",
        descriptions: [
          "",
        ],
      },
      {
        title: "Skeleton",
        descriptions: [
          "",
        ],
      },
      {
        title: "Error handling",
        descriptions: [
          "network_error, server_timeout, unexpected_error",
        ],
      },
      {
        title: "Testing",
        descriptions: [
          "e2e, unit",
        ],
      },
      {
        title: "Continuous integration",
      },
      {
        title: "Modal, alert & confirmation popup",
      },
      {
        title: "Relative view",
        descriptions: [
          "Triggers: show on click, show on hover, show on page load",
          "Eg: dropdown & tooltip",
        ],
      },
      {
        title: "Log error & send it to developer email",
      },
      {
        title: "Upload & view file with auth",
      },
      {
        title: "Send email",
      },
      {
        title: "Chart",
      },
      {
        title: "Accessing storage",
        descriptions: [
          "",
        ],
      },
      {
        title: "Generating pdf",
      },
      {
        title: "Switching environment: dev, uat or prod",
      },
      {
        title: "Linting, minifying & size checking",
      },
    ],
  },
];

export function getItems() {
  return items;
}

/**
 * @param {string} title
 * @returns {Item}
 */
export function getItem(title) {
  return items.find(item => item.title === title);
}

/**
 * @param {string} title
 * @returns {void}
 */
export function deleteItem(title) {
  items = items.filter(item => item.title !== title);
}

/**
 * @typedef {{ title: string; descriptions: Array; items: Array }} Item
 */
