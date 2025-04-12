FROM python:3.11-slim

ARG REQUIREMENTS_FILE

WORKDIR /app
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y \
    gdal-bin \
    libgdal-dev \
    libgeos-dev \
    libpq-dev \
    wget \
    gcc \
    netcat-openbsd \
    && apt-get clean


COPY requirements/ ./requirements/

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r ./requirements/${REQUIREMENTS_FILE}

COPY . .

COPY docker/entrypoint-web.sh /entrypoint-web.sh
RUN chmod +x /entrypoint-web.sh

CMD ["sh", "/entrypoint-web.sh"]
