@echo off
echo Starting Miuu's Birthday Website server...
start "" http://localhost:8000
python -m http.server 8000
