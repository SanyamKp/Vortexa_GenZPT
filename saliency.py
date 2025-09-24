
# saliency.py
import torch
import cv2
import numpy as np
from captum.attr import LayerGradCam
from PIL import Image

def generate_gradcam_overlay(model, image_tensor, original_image_path, target_idx, output_path):
    # We target the last convolutional block in MobileNetV2's features
    layer = model.features[-1]
    gradcam = LayerGradCam(model, layer)

    attribution = gradcam.attribute(image_tensor, target=target_idx)

    # Process the heatmap
    heatmap = attribution.squeeze().cpu().detach().numpy()
    heatmap = np.maximum(heatmap, 0)
    heatmap = cv2.resize(heatmap, (224, 224))
    heatmap = (heatmap - heatmap.min()) / (heatmap.max() - heatmap.min() + 1e-8)
    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    # Load original image for overlay
    original_img = cv2.imread(original_image_path)
    original_img = cv2.resize(original_img, (224, 224))

    # Create the overlayed image
    overlayed_image = cv2.addWeighted(original_img, 0.6, heatmap, 0.4, 0)

    # Save the result
    cv2.imwrite(output_path, overlayed_image)