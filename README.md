# Stock Prediction Dashboard

This is a **React-based stock prediction dashboard** that displays real-time stock data, candlestick charts, and AI-based stock price predictions.

---

## 🚀 Features

- 📈 **Candlestick, Line, Bar, and Scatter charts** for stock visualization.
- 🤖 **AI-Based Stock Predictions** displayed alongside real stock data.
- 🔄 **Live stock data fetching** via a FastAPI backend.
- 🔍 **Zoom & Pan Support** for better chart exploration.
- 🏗 **Built with React, Chart.js, Material-UI, and Axios**.

---

## 🛠️ Installation & Setup

### **1️⃣ Prerequisites**

Ensure you have the following installed on your system:

- **Node.js (>= 14.x)** - [Download here](https://nodejs.org/)
- **npm or yarn** (comes with Node.js)
- **FastAPI backend** (See backend setup section below)

### **2️⃣ Clone the Repository**

```sh
# Clone the project
git clone https://github.com/your-repo/stock-prediction-dashboard.git

# Navigate to the project folder
cd stock-prediction-dashboard
```

### **3️⃣ Install Dependencies**

```sh
# Using npm
npm install

# OR using yarn
yarn install
```

### **4️⃣ Start the Development Server**

```sh
npm start
```

The React app will run at: [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Backend Setup (FastAPI Server)

The frontend fetches stock data and predictions from a **FastAPI backend**.

### **1️⃣ Install Python Dependencies**

Ensure you have Python **3.8+** installed. Then, install FastAPI and related packages:

```sh
pip install fastapi uvicorn pandas numpy scikit-learn
```

### **2️⃣ Run the FastAPI Server**

Navigate to your FastAPI backend directory and run:

```sh
uvicorn main:app --reload
```

The backend will run at: `http://127.0.0.1:8000`

---

## 🔧 Configuration

### **Modify Stock API Endpoint**

If your FastAPI backend is running on a different host/port, update the API URL inside **StockChart.js**:

```js
const API_BASE_URL = "http://127.0.0.1:8000";  // Change if necessary
```

---

## 🛠️ Built With

- **React** - Frontend framework
- **Chart.js** - Interactive charts
- **Material-UI** - UI components
- **Axios** - HTTP requests
- **FastAPI** - Backend API
- **Python** - Data processing

---

## 🤝 Contributing

Feel free to fork the repo and submit pull requests!

---

## 📜 License

This project is licensed under the **MIT License**.

