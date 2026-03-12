from flask import jsonify


def json_error(message, status_code=400, **extra):
    payload = {"message": message}
    payload.update(extra)
    return jsonify(payload), status_code
