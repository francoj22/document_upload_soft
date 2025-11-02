# 📄 Mobile PDF Upload & Signing App

A mobile-friendly web application that allows users to upload PDF documents, send them to a mock server for digital signing, and view the signed documents directly on their mobile devices.

## Features

- ** Mobile-First Design**: Fully responsive interface optimised for phones and tablets
- ** PDF Upload**: Drag & drop or click to upload PDF files (up to 10MB)
- ** Digital Signature Canvas**: Interactive signature drawing with touch support
- ** Real Signature Embedding**: Actual signature images embedded into PDFs (200x200px)
- ** Smart Positioning**: Signatures placed 800px from top (near footer area)
- ** PDF Viewer**: Built-in PDF viewer with pagination and zoom controls
- ** Download**: Download signed PDFs directly to device
- ** Progress Tracking**: Real-time upload and signing progress indicators
- ** Network Access**: Exposed ports for mobile device testing
- ** Fallback Mode**: Works offline with mock signing service

## 🚀 Quick Start

1. **Start both client and server:**
   ```bash
   npm run dev:all
   ```

2. **Or start them separately:**
   ```bash
   # Terminal 1 - Start the mock signing server
   npm run server
   
   # Terminal 2 - Start the React development server
   npm run dev
   ```

3. **Open your browser:**
   - Client: http://localhost:5173
   - Server: http://localhost:3002

## 📋 How to Use

1. **Upload a PDF**: 
   - Drag and drop a PDF file onto the upload area
   - Or click "Choose File" to browse for a PDF

2. **Draw Your Signature**:
   - An interactive signature canvas will appear
   - Draw your signature using mouse or touch
   - Canvas is optimized for mobile touch drawing
   - Click "Save Signature" when ready

3. **Document Processing**: 
   - The app uploads your PDF to the signing server
   - Your signature image is embedded into the document (200x200px)
   - Signature is placed 800px from top (near footer area)
   - Progress is shown in real-time

4. **View & Download**: 
   - The signed PDF opens automatically in the built-in viewer
   - Navigate through pages with the arrow buttons
   - Download the signed document to your device

## 🏗️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **Lucide React** for modern icons
- **HTML5 Canvas** for signature capture
- **SimplePDFViewer** for document display

### Backend
- **Express.js** server with CORS support
- **Multer** for file upload handling
- **pdf-lib** for PDF manipulation and signature embedding
- **PNG Image Embedding** for signature integration
- **Node.js** runtime

## 📱 Mobile Optimization

- **Touch-Friendly**: Large touch targets and mobile gestures
- **Responsive Layout**: Adapts seamlessly to different screen sizes
- **Fast Loading**: Optimized for mobile network conditions
- **Progressive Enhancement**: Works on older mobile browsers
- **Signature Canvas**: Touch-enabled drawing with prevent-scroll
- **Network Exposure**: Accessible from mobile devices on local network

## 🌐 Mobile Device Access

The application is configured to be accessible from mobile devices on your local network:

### Setup for Mobile Testing
1. **Find your computer's IP address:**
   ```bash
   # The development server shows network URLs:
   # ➜  Network: http://192.168.0.4:5173/
   ```

2. **Access from mobile device:**
   - Ensure your mobile device is on the same WiFi network
   - Navigate to `http://YOUR_IP:5173` on your mobile browser
   - Example: `http://192.168.0.4:5173`

3. **Test signature canvas:**
   - Upload a PDF on your mobile device
   - Use touch to draw your signature on the canvas
   - The signature will be embedded and viewable on mobile

### Mobile Features
- **Touch Drawing**: Native touch support for signature canvas
- **Responsive UI**: Optimized layout for phone and tablet screens
- **Cross-Platform**: Works on iOS Safari, Android Chrome, and other mobile browsers

### ✅ Mobile Success Confirmation

The mobile PDF signing workflow has been **successfully tested and verified** on iPhone:

![Mobile PDF Signing Success](https://github.com/francoj22/document_upload_soft/blob/main/src/assets/Pdf_signer-1.png)


## 🔧 Project Structure

```
document_upload_soft/
├── src/                          # React frontend source
│   ├── components/              # React components
│   │   ├── PDFUpload.tsx       # File upload component
│   │   ├── PDFViewer.tsx       # PDF display component
│   │   └── LoadingIndicator.tsx # Progress/status component
│   ├── services/               # API services
│   │   └── pdfSigningService.ts # PDF signing API client
│   ├── types/                  # TypeScript type definitions
│   └── App.tsx                 # Main application component
├── server/                     # Express backend
│   ├── index.js               # Server entry point
│   ├── package.json           # Server dependencies
│   └── uploads/               # Uploaded/signed PDFs storage
└── public/                    # Static assets
```

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Available Scripts

- `npm run dev` - Start Vite development server
- `npm run server` - Start the mock signing server
- `npm run dev:all` - Start both client and server concurrently
- `npm run build` - Build the React app for production
- `npm run preview` - Preview the production build

### Environment Configuration

The app automatically detects if the signing server is available:
- If server is running → Uses real PDF signing with pdf-lib
- If server is down → Falls back to mock signing mode

## 🔒 Security Notes

This is a demonstration app with a mock signing service. For production use:

- Implement proper authentication
- Add file validation and sanitization
- Use secure file storage (not local filesystem)
- Implement rate limiting
- Add proper error logging
- Use HTTPS in production

## 📄 API Endpoints

### `GET /health`
Health check endpoint

### `POST /api/sign-pdf`
Upload and sign a PDF document
- **Content-Type**: multipart/form-data
- **Field**: `pdf` (File)
- **Returns**: Signed document information

## 🎨 UI Components

### PDFUpload
- Drag & drop file upload
- File type validation
- Size limit enforcement
- Mobile-friendly touch interface

### PDFViewer
- Full-screen PDF viewer
- Page navigation
- Download functionality
- Mobile-optimized controls

### LoadingIndicator
- Upload progress tracking
- Status messaging
- Error state handling
- Mobile-friendly feedback

## 🚀 Deployment

### Frontend (Vite)
```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Backend (Express)
```bash
cd server
npm install --production
npm start
```

## 📱 Mobile Testing

Test the app on various mobile devices and screen sizes:
- iOS Safari
- Android Chrome
- Mobile Firefox
- Tablet devices


## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Made with ❤️ for mobile-first PDF processing by FRANCO GUTIERREZ**

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh



## Command helpers - port

lsof -ti:5173 | xargs kill -9 2>/dev/null || echo "No process on port 5173"

lsof -ti:3002 | xargs kill -9 2>/dev/null || echo "No process on port 3002"
