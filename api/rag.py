from langchain_astradb import AstraDBVectorStore
from astrapy.db import AstraDB as astra
from langchain.retrievers.multi_query import MultiQueryRetriever
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from azure_utils import secret_client,get_blob_data
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor
from langchain.chains import RetrievalQA
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from langchain_together import Together
import joblib

def remove_pdf_extension(file_name):
    if file_name.endswith(".pdf"):
        return file_name[:-4]  # Removing the last 4 characters which are ".pdf"
    else:
        return file_name  # If the file name doesn't end with ".pdf", return as it is


# def load_or_download_model(model_name, cache_file):
#     try:
#         embeddings = joblib.load(cache_file)
#         print("Model loaded from cache.")
#     except FileNotFoundError:
#         embeddings = FastEmbedEmbeddings(model_name=model_name)
#         joblib.dump(embeddings, cache_file)
#         print("Model downloaded and cached.")

#     return embeddings

# # Define your model name and cache file path
# model_name = "BAAI/bge-small-en-v1.5"
# cache_file = "cached_model.joblib"


# Load or download the model
# embeddings = load_or_download_model(model_name, cache_file)
embeddings = FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")
vectorstore = None
astradbendpoint = secret_client.get_secret("astradbendpoint")
astradbtoken = secret_client.get_secret("astratoken")
togetherapikey = secret_client.get_secret("togetherapikey")
db = astra(token= astradbtoken.value ,api_endpoint= astradbendpoint.value)

def embed_blob(blob_name):
    collections_response = db.get_collections()
    for collection in collections_response["status"]["collections"]:
       target = remove_pdf_extension(blob_name)
       if collection == target:
           return 
    
    new_collection = db.create_collection(
        remove_pdf_extension(blob_name),
        dimension=384,
    )

    vectorstore = AstraDBVectorStore(
        embedding=embeddings,
        collection_name=remove_pdf_extension(blob_name),
        api_endpoint= secret_client.get_secret('astradbendpoint').value,
        token=secret_client.get_secret('astratoken').value,
    )
    print("collection created")

    try:
        chunks = get_blob_data(blob_name)
        print("chunks created")
        vectorstore.add_documents(chunks)
        return True
    except Exception as e:
        print(f"Error loading and indexing repository: {e}") 
        return False
    
B_INST, E_INST = "[INST]", "[/INST]"
B_SYS, E_SYS = "<<SYS>>\n", "\n<</SYS>>\n\n"

def get_prompt(instruction, new_system_prompt ):
    SYSTEM_PROMPT = B_SYS + new_system_prompt + E_SYS
    prompt_template =  B_INST + SYSTEM_PROMPT + instruction + E_INST
    return prompt_template

sys_prompt = """You are a helpful, smart and intelligent assistant. Always answer as helpfully as possible. You can take the help of context provided however if the question and context don't seem to match do not use the context, if the user is asking for previous message or context,
If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information. """

instruction = """
CONTEXT:/n/n {context}/n

Question: {question}"""


prompt_template = get_prompt(instruction, sys_prompt)
llama_prompt = PromptTemplate(
    template=prompt_template, input_variables=["context", "question"]
)
llama2_llm = Together(
    model="togethercomputer/llama-2-70b-chat",
    temperature=0.7,
    max_tokens=1024,
    together_api_key=togetherapikey.value
)
llm = Together(
    model="mistralai/Mixtral-8x7B-Instruct-v0.1",
    temperature=0,
    max_tokens=1024,
    together_api_key= togetherapikey.value,
)
compressor = LLMChainExtractor.from_llm(llm)

def process_llm_response(llm_response):
  response = " "
#   response += llm_response['result'] + "\n\nSources\n"
#   for source in llm_response['source_documents']:
#      response +="Source - "+source.metadata['source'] +"\n"

  return llm_response['result']

def answer_query(blob_name,query,retriever_type):
    vectorstore = AstraDBVectorStore(
    embedding=embeddings,
    collection_name=remove_pdf_extension(blob_name),
    api_endpoint= astradbendpoint.value,
    token=astradbtoken.value,
    )
    qa_chain = None
    retriever = vectorstore.as_retriever(search_type='mmr')
    retriever_to_be_used = None
    if(retriever_type=="multiretriever"):
        multi_retriever = MultiQueryRetriever.from_llm(
           retriever=retriever, llm=llm
        )
        retriever_to_be_used = multi_retriever

    elif(retriever_type=="compressionretriever"):
        compression_retriever = ContextualCompressionRetriever(
            base_compressor=compressor, base_retriever=retriever
       )
        retriever_to_be_used = compression_retriever

    else :
       retriever_to_be_used = retriever

    qa_chain = RetrievalQA.from_chain_type(
        llm= llama2_llm, 
        verbose=True,
        chain_type="stuff",
        retriever= retriever_to_be_used,
        chain_type_kwargs = {"prompt": llama_prompt}
    )
    print("retriever used :",retriever_to_be_used)
    return process_llm_response(qa_chain(query))


