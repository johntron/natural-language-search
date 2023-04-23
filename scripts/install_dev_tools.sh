#!/usr/bin/env sh

install_debian() {
  sudo apt update -y
  sudo apt install -y python3
  python3 -m pip install --upgrade pip
  curl -sSL https://install.python-poetry.org | python3 -
  poetry completions fish > ~/.config/fish/completions/poetry.fish
}

install_debian
infra/scripts/install_dev_tools.sh