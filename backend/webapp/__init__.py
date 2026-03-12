from flask import Flask, g, request
from flask_pymongo import PyMongo
import gridfs
import time
import uuid

from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_socketio import SocketIO, send, emit
from webapp.utils.logger import get_logger

app = Flask(__name__)
import config



bcrypt = Bcrypt(app)
jwt = JWTManager(app)
mongodb_client = PyMongo(app)
db=mongodb_client.db
fs=gridfs.GridFS(db)
    
CORS(app)
socketio = SocketIO(app)


socketio =  SocketIO(app,cors_allowed_origins='*')
logger = get_logger(__name__)


@app.before_request
def start_request_trace():
    g.request_started_at = time.perf_counter()
    g.request_id = request.headers.get("X-Request-ID", uuid.uuid4().hex)


@app.after_request
def log_request(response):
    request_id = getattr(g, "request_id", "-")
    response.headers["X-Request-ID"] = request_id
    duration_ms = 0
    if hasattr(g, "request_started_at"):
        duration_ms = round((time.perf_counter() - g.request_started_at) * 1000, 2)
    logger.info(
        "%s %s -> %s (%sms)",
        request.method,
        request.path,
        response.status_code,
        duration_ms,
        extra={"request_id": request_id},
    )
    return response


#model

# @socketio.on('connect_test')
# def connect():
#     print('connect')

#views

import webapp.views.user
import webapp.views.social
import webapp.views.content

#forms
