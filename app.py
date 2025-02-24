from fastapi import FastAPI
import yfinance as yf
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_stock_data(ticker: str, period='1y', interval='1d'):
    """Fetch historical stock close price data"""
    stock = yf.Ticker(ticker)
    df = stock.history(period=period, interval=interval)
    return df[['Close']]

def get_candlestick_data(ticker: str, period="7d", interval="1h"):
    """Fetch candlestick data (Open, High, Low, Close)"""
    stock = yf.Ticker(ticker)
    df = stock.history(period=period, interval=interval)
    df.reset_index(inplace=True)
    df["Datetime"] = df["Datetime"].astype(str)  # Convert datetime to string for JSON compatibility
    return df[['Datetime', 'Open', 'High', 'Low', 'Close']].to_dict(orient="records")

def prepare_data(df):
    """Prepare stock data for LSTM model"""
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(df[['Close']])
    X, y = [], []
    time_steps = 60
    for i in range(time_steps, len(scaled_data)):
        X.append(scaled_data[i-time_steps:i, 0])
        y.append(scaled_data[i, 0])
    return np.array(X).reshape(-1, time_steps, 1), np.array(y), scaler

def build_lstm_model():
    """Define an LSTM model for stock price prediction"""
    model = Sequential([
        LSTM(50, return_sequences=True, input_shape=(60, 1)),
        Dropout(0.2),
        LSTM(50, return_sequences=False),
        Dropout(0.2),
        Dense(25),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mean_squared_error')
    return model

@app.get("/predict/{ticker}")
def predict_stock(ticker: str):
    """Predict future stock prices using LSTM"""
    df = get_stock_data(ticker)
    X, y, scaler = prepare_data(df)
    model = build_lstm_model()
    model.fit(X, y, epochs=10, batch_size=32, verbose=1)
    
    future_pred = model.predict(X[-10:])
    predictions = scaler.inverse_transform(future_pred)
    
    return {"predictions": predictions.tolist()}

@app.get("/stock/{ticker}")
def get_stock(ticker: str):
    """Return historical stock data"""
    df = get_stock_data(ticker)
    return df.to_dict()

@app.get("/candlestick/{ticker}")
def fetch_candlestick(ticker: str):
    """Return candlestick chart data"""
    return {"ticker": ticker, "candlestick": get_candlestick_data(ticker)}
