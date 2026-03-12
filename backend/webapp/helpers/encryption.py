from hashlib import sha256

from Crypto.Cipher import AES


def _candidate_keys(key):
    key_bytes = bytes(key, 'utf-8')
    keys = [sha256(key_bytes).digest()]

    if len(key_bytes) in (16, 24, 32) and key_bytes not in keys:
        keys.append(key_bytes)

    return keys


def encrypt_text(data, key):
    cipher = AES.new(_candidate_keys(key)[0], AES.MODE_EAX)
    nonce = cipher.nonce
    cipher_text, tag = cipher.encrypt_and_digest(bytes(data, 'utf-8'))
    return cipher_text, nonce, tag


def decrypt_text(data, key, nonce, tag=None):
    last_error = None

    for key_bytes in _candidate_keys(key):
        try:
            cipher = AES.new(key_bytes, AES.MODE_EAX, nonce=nonce)
            decrypted = cipher.decrypt(data)
            if tag is not None:
                cipher.verify(tag)
            return decrypted.decode()
        except (ValueError, UnicodeDecodeError) as exc:
            last_error = exc

    raise ValueError('Unable to decrypt payload') from last_error
