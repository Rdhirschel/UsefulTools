#Data taken from https://www.kaggle.com/datasets/jagan028/img-superres/data
import tensorflow as tf
import matplotlib as plt
from keras.layers import Conv2D, Input, Add, Lambda
from keras.models import Model
from keras.optimizers import Adam
from keras.callbacks import LearningRateScheduler
import numpy as np
import os

def res_block(input_layer, filters):
    x = Conv2D(filters=filters, kernel_size=3, padding='same', activation='relu')(input_layer)
    x = Conv2D(filters=filters, kernel_size=3, padding='same')(x)
    x = Add()([input_layer, x])
    return x

def inter_connected(input_shape):
    input_tensor = Input(shape=input_shape)

    x = Conv2D(filters=32, kernel_size=3, padding='same', activation='relu')(input_tensor)
    
    for i in range(2):
        x = res_block(x, 32)
    
    x = Conv2D(filters=32*9, kernel_size=3, padding='same')(x)
    x = Lambda(lambda x: tf.nn.depth_to_space(x, block_size=3))(x)
    
    output_tensor = Conv2D(filters=3, kernel_size=1)(x)
    
    model = Model(inputs=input_tensor, outputs=output_tensor)
    print(model.summary())
    return model

def lr_schedule(epoch):
    initial_lr = 1e-5
    decay_factor = 0.9
    decay_step = 10
    lr = initial_lr * (decay_factor ** (epoch // decay_step))
    return lr

# Directories
low_res_train_dir = "models\\resolutionData\lowres"
high_res_train_dir = "models\\resolutionData\highres"

low_res_test_dir = "models\\resolutionData\lowresvalid"

# Data Generators
lrv_datagen = tf.keras.preprocessing.image.ImageDataGenerator()
hrv_datagen = tf.keras.preprocessing.image.ImageDataGenerator()

low_res_train_iterator = lrv_datagen.flow_from_directory(
    directory=low_res_train_dir,
    target_size=(170, 170),
    batch_size=1,
    class_mode=None,
    shuffle=False
)

high_res_train_iterator = hrv_datagen.flow_from_directory(
    directory=high_res_train_dir,
    target_size=(510, 510),
    batch_size=1,
    class_mode=None,
    shuffle=False
)

iterator_train_dirs = zip(low_res_train_iterator, high_res_train_iterator)

# Model
model = inter_connected((170, 170, 3))
model.compile(optimizer=Adam(lr=1e-5), loss='mse')

# Training with Learning Rate Scheduler
epochs = 5
batches = 500
model.fit(iterator_train_dirs, steps_per_epoch=batches, epochs=epochs, callbacks=[LearningRateScheduler(lr_schedule)])

#Test
test_data_generator = tf.keras.preprocessing.image.ImageDataGenerator()
test_iterator = test_data_generator.flow_from_directory(
    directory=low_res_test_dir,
    target_size=(170, 170),
    batch_size=1,
    class_mode=None,
    shuffle=False
)
super_res_images = model.predict(test_iterator)
for i in range(10):
    plt.imshow(super_res_images[i])
    plt.title(f"Super-Resolved Image {i}")
    plt.show()
#Save model for website
model.save("super_resolution_model.h5")
