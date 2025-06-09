# HCT Survival Prediction Tool

A clinical decision support system for predicting survival probability after Hematopoietic Cell Transplantation (HCT) using machine learning.

## 🚀 Backend Setup & Deployment

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Required Files

Ensure your backend folder contains:
- `main.py` - Flask application
- `requirements.txt` - Python dependencies
- `model_lgb.pkl` - Pre-trained LightGBM model ⚠️ **REQUIRED**

### Installation & Running

1. **Clone this repostiroy and navigate to backend directory**
   ```bash
   git clone https://github.com/AlthariqFairuz/HCT-Survival-Analysis.git
   cd backend
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Verify model file exists**
   ```bash
   ls
   ```
   > ⚠️ **Important**: The `model_lgb.pkl` file must be present in the backend directory. If missing, the predictions will fail.

4. **Run the Flask application**
   ```bash
   python main.py
   ```

### API Endpoints

- **GET /** - API information
- **GET /health** - Health check and model status
- **POST /predict** - Generate survival predictions
  
### Dependencies

```
Flask==3.0.0
Flask-CORS==4.0.0
pandas==2.1.4
numpy==1.24.3
```

### Troubleshooting

**Model not loading:**
- Ensure `model_lgb.pkl` exists in the backend directory
- Check file permissions
- Verify Python version compatibility

**CORS errors:**
- Frontend should connect to `http://localhost:5000`
- CORS is enabled for all origins in development

**Port conflicts:**
- Default port is 5000
- Change in `main.py` if needed: `app.run(port=YOUR_PORT)`

### Model Requirements

The API expects a LightGBM model trained on HCT survival data with specific features. The model should output survival probabilities (0-1 range).

### Logs

Application logs will show:
- Model loading status
- Incoming prediction requests
- Error details for debugging

---

**Frontend**: Already deployed, access it at [here](https://hct-survival-analysis.vercel.app/)

**Backend**: Run locally on `http://localhost:5000`
