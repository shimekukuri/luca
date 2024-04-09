FROM node:20 AS builder

WORKDIR /app

COPY frontend/ .

RUN npm install
RUN npm run build

FROM python:3.9-slim

RUN apt-get update && apt-get install -y \
  gcc \
  python3-dev \
  libpcre3-dev \
  default-libmysqlclient-dev \ 
  build-essential \
  pkg-config

WORKDIR /app

COPY . .  

RUN rm -rf frontend

COPY --from=builder /app/dist ./dist

RUN pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
RUN pip install flask-mysqldb
RUN pip install --no-cache-dir -r ./requirements.txt

CMD ["uwsgi", "--ini", "uwsgi.ini"]

