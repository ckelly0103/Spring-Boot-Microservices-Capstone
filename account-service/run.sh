#!/bin/bash

echo "Starting Account Service..."
echo "Service will run on http://localhost:8081/account/"
echo ""
echo "Available endpoints:"
echo "- GET  /account/          (Service status)"
echo "- POST /account/token     (Login)"
echo "- POST /account/register  (Register)"
echo ""

./gradlew bootRun
