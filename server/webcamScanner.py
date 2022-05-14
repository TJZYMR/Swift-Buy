from flask import Flask, request, jsonify,render_template, after_this_request, Response
import cv2
from cv2 import cv2
import numpy as np
from pyzbar.pyzbar import decode

app = Flask(__name__)

@app.route("/")
def hello_world():
    return render_template("index.html")

@app.route('/video')
def video():
    return Response(hello_world(),mimetype='multipart/x-mixed-replace; boundary=frame')

def barcode():
    cap = cv2.VideoCapture(0)
    lastCode = ""

    # with open('mydata.text') as f:
    #     myDatalist = f.read().splitlines()
    
    while True:
        _, frame = cap.read()
        frame = cv2.flip(frame, 1) # Flip the frame
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY) # Convert to grayscale

        barcodes = decode(gray)    

        # For every barcode found
        for barcode in barcodes:
            # Get barcode coordinates
            (x,y,w,h) = barcode.rect
            # Draw a rectangle around it
            cv2.rectangle(frame, (x,y), (x+w,y+h), (0,0,255), 2)
            # Get the data
            barcodeType = barcode.type
            barcodeData = barcode.data.decode("utf-8")

            # if barcodeData in myDatalist:
            #     print("barcodeData:",barcodeData)
            # else:
            #     print("Plese rescan barcode:")
            # Draw the data over the rectangle
            dataText = f"Data: {barcodeData}"
            dataType = f"Type: {barcodeType}"
            cv2.putText(frame, dataText, (x,y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,255), 1)
            cv2.putText(frame, dataType, (x,y-30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,255), 1)

            # Update lastCode if necessary
            if barcodeData != lastCode:
                lastCode = barcodeData
                print("READ: " + barcodeData)
        cv2.imshow("original", frame)

        if cv2.waitKey(3) & 0xFF == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()
    # return Response("index.html",barcodeData=barcodeData)
    return render_template("index.html",barcodeData=barcodeData)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)