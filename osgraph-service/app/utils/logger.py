#
# Copyright 2025 AntGroup CO., Ltd.
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
# http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#
import logging
import os
from logging.handlers import RotatingFileHandler


def setup_logger(app):
    log_dir = os.path.join(app.root_path, "logs")
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    handler = RotatingFileHandler(
        os.path.join(log_dir, "app.log"),
        maxBytes=10 * 1024 * 1024,  # 10MB
        backupCount=5,
    )

    formatter = logging.Formatter(
        "%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]"
    )
    handler.setFormatter(formatter)
    root_logger = logging.getLogger()
    root_logger.setLevel(app.config["LOG_LEVEL"])
    if not any(isinstance(h, RotatingFileHandler) for h in root_logger.handlers):
        root_logger.addHandler(handler)
    logging.getLogger("werkzeug").setLevel(logging.WARNING)
    logging.getLogger("flask").setLevel(logging.WARNING)
    root_logger.info(
        "The logger has been started, log level: %s",
        logging.getLevelName(app.config["LOG_LEVEL"]),
    )
