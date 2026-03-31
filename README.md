# Open SmartCity Home ioBroker Adapter

<div style="display:flex;gap:1%;margin-bottom:20px">
  <img height="100px" alt="logo" src="logo.svg">
</div>

⚠️ **Beta Software**
This adapter is currently in **beta**. Functionality, configuration flow, and structure may change. Use at your own risk.

---

## Overview

The **Open SmartCity Home ioBroker Adapter** connects Open SmartCity Home sensor stations into ioBroker.
* Each selected **sensor station** is represented as a **channel**
* Each **sensor** within a **station** is exposed as an individual **state**

This allows seamless use of sensor data in dashboards, automations, and scripts.

---

## Installation

### Add Adapter via GitHub (Recommended)

1. Open **Adapters**
2. Enable **Expert Mode**
3. Click the **GitHub icon**
4. Select **"CUSTOM”**
5. Enter the repository URL and install

> **Note:** The CLI installation (`iobroker url`) may show `Cannot install ... : 0` and `Process exited with code 25`. This is caused by the repository name not following the ioBroker naming convention (`ioBroker.<adapter-name>`). The error is cosmetic — the adapter is installed successfully. Refresh the adapter list and it will appear.

### Development Setup

Run the following in the project root:
```bash
yarn dev-server setup
yarn dev-server run
```
This will start an ioBroker instance with the adapter pre-installed.

For more details, see the dev-server docs:

https://github.com/ioBroker/dev-server#command-line

### Docker Container Manuall Installation

```bash
    docker run -d \
    --name iobroker \
    -p 8081:8081 \
    -p 8082:8082 \
    -v iobrokerdata:/opt/iobroker \
    -v iobrokercustom:/opt/iobroker/custom \
    --restart unless-stopped \
    buanet/iobroker

    sleep 5

    docker exec -it iobroker bash

    cd /tmp
    rm -rf open-smartcity-home-iobroker-adapter

    git clone -b development https://<token-name>:<token>@github.com/Klingenstadt-Solingen/Open-SmartCity-Home-ioBroker-Adapter.git
    cd open-smartcity-home-iobroker-adapter

    yarn install
    yarn run build

    cp -r /tmp/open-smartcity-home-iobroker-adapter /opt/iobroker/custom/

    cd /opt/iobroker
    ./iobroker url /opt/iobroker/custom/open-smartcity-home-iobroker-adapter
    ./iobroker add open-smart-city-home host
```

## Configuration

1. Go to the **Adapters** tab and add instance of **Open SmartCity Home** adapter.
2. Open **Instances** tab 
3. Click **Settings** on the created instance.
4. Select the sensort stations you want to include

---

## Devices & Entities

After saving the configuration:

* A **channel** is created for each selected sensor station
* A **state** is created for each sensor within that station

These states can be used in:
* Visualizations (dashboard)
* Automations
* Scripts

---

## Notes

* This integration is in **beta**
* Entity IDs and naming may change
* Error handling is still limited
* Feedback and bug reports are welcome

---

## License

This project is licensed under the [Open SmartCity License](LICENSE.md).
