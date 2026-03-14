# OpenClaw 技能：Draw Things AI 图像生成

这是一个为 [OpenClaw](https://github.com/mijuu/openclaw) / Gemini CLI 开发的高性能 Node.js 技能，支持在 macOS 上通过 [Draw Things](https://drawthings.ai/) gRPC 后端进行本地 AI 图像生成。

## 🚀 核心特性

- **纯 Node.js 实现**：无需 Python 或外部图像处理脚本。
- **高性能**：采用 gRPC 协议进行低延迟通信，并使用 FlatBuffers 进行高效的二进制序列化。
- **安全可靠**：全面支持 SSL/TLS 加密，并内置了 Draw Things 根证书（Root CA）。
- **快速生成**：针对 "Turbo" 模型（如 SDXL Turbo, Flux）进行了优化，支持实时生成进度更新。
- **协议灵活**：同时支持 gRPC（端口 7859）和 HTTP（端口 7860）。
- **全面控制**：完整支持提示词（Prompt）、反向提示词（Negative Prompt）、种子值（Seed）、采样器及模型选择。

## 🛠️ 前置条件

- **macOS**：Draw Things 是一款 macOS 原生应用。
- **Draw Things App**：已安装并下载了所需的模型。
- **Node.js**：版本 16 或更高。
- **重要设置**：在 Draw Things 的设置中，**禁用 "Response Compression" (响应压缩)** (也称为 FPY)。该脚本目前不支持 FPY 压缩的张量。

## 📦 安装

将此仓库克隆到你的 OpenClaw 技能目录中：

```bash
cd ~/.openclaw/skills
git clone https://github.com/mijuu/openclaw-skill-drawthings.git drawthings
cd drawthings
npm install
```

## ⚙️ 配置

1. 复制环境变量模板文件：
   ```bash
   cp .env.example .env
   ```
2. 编辑 `.env` 文件并配置你的本地路径：
   - `DRAWTHINGS_SERVER_PATH`：`gRPCServerCLI-macOS` 二进制文件的路径（通常在 App 包内或单独下载）。
   - `DRAWTHINGS_MODELS_PATH`：Draw Things 模型目录的路径。
   - `DRAWTHINGS_USE_TLS`：如果你希望使用加密连接，请设置为 `true`（推荐）。

## 🚀 使用方法

### 1. 启动服务器

你可以通过以下两种方式启动 gRPC 服务器：

#### 方式 A：直接使用 Draw Things App（最简单）
1. 在你的 Mac 上打开 **Draw Things** 应用。
2. 进入 **Settings (设置)** 并开启 **gRPC Server**。
3. 完成！你的技能现在可以直接连接到此服务器（默认地址为 `127.0.0.1:7859`）。

#### 方式 B：使用命令行（后台运行）
如果你更喜欢在没有应用界面的情况下运行服务器，请在 `.env` 中配置 `DRAWTHINGS_SERVER_PATH` 并运行：

```bash
npm run start-server
```

### 2. 生成图像

使用提供的生成脚本：

```bash
# 基础生成
node scripts/generate.js --prompt "清晨宁静的山湖" --output landscape.png

# 进阶用法 (使用 Turbo 模型)
node scripts/generate.js --prompt "赛博朋克城市" --model z_image_turbo_1.0_q6p.ckpt --steps 8 --tls
```

### 3. 检查状态与模型

```bash
# 检查服务器是否响应
npm run health

# 列出可用模型
npm run models
```

## 📂 项目结构

- `scripts/generate.js`：核心生成逻辑与 CLI。
- `scripts/start-server.js`：服务器管理包装脚本。
- `scripts/imageService.proto`：gRPC 服务定义。
- `scripts/drawthings-ca.pem`：内置的 TLS 根证书。
- `references/`：关于 gRPC 协议和采样器的详细文档。

## 🤝 贡献

欢迎提交贡献！请随时提交 Pull Request。

## 📜 许可证

MIT 许可证。详见 [LICENSE](LICENSE)。
