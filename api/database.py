import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base
from dotenv import dotenv_values
from sqlalchemy.exc import DatabaseError
def create_mysql_connection_string(user, password, host, database):
    port = 3306  # Change this if your MySQL server is running on a different port
    connection_string = f"mysql+mysqlconnector://{user}:{password}@{host}:{port}/{database}"
    return connection_string
from azure_utils import secret_client
config = dotenv_values(".env")
# Retrieve MySQL environment variables
mysql_user = secret_client.get_secret("mysqluser")
mysql_password = secret_client.get_secret('mysqlpassword')
mysql_host = secret_client.get_secret('host')
mysql_database = "fullstackRAG"

# Construct SQLAlchemy database URL
SQLALCHEMY_DATABASE_URL = create_mysql_connection_string(mysql_user.value, mysql_password.value, mysql_host.value, mysql_database)
ssl_args = {'ssl_ca': "DigiCertGlobalRootCA.crt.pem"}
engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
try:
  engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"ssl_ca": "DigiCertGlobalRootCA.crt.pem"}
)
except DatabaseError as e:
   print(e)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()