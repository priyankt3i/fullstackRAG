from azure.identity import ClientSecretCredential
from azure.keyvault.secrets import SecretClient
from azure.storage.blob import BlobServiceClient
from dotenv import load_dotenv
from fastapi import HTTPException
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
import os

load_dotenv()

client_id = os.environ['AZURE_CLIENT_ID']
tenant_id = os.environ['AZURE_TENANT_ID']
client_secret = os.environ['AZURE_CLIENT_SECRET']
vault_url = os.environ["AZURE_VAULT_URL"]
account_url = os.environ["AZURE_STORAGE_URL"]

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size = 1000,
    chunk_overlap  = 20,
)
# create a credential 
credentials = ClientSecretCredential(
    client_id = client_id, 
    client_secret= client_secret,
    tenant_id= tenant_id
)

# create a secret client object
secret_client = SecretClient(vault_url= vault_url, credential= credentials)
container_name = 'fullstackrag1'
blob_service_client = BlobServiceClient(account_url= account_url, credential= credentials)
container_client = blob_service_client.get_container_client(container=container_name)


def get_blob_data(blob_name):
    # download blob data 
    blob_client = container_client.get_blob_client(blob= blob_name)
    # Download the blob
    with open(f"{blob_name}.pdf", "wb") as my_blob:
        downloader = blob_client.download_blob(max_concurrency=1)
        downloader.readinto(my_blob)
 
    loader = PyPDFLoader(f"{blob_name}.pdf")
    documents=loader.load()
    texts = text_splitter.split_documents(documents)
    os.remove(f"{blob_name}.pdf")
    return texts

def does_blob_exists(new_blob):
    # set client to access azure storage container
    blob_service_client = BlobServiceClient(account_url= account_url, credential= credentials)

    # get the container client 
    container_client = blob_service_client.get_container_client(container=container_name)

    for blob in container_client.list_blobs():
        if blob.name == new_blob:
            return True
    return False

async def upload_to_azure_storage(file):
    try:
        # Upload file to Azure Blob Storage
        blob_client = container_client.upload_blob(name=file.filename, data=file.file)
        return blob_client.url
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file to Azure Blob Storage: {str(e)}")

# Use the extract_text_from_pdf function to extract text from the PDF binary data
# text = extract_text_from_pdf()
# print(text)