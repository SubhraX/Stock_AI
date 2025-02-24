import yfinance as yf
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

# Fetch real-time stock data
def get_stock_data(ticker, period='1y', interval='1d'):
    stock = yf.Ticker(ticker)
    df = stock.history(period=period, interval=interval)
    return df

# Plot stock data in various formats
def plot_stock_data(df):
    plt.figure(figsize=(12, 6))
    
    # Line Graph
    plt.subplot(2, 2, 1)
    plt.plot(df['Close'], label='Close Price', color='blue')
    plt.title("Stock Price Over Time (Line Graph)")
    plt.legend()
    
    # Bar Chart
    plt.subplot(2, 2, 2)
    df['Close'].plot(kind='bar', color='green')
    plt.title("Stock Price (Bar Chart)")
    
    # Histogram
    plt.subplot(2, 2, 3)
    sns.histplot(df['Close'], bins=30, kde=True, color='red')
    plt.title("Stock Price Distribution (Histogram)")
    
    plt.tight_layout()
    plt.show()

# Prepare data for LSTM model
def prepare_data(df):
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(df[['Close']])
    
    X, y = [], []
    time_steps = 60
    for i in range(time_steps, len(scaled_data)):
        X.append(scaled_data[i-time_steps:i, 0])
        y.append(scaled_data[i, 0])
    
    X, y = np.array(X), np.array(y)
    return X.reshape((X.shape[0], X.shape[1], 1)), y, scaler

# Build LSTM model
def build_lstm_model():
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

# Predict future prices
def predict_future(model, data, scaler):
    predictions = model.predict(data)
    return scaler.inverse_transform(predictions)

# Main execution
ticker = "AAPL"
df = get_stock_data(ticker)
plot_stock_data(df)

X, y, scaler = prepare_data(df)
model = build_lstm_model()
model.fit(X, y, epochs=10, batch_size=32, verbose=1)

future_pred = predict_future(model, X[-10:], scaler)
print("Future Predictions:", future_pred)
