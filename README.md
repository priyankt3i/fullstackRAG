# fullstackRAG
This repository contains the backend API and frontend app for the Fullstack Internship Assignment. The backend API allows users to upload PDF documents, ask questions about the content of these documents, and receive answers based on Langchain . The frontend app provides a user interface for interacting with the backend API.

## Technologies Used

### Backend API

- FastAPI: Python framework for building APIs with fast performance.
- SQLAlchemy: SQL toolkit and Object-Relational Mapping (ORM) library for Python.
- Langchain: Implemented RAG using Langchain and Together.ai APIs
- Azure SDK: Python libraries for integrating with Azure services (Azure Key Vault, Azure Storage and Azure MySQL Database).

### Frontend App

- Next.js: JavaScript Framework for building user interfaces.
- Axios: Promise-based HTTP client for making API requests.
- shadcn/ui : Next.js component library for implementing Modern Design.

## Setup Instructions

### Prerequisites

- Docker installed on your system ([Install Docker](https://docs.docker.com/get-docker/))
- Node.js and npm installed on your system ([Install Node.js](https://nodejs.org/))

### Backend API Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/s0ham075/fullstackRAG.git
   ```

2. Navigate to the project directory:

   ```bash
   cd api
   ```

3. Create a `.env` file in the root directory with the following environment variables:

   ```
   AZURE_CLIENT_ID=<your-azure-client-id>
   AZURE_TENANT_ID=<your-azure-tenant-id>
   AZURE_CLIENT_SECRET=<your-azure-client-secret>
   AZURE_VAULT_URL=<your-azure-key-vault-url>
   AZURE_STORAGE_URL=<your-azure-storage-url>
   ```

4. Build the Docker image and start the container:

   ```bash
   docker-compose up 
   ```

### Frontend App Installation

1. Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Access the frontend app at `http://localhost:3000` in your web browser.

## API Documentation

The API documentation can be found [here](https://docs.google.com/document/d/1uuH_WItDlxqG9ku6HTSypjtL6CBOkKeNpsC5i5S68zI/edit?usp=sharing) (replace with your API documentation link).

