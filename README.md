
# APTScholar

**APTScholar** is a decentralized platform designed for transparent and automated scholarship distribution, leveraging the security and reliability of the Aptos blockchain. By eliminating intermediaries and embedding eligibility and disbursement logic directly into smart contracts, APTScholar offers an efficient, trustless, and verifiable system for managing scholarships at scale.

---

## Overview

APTScholar introduces a fully decentralized infrastructure for scholarship application, verification, and fund disbursement. Built using Move smart contracts on the Aptos blockchain, the platform ensures that each transaction—from application submission to final payment—is permanently recorded, auditable, and resistant to tampering.

---

## Key Features

- **Decentralized Application Workflow**  
  All application data is processed and validated through on-chain logic.

- **Automated Disbursement**  
  Funds are distributed automatically via smart contracts once eligibility conditions are met.

- **Transparent and Verifiable Records**  
  Every transaction is publicly accessible and cryptographically secured on the Aptos blockchain.

- **AI-Powered Assistance**  
  An integrated chatbot provides support throughout the application process, offering guidance, answering questions, and improving user experience.

- **Secure File Management**  
  Applicant documents are handled through decentralized storage, ensuring data integrity and availability.

---

## Architecture

### Blockchain Layer: Aptos

APTScholar utilizes the Aptos blockchain for the core logic and data integrity of the platform. Aptos offers a scalable, low-latency infrastructure suitable for smart contract-based systems.

- **Smart Contracts**  
  Written in Move, smart contracts enforce the rules for application handling, eligibility verification, and fund transfers.

- **Deployed Contract**  
  - **Address:** `0x47f9407af53e1e236bc95b74c34509e169ddb5309bed8202c07b294a36803d1f`  
  - **Explorer:** [Aptos Testnet - View Contract](https://explorer.aptoslabs.com/txn/6807947204?network=testnet)

### Frontend: React.js

The web interface is developed using React.js, providing:

- A responsive application portal for students
- Administrative tools for reviewing and managing applications
- Blockchain transaction feedback and interaction

### Backend: Node.js

Node.js services act as an intermediary for:

- Managing decentralized file access
- Preparing data for smart contract transactions
- Serving API endpoints for frontend interaction

### Chatbot: Langchain + Mistral

The platform includes a conversational assistant integrated with Langchain and powered by Mistral models. The chatbot assists users by:

- Explaining the application process
- Checking eligibility conditions
- Providing real-time feedback and suggestions

---

## Technology Stack

| Component         | Technology                     |
|------------------|---------------------------------|
| Smart Contracts   | Move (on Aptos)                |
| Blockchain Layer  | Aptos Blockchain               |
| Frontend Interface| React.js                       |
| Backend Services  | Node.js                        |
| Blockchain SDKs   | Aptos SDK, Web3.js             |
| Chatbot Engine    | Langchain + Mistral            |
| File Storage      | Decentralized (IPFS-compatible) |

---

## Installation

To run the project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/0PrashantYadav0/DeFi-Scholarship.git
   cd DeFi-Scholarship
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

---

## Usage

### For Applicants

* Fill out the application form through the web interface
* Upload supporting documents
* Interact with the chatbot for guidance
* Receive status updates as your application progresses
* Approved funds are automatically disbursed via the blockchain

### For Administrators

* Access the admin dashboard to view pending applications
* Review applicant documents and eligibility data
* Approve or reject based on preset criteria
* All approval actions are recorded and executed on-chain

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**APTScholar** — Secure, Transparent, and Automated Scholarship Distribution on the Aptos Blockchain.

```

