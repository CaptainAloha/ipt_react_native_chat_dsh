#!/bin/bash

get_ip_address() {
    # Linux
    if [ "$(uname)" == "Linux" ]; then
        ip addr show | grep -oE '\b([0-9]{1,3}\.){3}[0-9]{1,3}\b' | grep -vE '127.0.0.1|255.255.255.255' | head -n 1

    # macOS
    elif [ "$(uname)" == "Darwin" ]; then
        ifconfig | grep inet | grep -vE 'inet6|127.0.0.1' | awk '{print $2}' | head -n 1

    # Windows
    elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]; then
        ipconfig | grep IPv4 | awk '{print $NF}'

    else
        echo "Unsupported operating system"
    fi
}

echo "Gathering your ip for dev container"
ip_address=$(get_ip_address)
echo "Your ip address is: $ip_address"
echo "REACT_NATIVE_PACKAGER_HOSTNAME=$ip_address" > .devcontainer/.env



