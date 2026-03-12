import logging
import os


def get_logger(name):
    logger = logging.getLogger(name)
    if logger.handlers:
        return logger

    level_name = os.getenv("LEYLINES_LOG_LEVEL", "INFO").upper()
    level = getattr(logging, level_name, logging.INFO)

    handler = logging.StreamHandler()
    handler.setFormatter(
        logging.Formatter(
            "%(asctime)s %(levelname)s [%(name)s] request_id=%(request_id)s %(message)s"
        )
    )
    handler.addFilter(lambda record: setattr(record, "request_id", getattr(record, "request_id", "-")) or True)

    logger.setLevel(level)
    logger.addHandler(handler)
    logger.propagate = False
    return logger
