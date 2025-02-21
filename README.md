# Credit Card Rewards

## Overview

The Credit Card Rewards is a comprehensive tool designed to help users optimize their credit card rewards across multiple banks and credit cards in India. This project aims to simplify the process of comparing rewards based on specific Merchant Category Codes (MCCs) and finding the best card for various spending patterns.

## Features

- Multi-bank support: Calculate rewards for cards from AMEX, Axis, AU, BOB, Canara, DBS, Federal, HDFC, HSBC, ICICI, IDFC First, IndusInd, Kotak, OneCard, RBL, SBI, SC, Yes.
- MCC-based calculations: Accurately calculate rewards based on specific Merchant Category Codes.
- User-friendly interface: Easy-to-use calculator with intuitive design.
- Dark mode support: Toggle between light and dark themes for comfortable viewing.
- Responsive design: Works seamlessly across desktop and mobile devices.
- Real-time calculations: Instantly see reward points or cashback for your transactions.
- International spend option: Calculate rewards for both local and international transactions.

## Mobile Apps

CCReward is available on both iOS and Android platforms:

[![Download on the App Store](https://img.shields.io/badge/App_Store-0D96F6?logo=app-store&logoColor=white)](https://apps.apple.com/in/app/ccreward/id6736835206)

[![Get it on Google Play](https://img.shields.io/badge/Google_Play-414141?logo=google-play&logoColor=white)](https://play.google.com/store/apps/details?id=app.ccreward)

## How to Use

1. Select your bank from the dropdown menu.
2. Choose your specific credit card.
3. (Optional) Select the Merchant Category Code (MCC) for your transaction.
4. Enter the spent amount in INR.
5. If applicable, choose between local or international spend.
6. Click "Calculate Rewards" to see your earnings.

## Technology Stack

- React.js
- Material-UI (MUI)
- Next.js (inferred from the use of 'use client')
- Firebase (for authentication and data storage)

## Installation and Setup

```bash
# Clone the repository
git clone https://github.com/aashishvanand/ccreward-web.git

# Navigate to the project directory
cd ccreward-web

# Install dependencies
npm install

# Run the development server
npm run dev
```

## Firebase Setup

To run this project locally, you need to set up a Firebase project and configure it properly. Follow these steps:

1. Go to the Firebase Console.
2. Click on "Add project" and follow the setup wizard to create a new project.
3. Once your project is created, click on the web icon (</>) to add a web app to your project.
4. Register your app with a nickname (e.g., "credit-card-rewards-calculator").
5. Copy the Firebase configuration object.

### Important Firebase Configuration Steps:

#### Enable Authentication:
1. In the Firebase Console, go to "Authentication" > "Sign-in method"
2. Enable the following authentication methods:
   - Google Sign-in
   - Anonymous Authentication
3. Configure the OAuth consent screen if required

#### Enable Firestore Database:
1. Go to "Firestore Database" in the Firebase Console
2. Click "Create Database"
3. Choose your preferred location and start in production mode

#### Environment Variables Setup:
1. In your project root, create a file named `.env.local`
2. Add the following environment variables, replacing the xxx with your actual Firebase configuration values:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=xxx
```

3. Save the `.env.local` file and ensure it's added to your `.gitignore`

#### Troubleshooting:
- If you encounter authentication errors, ensure both Google Sign-in and Anonymous Authentication are enabled
- For database access issues, verify that Firestore is enabled and the security rules are properly configured
- Check that all environment variables are correctly set in your `.env.local` file

## Contributing

We welcome contributions to improve the Credit Card Rewards India Calculator! If you notice a missing bank or card, you can use the "Bank or Card Missing?" feature within the app to submit new information.

For more substantial contributions:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is available under a dual license - open source for non-commercial use and a commercial license for business use. See the [LICENSE](LICENSE) file for details.

Open Source License (for non-commercial use)
The project is freely available for non-commercial use under the terms specified in the LICENSE file. This allows for personal use, educational purposes, and open source projects.

Commercial License
For any commercial use of this project, including but not limited to using it as part of a business process or incorporating it into a commercial product or service, a separate commercial license is required. The fee for the commercial license varies based on the size of the company. Please contact the author for more information on commercial licensing.

## Attribution Requirements

Regardless of whether you are using the project under the open source or commercial license, if you use, modify, or distribute this project, please provide attribution by including the following:

1. The name of the project: ccreward.app
2. The project's GitHub repository URL: https://github.com/aashishvanand/ccreward-web
3. The name of the original author: Aashish Vivekanand

Example attribution:

```
This project is based on the Credit Card Rewards (https://github.com/aashishvanand/ccreward-web) by Aashish Vivekanand.
```

---

Visit the live calculator: [ccreward.app](https://ccreward.app)

Optimize your rewards and make the most of your credit card benefits with our comprehensive Credit Card Rewards Calculator!
