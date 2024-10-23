from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import numpy as np
import os

import cv2
from deepface import DeepFace

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (you can restrict this for better security)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

class BiometricData(BaseModel):
    idUser: int
    biometric_ref: str

@app.post('/biometric')
def index(data: BiometricData):
    img_data = data.biometric_ref.split(",")[-1]
    img_binary = base64.b64decode(img_data)
    img_array = np.frombuffer(img_binary, dtype=np.uint8)
    image = cv2.imdecode(img_array, cv2.IMREAD_UNCHANGED)

    path_image = f"./bio_ref/user_{data.idUser}.png"
    path_image_scan = f"./bio_ref/user_{data.idUser}_scan.png"

    if(not os.path.exists(path_image)):
        cv2.imwrite(path_image, image)
        return {"message": "success"}
    
    cv2.imwrite(path_image_scan, image)
    
    try:
        result = DeepFace.verify(path_image, path_image_scan)
        os.remove(path_image_scan)
        print('result', result)
        if(result['verified']):
            return {"message": "success", "status": "200"}
        else:
            return {"message": "not valid", "status": "403"}
    except ValueError as e:
        os.remove(path_image_scan)
        return {"error": str(e)}