import os
from astrapy import DataAPIClient
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
import requests
from flask import request
from bs4 import BeautifulSoup
from astrapy.constants import VectorMetric
from langchain_astradb import AstraDBVectorStore
from langchain_openai import OpenAIEmbeddings
from langchain.schema import Document
from typing import Optional
import json
load_dotenv()

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

openai_api_key= os.getenv('OPEN_AI_API_KEY')
client = DataAPIClient(os.getenv('ASTRA_DB_APPLICATION_TOKEN'))
database = client.get_database(os.getenv('ASTRA_DB_API_ENDPOINT'))

# Initialize the collection
# coll = database.drop_collection("kundali_data")
embedding = OpenAIEmbeddings(openai_api_key=openai_api_key)
vstore = AstraDBVectorStore(
    embedding=embedding,
    collection_name="kundali_data",
    metric=VectorMetric.COSINE,  # Specify vector metric as COSINE
    token=os.environ["ASTRA_DB_APPLICATION_TOKEN"],
    api_endpoint=os.environ["ASTRA_DB_API_ENDPOINT"],
)
user_collection = database.get_collection("user_profile_data")
kundali_data_collection = database.get_collection("kundali_data")


TWEAKS = {
  "ChatInput-W2Ckr": {},
  "ParseData-ZeTbL": {},
  "Prompt-vWBoz": {},
  "OpenAIModel-E7KXJ": {},
  "ChatOutput-YO1aG": {},
  "OpenAIEmbeddings-7p9Ty": {},
  "AstraDB-zSUXk": {}
}

BASE_API_URL = "https://api.langflow.astra.datastax.com"
LANGFLOW_ID = os.getenv("LANGFLOW_ID")
FLOW_ID = os.getenv("FLOW_ID")
APPLICATION_TOKEN = os.getenv("LANGFLOW_APPLICATION_TOKE")
ENDPOINT = ""

prompts= [
    {
        'name':'recommended-poojas',
        'prompt':'suggest me some recommended-poojas for my dosh. in a json format as [{name, reason:how it affects me ,properties,benefits:Provide 5 point array as the benefits}]'
    },
    {
        'name':'recommended-gemstone',
        'prompt':'suggest me some Personalized gemstone suggestions. in a json format as [{name, color, properties,benefits:Provide 5 point array as the benefits}] only send the json output and no other data'
    },
    {
        'name': 'numerology',
        'prompt': 'provide me my numerology after doing all the calculation  only in a json format as [{number, explaination] '
    },
    {
        'name': 'dos-donts',
        'prompt': 'You are an astrology-based assistant generating tailored Dos and Donts based on a users astrological chart and planetary positions. in a json format as {dos:[{heading,content}],donts:[{heading,content}]}'
    },
]

def run_flow(message: str,
  endpoint: str,
  output_type: str = "chat",
  input_type: str = "chat",
  tweaks: Optional[dict] = None,
  application_token: Optional[str] = None) -> dict:
    api_url = f"{BASE_API_URL}/lf/{LANGFLOW_ID}/api/v1/run/{endpoint}"

    payload = {
        "input_value": message,
        "output_type": output_type,
        "input_type": input_type,
    }
    headers = None
    if tweaks:
        payload["tweaks"] = tweaks
    if application_token:
        headers = {"Authorization": "Bearer " + application_token, "Content-Type": "application/json"}
    response = requests.post(api_url, json=payload, headers=headers)
    return response.json()

@app.route('/api/python/health', methods=['POST'])
def get_server_status():
    return "server status : Running"

@app.route('/api/python/generate-kundali', methods=['POST'])
def generate_kundali():
    print(request.json)
    url = "https://kundli1.p.rapidapi.com/"

    payload = {
        "name":  request.json['name'],
        "birthdate":  request.json['dob'],
        "birthtime":  request.json['birthTime'],
        "City":  request.json['city']
    }
    headers = {
        "x-rapidapi-key": "f81ff57284msheecfcc2cd66e312p1b45cejsne5dd720ce275",
        "x-rapidapi-host": "kundli1.p.rapidapi.com",
        "Content-Type": "application/x-www-form-urlencoded",
        "Connection": "keep-alive",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    }

    response = requests.post(url, data=payload, headers=headers)
    soup = BeautifulSoup(response.text, 'html5lib')
    text_data = soup.get_text()
    result = user_collection.delete_many({})
    print(result)
    user_data = user_collection.insert_one({
        "name": request.json['name'],
        "birthdate": request.json['dob'],
        "birthtime": request.json['birthTime'],
        "city": request.json['city']
    })
    doc = Document(
        page_content=text_data,  # The main content of the document
        metadata={"source": "output.text",'id':user_data.inserted_id,}  # Optional metadata
    )
    #add in profile data
    # Insert a document into the collection

    result2 = kundali_data_collection.delete_many({})
    print(result2)
    vstore.add_documents(documents=[doc])
    response = run_flow(
        message="Generate me a summary of the overall outlook then give key findings which can be Dasha Periods keep the key findings short in a list format max 3 items in the array object in a json format as {summary: Summary Data, keyFindings: data in array format}",
        endpoint=FLOW_ID,
        output_type="chat",
        input_type="chat",
        tweaks=TWEAKS,
        application_token=APPLICATION_TOKEN
    )
    print(response)
    final_response = response['outputs'][0]['outputs'][0]['messages'][0]['message']
    response_cleaned = final_response.strip("```json").strip("```").strip()

    # Convert to JSON
    try:
        json_data = json.loads(response_cleaned)
        return json_data
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")


@app.route('/api/python/generate_findings', methods=['POST'])
def generate_findings():
    print(request.json)
    prompt = ''
    for prompt_item in prompts:
        if prompt_item['name'] == request.json['name']:
            prompt = prompt_item['prompt']
    if not prompt:
        return "invalid data"
    response = run_flow(
        message=prompt,
        endpoint=FLOW_ID,
        output_type="chat",
        input_type="chat",
        tweaks=TWEAKS,
        application_token=APPLICATION_TOKEN
    )
    final_response = response['outputs'][0]['outputs'][0]['messages'][0]['message']
    response_cleaned = final_response.strip("```json").strip("```").strip()
    print(response_cleaned)

    # Convert to JSON
    try:
        json_data = json.loads(response_cleaned)
        print(json_data)
        return json_data
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return str(e)

@app.route('/api/python/search', methods=['POST'])
def search():
    print(request.json)
    response = run_flow(
        message=request.json['input'] + 'give the response in json format {answer:}',
        endpoint=FLOW_ID,
        output_type="chat",
        input_type="chat",
        tweaks=TWEAKS,
        application_token=APPLICATION_TOKEN
    )
    final_response = response['outputs'][0]['outputs'][0]['messages'][0]['message']
    response_cleaned = final_response.strip("```json").strip("```").strip()

    # Convert to JSON
    try:
        json_data = json.loads(response_cleaned)
        return json_data
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")


@app.route('/api/python/fetch_daily_horoscope', methods=['GET'])
def fetch_daily_horoscope():
    response = run_flow(
        message='what is my rashi in only one word give the response in json format {answer:}',
        endpoint=FLOW_ID,
        output_type="chat",
        input_type="chat",
        tweaks=TWEAKS,
        application_token=APPLICATION_TOKEN
    )
    final_response = response['outputs'][0]['outputs'][0]['messages'][0]['message']
    response_cleaned = final_response.strip("```json").strip("```").strip()

    # Convert to JSON
    try:
        json_data = json.loads(response_cleaned)

        api_url = "https://daily-horoscope-api-apiverve.p.rapidapi.com/v1/horoscopesign"
        querystring = {"sign": json_data['answer'].lower()}
        headers = {
            "x-rapidapi-key": "f81ff57284msheecfcc2cd66e312p1b45cejsne5dd720ce275",
            "x-rapidapi-host": "daily-horoscope-api-apiverve.p.rapidapi.com",
        }

        # Making the GET request
        response = requests.get(api_url, headers=headers, params=querystring)
        res = response.json()
        return res['data']
        # return "DAwd"
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")

if __name__ == '__main__':
    # multiprocessing.set_start_method("fork")
    app.run(debug=True)
