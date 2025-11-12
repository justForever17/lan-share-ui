# LAN Share UI

一个轻量、现代、易于部署的局域网文件共享平台。

![Logo](public/icon.png)

## 简介

LAN Share UI 提供了一个美观且用户友好的Web界面，用于在本地网络（局域网）内方便地共享文件。它基于 Next.js 构建，无需复杂的配置即可快速启动，非常适合在家庭、办公室或任何局域网网络环境中使用。

## ✨ 主要功能

- **文件和文件夹管理**：支持文件和文件夹的上传、下载、删除和创建。
- **密码保护**：所有危险操作（如删除、修改设置）均受管理员密码保护。
- **动态配置**：通过网页界面动态修改存储容量、上传限制和管理员密码。
- **响应式设计**：界面适配桌面和移动设备。
- **文件类型筛选**：快速筛选不同类型的文件（文档、图片、音视频等）。
- **便携化部署**：无需打包，通过Node.js即可在生产环境运行，数据和设置随应用一同存放。

## 🛠️ 技术栈

- **框架**: [Next.js](https://nextjs.org/)
- **UI**: [React](https://react.dev/), [styled-components](https://styled-components.com/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 快速开始

### 开发环境

要在您的本地机器上进行开发和测试，请遵循以下步骤：

1.  **克隆仓库**
    ```bash
    git clone <repository-url>
    cd lan-share-ui
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **运行开发服务器**
    ```bash
    npm run dev
    ```
    现在，您可以在浏览器中打开 `http://localhost:3000` 来访问应用。

###  生产环境部署（推荐）

这是在正式环境（如离线服务器）中部署应用的最佳方式。

1.  **构建应用**
    在您的开发电脑上，首先运行构建命令：
    ```bash
    npm run build
    ```
    这个命令会创建一个经过优化的、用于生产环境的版本，并生成一个 `.next/standalone` 文件夹。

2.  **准备部署文件**
    您需要将以下三个部分复制到您的服务器上：
    
    a. 整个 `.next/standalone` 文件夹。
    b. 整个 `public` 文件夹。
    c. `.next` 文件夹内的 `static` 文件夹。

    **操作指南**：
    - 在服务器上创建一个新目录，例如 `D:\lan-share-app`。
    - 将 `standalone` 文件夹内的**所有内容**复制到 `D:\lan-share-app`。
    - 将 `public` 文件夹复制到 `D:\lan-share-app` 内部。
    - 在 `D:\lan-share-app` 内创建一个 `.next` 文件夹，然后将原始项目中的 `.next/static` 文件夹复制到这里。

    最终，您在服务器上的文件结构应该如下所示：
    ```
    D:\lan-share-app\
    ├── node_modules\
    ├── server.js
    ├── package.json
    ├── .next\
    │   └── static\  <-- 复制过来的
    └── public\      <-- 复制过来的
    ```

3.  **启动应用**
    在服务器上，打开命令行，进入应用目录并启动服务：
    ```bash
    cd D:\lan-share-app
    node server.js
    ```
    服务器将在3000端口上运行。您可以通过 `http://<服务器的局域网IP>:3000` 访问。

## ⚙️ 配置

- **首次运行**: 应用首次启动时，会在其运行目录下自动创建 `settings.json` 文件和 `shared_files` 文件夹。
- **默认密码**: 初始管理员密码为 `admin123`。您可以在网页的“设置”中修改它。
- **数据存储**: 所有上传的文件都存储在 `shared_files` 文件夹中。如果您需要迁移应用，只需将整个文件夹（包含 `server.js`, `settings.json`, `shared_files` 等）一起复制即可。
- **数据安全**：注意！不要在暴露公网IP的环境中使用，因为本项目缺少相关安全验证机制，如果需要请fork本项目自行开发，或者联系我。

## 📄 开源协议

本项目采用 MIT 开源协议。详情请见 [LICENSE](LICENSE) 文件。