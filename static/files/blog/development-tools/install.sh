#!/bin/bash

# 帮助信息
show_help() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  zsh    - 安装并配置 zsh、oh-my-zsh 及其插件"
    echo "  docker - 安装并配置 Docker"
    echo "  python - 配置 Python 开发环境，搭载 Python 3.12.4"
    echo "  go     - 配置 Go 开发环境，搭载 go1.22.3"
    echo "  node   - 配置 NodeJS 开发环境，搭载 NodeJS LTS 以及 pnpm"
    echo "  rust   - 配置 Rust 开发环境，使用 rsproxy 源"
    echo "  all    - 安装所有环境"
}

# zsh 安装配置
install_zsh() {
    echo "开始安装配置 zsh..."
    # 安装 zsh 和 autojump
    sudo apt install zsh autojump -y && chsh -s /bin/zsh

    # 安装 oh-my-zsh
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

    # 安装主题和插件
    git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
    git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
    git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

    # 配置 zshrc
    sed -i 's/^ZSH_THEME=.*/ZSH_THEME="powerlevel10k\/powerlevel10k"/' ~/.zshrc
    sed -i 's/^plugins=.*/plugins=(git autojump zsh-autosuggestions zsh-syntax-highlighting)/' ~/.zshrc

    # 重新加载配置
    exec zsh
    echo "zsh 配置完成！"
}

# Docker 安装配置
install_docker() {
    echo "开始安装配置 Docker..."
    # 卸载旧版本
    for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done

    # 安装前置依赖
    sudo apt-get update && sudo apt-get install ca-certificates curl -y

    # 验证 Docker GPG 密钥
    sudo install -m 0755 -d /etc/apt/keyrings && sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc && sudo chmod a+r /etc/apt/keyrings/docker.asc

    # 添加 Docker PPA
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    # 安装 Docker
    sudo apt-get update && sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

    # 配置 Docker 源
    sudo mkdir -p /etc/docker
    sudo tee /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": ["https://docker.m.daocloud.io"]
}
EOF
}

# Python 环境配置
install_python() {
    echo "开始配置 Python 环境..."
    # 安装 pyenv
    curl https://pyenv.run | bash

    # 配置环境变量
    echo 'eval "$(pyenv init -)"' >> ~/.zshrc

    # 安装 Python
    pyenv install 3.12.4

    # 配置 pip 源
    pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/
    echo "Python 环境配置完成！"
}

# Go 环境配置
install_go() {
    echo "开始配置 Go 环境..."
    # 安装依赖
    sudo apt install bison -y

    # 安装 gvm
    bash < <(curl -s -S -L https://raw.githubusercontent.com/moovweb/gvm/master/binscripts/gvm-installer)

    # 安装 Go
    source ~/.gvm/scripts/gvm
    gvm install go1.22.3
    gvm use go1.22.3

    # 配置源
    go env -w GOPROXY=https://goproxy.cn,direct
    echo "Go 环境配置完成！"
}

# NodeJS 环境配置
install_node() {
    echo "开始配置 NodeJS 环境..."
    # 安装 n
    curl -L https://git.io/n-install | zsh

    # 安装 Node.js
    n lts

    # 安装并配置 pnpm
    npm install -g pnpm
    pnpm config set registry https://registry.npmmirror.com
    echo "NodeJS 环境配置完成！"
}

# Rust 环境配置
install_rust() {
    echo "开始配置 Rust 环境..."
    # 设置环境变量
    echo 'export RUSTUP_DIST_SERVER="https://rsproxy.cn"' >> ~/.zshrc
    echo 'export RUSTUP_UPDATE_ROOT="https://rsproxy.cn/rustup"' >> ~/.zshrc

    # 安装 Rust
    curl --proto '=https' --tlsv1.2 -sSf https://rsproxy.cn/rustup-init.sh | sh

    # 配置 cargo 源
    mkdir -p ~/.cargo
    cat <<EOF >> ~/.cargo/config.toml
[source.crates-io]
replace-with = 'rsproxy-sparse'
[source.rsproxy]
registry = "https://rsproxy.cn/crates.io-index"
[source.rsproxy-sparse]
registry = "sparse+https://rsproxy.cn/index/"
[registries.rsproxy]
index = "https://rsproxy.cn/crates.io-index"
[net]
git-fetch-with-cli = true
EOF
    echo "Rust 环境配置完成！"
}

# 根据参数执行相应的安装
case "$1" in
    "zsh")
        install_zsh
        ;;
    "python")
        install_python
        ;;
    "go")
        install_go
        ;;
    "node")
        install_node
        ;;
    "rust")
        install_rust
        ;;
    "all")
        install_zsh
        install_python
        install_go
        install_node
        install_rust
        ;;
    *)
        show_help
        exit 1
        ;;
esac

echo "安装完成！"
EOF