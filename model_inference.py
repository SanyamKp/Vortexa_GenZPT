# model_inference.py
import torch
from torchvision import models, transforms
from PIL import Image
import os
from saliency import generate_gradcam_overlay

MODEL_PATH = os.path.join('models', 'model.pth')
NUM_CLASSES = 6
CLASS_NAMES = [
    'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___healthy'
]

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

def get_model():
    # Step 1: Create the model architecture first.
    model = models.efficientnet_b0(weights='IMAGENET1K_V1')

    # Step 2: Now that 'model' exists, modify its final layer.
    num_ftrs = model.classifier[1].in_features
    model.classifier[1] = torch.nn.Linear(num_ftrs, NUM_CLASSES)

    # Step 3: Load your saved weights into this correct structure.
    model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))

    # Step 4: Set the model to evaluation mode.
    model.eval()

    return model

model = get_model()

def predict_and_saliency(image_path: str, heatmap_output_path: str):
    image = Image.open(image_path).convert("RGB")
    image_tensor = transform(image).unsqueeze(0)

    outputs = model(image_tensor)
    probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
    confidence, predicted_idx = torch.max(probabilities, 0)

    generate_gradcam_overlay(model, image_tensor, image_path, predicted_idx.item(), heatmap_output_path)

    return {
        "disease": CLASS_NAMES[predicted_idx.item()],
        "confidence": confidence.item()
    }