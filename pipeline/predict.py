import cv2
import numpy as np
import tensorflow as tf
import mediapipe as mp

# Load model
model = tf.keras.models.load_model("models/isl_model.h5")

class_labels = {
    0: "1", 1: "2", 2: "3", 3: "4", 4: "5", 5: "6", 6: "7", 7: "8",
    8: "9", 9: "A", 10: "B", 11: "C", 12: "D", 13: "E", 14: "F",
    15: "G", 16: "H", 17: "I", 18: "J", 19: "K", 20: "L", 21: "M",
    22: "N", 23: "O", 24: "P", 25: "Q", 26: "R", 27: "S", 28: "T",
    29: "U", 30: "V", 31: "W", 32: "X", 33: "Y", 34: "Z"
}

# Initialize webcam and MediaPipe
cap = cv2.VideoCapture(0)
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=1, min_detection_confidence=0.7)
mp_draw = mp.solutions.drawing_utils

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = hands.process(frame_rgb)

    if result.multi_hand_landmarks:
        for hand_landmarks in result.multi_hand_landmarks:
            # Get bounding box
            h, w, _ = frame.shape
            x_min = min([lm.x for lm in hand_landmarks.landmark]) * w
            y_min = min([lm.y for lm in hand_landmarks.landmark]) * h
            x_max = max([lm.x for lm in hand_landmarks.landmark]) * w
            y_max = max([lm.y for lm in hand_landmarks.landmark]) * h

            x1, y1, x2, y2 = int(x_min)-20, int(y_min)-20, int(x_max)+20, int(y_max)+20
            x1, y1 = max(0, x1), max(0, y1)
            x2, y2 = min(w, x2), min(h, y2)

            roi = frame[y1:y2, x1:x2]

            # Preprocess and predict
            img = cv2.resize(roi, (64, 64))
            img_array = img / 255.0
            img_array = np.expand_dims(img_array, axis=0)

            pred = model.predict(img_array)
            class_index = pred.argmax()
            predicted_label = class_labels.get(class_index, "Unknown")

            # Draw
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, f"Prediction: {predicted_label}", (50, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

            mp_draw.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

    cv2.imshow("ISL Prediction", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
