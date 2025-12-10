# CUasApp

This project was created using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.7.

## Setup

### Angular Installation

The first thing you must do to run this app locally is install Angular.

Follow the link to the instructions on how to install Angular:

[Angular Install](https://angular.dev/installation)

You only need to do the parts marked Prerequisites and Install Angular CLI

### Gemini API Configuration

This application uses Google Gemini AI for review summarization and generation. To set up the API:

1. Obtain a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Add your actual API key to the `.env` file:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
4. Generate the environment files:
   ```bash
   npm run generate-env
   ```

**Important:** Never commit the `.env` file to version control. The `.env.example` file serves as a template.

**Note:** The environment files are automatically generated before each build and serve command, so you only need to run `npm run generate-env` manually if you want to update them without starting the development server.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Application Navigation

Now let's get to how to use the various features on the site

### Login

Currently, the login page is only simulating security and not actually checking usernames and passwords. To login to the site there are 2 different options, one is with a username and password. For the username, you can put anything as long as it's in the format of a .mil email address, i.e. example@army.mil, example@navy.mil, etc. Then for the password you can put in anything. Then also if you want to login as an admin, just you the email, admin@army.mil, admin@navy.mil, etc. The other option is to just press the login with CAC card button, and this will take you to the main page.

### Main Page

On the main page, you will see many different C-UAS products on the screen here on this page, we have put a mix of real and fake C-UAS products. If you want to look at the ratings for a product, click the View Details button under that product. When you are in under an Admin, you will also see a button to add a product to the site.

### Product Page

On the product pages, you will first see a description of the product, the products average overall rating, and the products average broken down ratings. Then as you scroll down, you will see individual ratings, with comments if the reviewer left any. Additionally, right above the overall rating is a button to create an AI summary of the products reviews, this will generate a report that summarizes the common themes of the comments left and the ratings given to the product.

### Review Page

To navigate to the review page, just press the button at the bottom left of you screen that says Review Product. When you first open the page, you will see an option to select which product to review. After selecting the product, you will see that it asks you, how long you have worked with this product, and anyother C-UAS products that you have worked with. Then you can rate the product on 5 different categories, with the option to add additional details about each category, and also to select N/A if that category wasn't applicable to your experience. Then at the end, it gives you the option to give any Additional information, you may have. Then when you are finished just hit the Submit Review button.

### AI Assistant

There are two different ways to access the AI assistant. One is there is a button at the bottom right of the screen at all times, that will bring up a pop-up AI assistant on the screen. The other way is on the home screen, there is button at the top of the screen that will take you to a full page AI assistant. Either way, you can ask the AI assistant about any of the products available to review on the site.

### Admin Portal

To access the admin portal, there is button on the header in the top right hand corner of the screen on the header when logged in as an admin. On this page, it gives you the option to see some analytics about the site, view all of the products available to review, and to add a product to the site. 


**Disclaimer**

Everything from here down is only need if you are changing something on the site

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.