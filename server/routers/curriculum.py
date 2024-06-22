import httpx
import json
from os import getenv
from time import sleep

import boto3
from dotenv import load_dotenv
from fastapi import APIRouter, UploadFile, File

load_dotenv()

router = APIRouter(prefix='/curriculum')

brt = boto3.client(
    service_name='bedrock-runtime',
    region_name='us-east-1',
    aws_access_key_id=getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=getenv("AWS_SECRET_ACCESS_KEY")
)

async def _upload_pdf(file: UploadFile) -> str:
    '''Uploads a PDF file to the Mathpix API and returns the PDF ID.'''
    upload_url = "https://api.mathpix.com/v3/pdf"
    async with httpx.AsyncClient() as client:

        print(file)
        print("----------------------------=-=-=-=-=-=--")
        files = {
            'file': (file.filename, file.file, file.content_type)
        }
        headers = {
            'app_id': getenv("MATHPIX_APP_ID"),
            'app_key': getenv("MATHPIX_APP_KEY")
        }
        response = await client.post(upload_url, headers=headers, files=files)
        return response.json()['pdf_id']

async def _extract_lines(pdf_id:str) -> dict:
    '''Extracts lines from a PDF file using the Mathpix API.'''
    extract_lines_url = f"https://api.mathpix.com/v3/pdf/{pdf_id}.lines.json"
    async with httpx.AsyncClient() as client:
        headers = {
            'app_id': getenv("MATHPIX_APP_ID"),
            'app_key': getenv("MATHPIX_APP_KEY")
        }
        response = await client.get(extract_lines_url, headers=headers)
        return response.json()

def _prompt_claude(prompt:str) -> str:
    '''Prompts the Claude model with a syllabus and returns a curriculum.'''
    body = json.dumps({
    "max_tokens": 2048,
    "messages": [
        {
            "role": "user",
            "content": "Read the following text from a syllabus, generate a curriculum with at least 5 chapters, and return only a list of json objects with the following structure: {\"name\":\"\",\"description\":\"\",\"topics\":[\"\",\"\",\"\"]}\n\n\nSyllabus: \n" + prompt
        },
        {
            "role": "assistant",
            "content": "["
        }
    ],
    "anthropic_version": "bedrock-2023-05-31"
    })

    response = brt.invoke_model(body=body, modelId="anthropic.claude-3-5-sonnet-20240620-v1:0")

    response_body = json.loads(response.get("body").read())
    return response_body.get("content")[0]['text']

@router.post("/generate")
async def generate_curriculum(file: UploadFile = File(None)):
    pdf_id = await _upload_pdf(file)

    response = await _extract_lines(pdf_id)
    while "status" in response:
        sleep(2)
        response = await _extract_lines(pdf_id)

    response = response

    syllabus_text = ""
    for page in response["pages"]:
        for line in page["lines"]:
            syllabus_text += line["text"] + "\n"

    curriculum = "[" + _prompt_claude(syllabus_text)

    return { "lessons": json.loads(curriculum) }
