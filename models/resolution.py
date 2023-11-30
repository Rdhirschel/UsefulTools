import tensorflow as tf
from tensorflow.keras import layers, models
import numpy as np
import os

"""Creates an CNN with 64 filters, 3x3 kernel, with 3 color channels"""
def create_upscaler_model():
    model = models.Sequential()
    model.add(layers.Conv2D(64, (3, 3), activation='relu', padding='same', input_shape=(None, None, 3)))
    model.add(layers.Conv2D(64, (3, 3), activation='relu', padding='same'))
    model.add(layers.Conv2DTranspose(3, (3, 3), activation='linear', padding='same', strides=2))
    return model

upscaler_model = create_upscaler_model()
upscaler_model.compile(optimizer='adam', loss='mean_squared_error')