from pydantic import BaseModel
from typing import List

class ImageByteRequestBody(BaseModel):
  image:str