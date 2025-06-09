from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
import logging
import os
from typing import Dict, List, Any

app = Flask(__name__)
CORS(app) 

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

model = None

def load_model():
    """Load the trained LightGBM model"""
    global model
    
    current_dir = os.getcwd()
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    logger.info(f"Current directory: {current_dir}")
    logger.info(f"Script directory: {script_dir}")
    logger.info(f"Files in current directory: {os.listdir(current_dir)}")
    
    model_file = 'model_lgb.pkl'
    
    model_path = os.path.join(current_dir, model_file)
    
    if os.path.exists(model_path):
        try:
            logger.info(f"Loading model from: {model_path}")
            with open(model_path, 'rb') as f:
                model = pickle.load(f)
            logger.info("✅ Model loaded successfully from pickle file")
            return
        except Exception as e:
            logger.error(f"❌ Error loading model: {str(e)}")
    else:
        logger.error(f"❌ Model file not found at: {model_path}")
    
    logger.error("❌ Could not load model from any location")
    model = None

def get_feature_defaults() -> Dict[str, Any]:
    """Get default values for features not provided by user"""
    return {
        'tbi_status': 0, 
        'graft_type': 0,  
        'vent_hist': 0,
        'renal_issue': 0,
        'pulm_severe': 0,
        'cmv_status': 0,  
        'rituximab': 0,
        'prod_type': 0,
        'conditioning_intensity': 0,  
        'ethnicity': 0,
        'in_vivo_tcd': 0,
        'hepatic_severe': 0,
        'prior_tumor': 0,
        'peptic_ulcer': 0,
        'rheum_issue': 0,
        'sex_match': 0,
        'hepatic_mild': 0,
        'donor_related': 0,
        'melphalan_dose': 0,
        'cardiac': 0,
        'pulm_moderate': 0,
        'psych_disturb': 0,
        'diabetes': 0,
        'arrhythmia': 0,
        'obesity': 0,
        'mrd_hct': 0,
        'tce_imm_match': 0,
        'tce_match': 0,
        'tce_div_match': 0,
        'cyto_score_detail': 0,
        
        'hla_match_c_high': 1.0,
        'hla_high_res_8': 7.0,
        'hla_low_res_6': 6.0,
        'hla_high_res_6': 6.0,
        'hla_high_res_10': 9.0,
        'hla_match_dqb1_high': 1.0,
        'hla_nmdp_6': 6.0,
        'hla_match_c_low': 2.0,
        'hla_match_drb1_low': 2.0,
        'hla_match_dqb1_low': 1.0,
        'hla_match_a_high': 2.0,
        'hla_match_b_low': 2.0,
        'hla_match_a_low': 2.0,
        'hla_match_b_high': 2.0,
        'hla_low_res_8': 7.0,
        'hla_match_drb1_high': 1.0,
        'hla_low_res_10': 9.0
    }

def preprocess_input(form_data: Dict[str, str]) -> pd.DataFrame:
    """Convert form data to model input format"""
    
    # Initialize with defaults
    processed_data = get_feature_defaults()
    
    #categorical mappings
    categorical_mappings = {
        'prim_disease_hct': {
            'aml': 0, 'all': 1, 'mds': 2, 'cml': 3, 'lymphoma': 4, 
            'multiple_myeloma': 5, 'other': 6
        },
        'dri_score': {
            'low': 0, 'intermediate': 1, 'high': 2, 'very_high': 3
        },
        'gvhd_proph': {
            'tacrolimus_mtx': 0, 'cyclosporine_mtx': 1, 'other': 2
        },
        'race_group': {
            "more_than_one": 0,
            "asian": 1,
            "white": 2,
            "american_indian": 3,
            "native_hawaiian": 4,
            "black": 5
        },
        'cyto_score': {
            'favorable': 0, 'intermediate': 1, 'poor': 2, 'very_poor': 3
        }
    }
    
    try:
        # convert numerical to float32 to match training
        processed_data['donor_age'] = np.float32(form_data['donor_age'])
        processed_data['age_at_hct'] = np.float32(form_data['age_at_hct'])
        processed_data['year_hct'] = np.int32(form_data['year_hct'])
        processed_data['comorbidity_score'] = np.float32(form_data['comorbidity_score'])
        
        # convert categorical to int32 to match training
        for field, mapping in categorical_mappings.items():
            if field in form_data:
                processed_data[field] = np.int32(mapping.get(form_data[field], 0))
        
        # Map Karnofsky score to numerical value
        karnofsky_map = {
            '90-100': 95,
            '80': 80,
            '70': 70,
            '60': 60,
            '<60': 50
        }
        processed_data['karnofsky_score'] = np.float32(karnofsky_map.get(form_data['karnofsky_score'], 80))
        
    except (ValueError, KeyError) as e:
        logger.error(f"Error processing input data: {str(e)}")
        raise ValueError(f"Invalid input data: {str(e)}")
    
    # Convert to DataFrame
    df = pd.DataFrame([processed_data])
    
    # categorical and numerical features based on  training
    categorical_features = [
        'dri_score', 'psych_disturb', 'cyto_score', 'diabetes', 'tbi_status', 
        'arrhythmia', 'graft_type', 'vent_hist', 'renal_issue', 'pulm_severe', 
        'prim_disease_hct', 'cmv_status', 'tce_imm_match', 'rituximab', 
        'prod_type', 'cyto_score_detail', 'conditioning_intensity', 'ethnicity', 
        'obesity', 'mrd_hct', 'in_vivo_tcd', 'tce_match', 'hepatic_severe', 
        'prior_tumor', 'peptic_ulcer', 'gvhd_proph', 'rheum_issue', 'sex_match', 
        'race_group', 'hepatic_mild', 'tce_div_match', 'donor_related', 
        'melphalan_dose', 'cardiac', 'pulm_moderate'
    ]
    
    numerical_features = [
        'hla_match_c_high', 'hla_high_res_8', 'hla_low_res_6', 'hla_high_res_6',
        'hla_high_res_10', 'hla_match_dqb1_high', 'hla_nmdp_6', 'hla_match_c_low',
        'hla_match_drb1_low', 'hla_match_dqb1_low', 'hla_match_a_high', 'donor_age',
        'hla_match_b_low', 'age_at_hct', 'hla_match_a_low', 'hla_match_b_high',
        'comorbidity_score', 'karnofsky_score', 'hla_low_res_8', 'hla_match_drb1_high',
        'hla_low_res_10', 'year_hct'
    ]
    
    expected_features = categorical_features + numerical_features
    
    # add missing columns with defaults
    for feature in expected_features:
        if feature not in df.columns:
            if feature in categorical_features:
                df[feature] = np.int32(0)
            else:
                df[feature] = np.float32(0.0)
    
    for feature in categorical_features:
        if feature in df.columns:
            df[feature] = df[feature].astype("int32")
    
    for feature in numerical_features:
        if feature in df.columns:
            df[feature] = df[feature].astype("float32")
    
    # reorder columns to match training data
    df = df[expected_features]
    
    logger.info(f"Preprocessed data shape: {df.shape}")
    logger.info(f"Data types: categorical={len(categorical_features)}, numerical={len(numerical_features)}")
    
    return df

def categorize_risk(survival_prob: float) -> str:
    """Categorize risk based on survival probability"""
    if survival_prob >= 0.7:
        return "low"
    elif survival_prob >= 0.4:
        return "moderate"
    else:
        return "high"

def generate_recommendations(survival_prob: float, risk_category: str, form_data: Dict[str, str]) -> List[str]:
    """Generate clinical recommendations based on prediction"""
    recommendations = []
    
    age = float(form_data.get('age_at_hct', 0))
    comorbidity_score = float(form_data.get('comorbidity_score', 0))
    dri_score = form_data.get('dri_score', '')
    
    if risk_category == "high":
        recommendations.extend([
            "Consider intensive monitoring in the first 100 days post-HCT",
            "Evaluate for clinical trials with novel approaches",
            "Implement aggressive supportive care measures"
        ])
    
    if risk_category in ["high", "moderate"]:
        recommendations.extend([
            "Close monitoring for GVHD and infections",
            "Consider prophylactic interventions"
        ])
    
    if age > 60:
        recommendations.append("Age-adjusted conditioning regimen may be beneficial")
    
    if comorbidity_score > 3:
        recommendations.append("Pre-HCT optimization of comorbidities recommended")
    
    if dri_score in ["high", "very_high"]:
        recommendations.append("Consider alternative donor or conditioning approaches")
    
    if not recommendations:
        recommendations = [
            "Standard post-HCT monitoring protocol",
            "Regular follow-up appointments as scheduled"
        ]
    
    return recommendations

@app.route('/predict', methods=['POST'])
def predict():
    """Handle prediction requests"""
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        form_data = request.get_json()
        
        if not form_data:
            return jsonify({'error': 'No data provided'}), 400
        
        logger.info(f"Received form data: {form_data}")
        
        # validate required fields
        required_fields = ['donor_age', 'age_at_hct', 'prim_disease_hct', 'year_hct', 
                          'dri_score', 'comorbidity_score', 'gvhd_proph', 'karnofsky_score', 
                          'race_group', 'cyto_score']
        
        missing_fields = [field for field in required_fields if not form_data.get(field)]
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {missing_fields}'}), 400
        
        logger.info("Preprocessing input data...")
        input_df = preprocess_input(form_data)
        
        try:
            logger.info(f"Making prediction with model type: {type(model)}")
            
            # booster to bypass sklearn categorical validation
            booster = model.booster_
            prediction = booster.predict(input_df.values)[0]
            logger.info(f"Raw prediction: {prediction}")
            
            # apply sigmoid if needed
            if prediction < 0 or prediction > 1:
                prediction = 1 / (1 + np.exp(-np.clip(prediction, -500, 500)))
                logger.info(f"After sigmoid: {prediction}")
                
            prediction = float(prediction)
            
        except Exception as pred_error:
            logger.error(f"Prediction error: {pred_error}")
            raise pred_error
        
        prediction = max(0.0, min(1.0, prediction))
        
        # confidence interval (simplified)
        ci_lower = max(0.0, prediction - 0.1)
        ci_upper = min(1.0, prediction + 0.1)
        
        # Categorize risk
        risk_category = categorize_risk(prediction)
        
        recommendations = generate_recommendations(prediction, risk_category, form_data)

        response = {
            'survival_probability': prediction,
            'risk_category': risk_category,
            'confidence_interval': [ci_lower, ci_upper],
            'recommendations': recommendations
        }
        
        logger.info(f"Prediction successful: {prediction:.3f}, Risk: {risk_category}")
        
        return jsonify(response)
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'model_type': str(type(model)) if model else None
    })

@app.route('/', methods=['GET'])
def home():
    """Home endpoint"""
    return jsonify({
        'message': 'HCT Survival Prediction API',
        'version': '1.0',
        'endpoints': ['/predict', '/health']
    })

if __name__ == '__main__':
    load_model()
    
    if model is None:
        logger.warning("Model not loaded - predictions will not work")
    else:
        logger.info(f"✅ Ready to serve predictions with {type(model)}")
    
    app.run(debug=True, host='0.0.0.0', port=5000)