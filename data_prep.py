# data_prep.py
import os
import shutil
import random
from PIL import Image

SOURCE_DIR = os.path.join('data', 'plantvillage dataset', 'color')
DEST_DIR = os.path.join('data', 'processed')
SELECTED_CLASSES = [
    'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___healthy'
]
TRAIN_SPLIT = 0.8
IMAGE_SIZE = (224, 224)

def prepare_data():
    if os.path.exists(DEST_DIR):
        print(f"Destination directory {DEST_DIR} already exists. Removing it.")
        shutil.rmtree(DEST_DIR)

    for split in ['train', 'val']:
        for class_name in SELECTED_CLASSES:
            os.makedirs(os.path.join(DEST_DIR, split, class_name), exist_ok=True)

    print("Starting data preparation...")
    for class_name in SELECTED_CLASSES:
        print(f"Processing class: {class_name}")
        class_path = os.path.join(SOURCE_DIR, class_name)
        images = [f for f in os.listdir(class_path) if f.lower().endswith('.jpg')]
        random.shuffle(images)
        train_count = int(len(images) * TRAIN_SPLIT)

        for i, img_name in enumerate(images):
            split = 'train' if i < train_count else 'val'
            try:
                source_path = os.path.join(class_path, img_name)
                dest_path = os.path.join(DEST_DIR, split, class_name, img_name)
                with Image.open(source_path).convert('RGB') as img:
                    img = img.resize(IMAGE_SIZE)
                    img.save(dest_path)
            except Exception as e:
                print(f"Could not process image {img_name}. Error: {e}")

    print("Data preparation complete!")

if __name__ == '__main__':
    prepare_data()
