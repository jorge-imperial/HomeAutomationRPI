#!/bin/bash

curl http://10.1.0.195:6000/relay/0?state=1
sleep 120
curl http://10.1.0.195:6000/relay/0?state=0
curl http://10.1.0.195:6000/relay/1?state=1
sleep 120
curl http://10.1.0.195:6000/relay/1?state=0
curl http://10.1.0.195:6000/relay/2?state=1
sleep 120
curl http://10.1.0.195:6000/relay/2?state=0
curl http://10.1.0.195:6000/relay/3?state=1
sleep 120
curl http://10.1.0.195:6000/relay/3?state=0
