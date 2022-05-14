from flask import Flask, render_template, request, redirect, after_this_request, Response, jsonify
from flask_mysqldb import MySQL
import yaml
from flask_cors import CORS
from PIL import Image
import base64
import io
import os
import json
import faceRecognition as fr
import cv2
from io import BytesIO
import jsonpickle
import numpy as np
from json import JSONEncoder
from collections import namedtuple

# Configuration
app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = './People'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# Configure db
db = yaml.full_load(open('db.yaml'))
app.config['MYSQL_HOST'] = db['mysql_host']
app.config['MYSQL_USER'] = db['mysql_user']
app.config['MYSQL_PASSWORD'] = db['mysql_password']
app.config['MYSQL_DB'] = db['mysql_db']

mysql = MySQL(app)

# global variables
id = 0
name = {}


def get_consumer_id_pk(consumer_id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT consumer_id_pk FROM consumers where consumer_id = %s", [consumer_id])
    data = cur.fetchone()
    return data[0]


@app.route('/register', methods=['POST', 'GET'])
def register():
    """
    Register a new consumer
    """

    @after_this_request
    def add_header(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    cur = mysql.connection.cursor()
    if request.method == 'POST':
        # Fetch form data
        consumerDetails = request.json
        consumer_id = consumerDetails.get('consumer_id')
        consumer_name = consumerDetails.get('consumer_name')
        consumer_email = consumerDetails.get('consumer_email')
        consumer_contact = consumerDetails.get('consumer_contact')
        consumer_aadhar_number = consumerDetails.get('consumer_aadhar_number')

        cur.execute(
            "INSERT INTO consumers(consumer_id, consumer_name, consumer_email, consumer_contact, consumer_aadhar_number) VALUES(%s, %s, %s, %s, %s)",
            (consumer_id, consumer_name, consumer_email, consumer_contact, consumer_aadhar_number))
        consumer_id_pk = get_consumer_id_pk(consumer_id)
        cur.execute(
            "INSERT INTO consumer_wallet_details(consumer_id_fk, wallet_amount) VALUES(%s, %s)",
            (consumer_id_pk, 0))
        mysql.connection.commit()
        cur.close()
        json_dict = {
            "statuscode": 200,
        }
        return json_dict


@app.route('/get-profile-details', methods=['GET'])
def get_profile_details():
    """
    get profile details  from the database.
    """
    cur = mysql.connection.cursor()
    if request.method == 'GET':
        consumer_id = request.args.get('consumer_id')
        consumer_id_pk = get_consumer_id_pk(consumer_id)
        cur.execute("SELECT * FROM consumers where consumer_id_pk=%s", [consumer_id_pk])
        data = cur.fetchone()
        profile_info_dict = dict()
        print(data, "data")
        profile_info_dict['consumer_name'] = data[2]
        profile_info_dict['consumer_email'] = data[3]
        profile_info_dict['consumer_contact'] = data[4]
        profile_info_dict['consumer_aadhar_number'] = data[5]
        json_dict = {
            "statuscode": 200,
            "user_info": profile_info_dict
        }
        return json_dict


@app.route('/get-wallet', methods=['GET'])
def get_wallet_details():
    """
    get wallet details from the database.
    """
    cur = mysql.connection.cursor()
    if request.method == 'GET':
        consumer_id = request.args.get('consumer_id')
        consumer_id_pk = get_consumer_id_pk(consumer_id)
        cur.execute("SELECT wallet_amount FROM consumer_wallet_details where consumer_id_fk=%s", [consumer_id_pk])
        data = cur.fetchone()
        wallet_amount = data[0]
        json_dict = {
            "statuscode": 200,
            "wallet_amount": wallet_amount
        }
        return json_dict


@app.route('/payment', methods=['POST'])
def payment():
    """
    Payment API
    """
    cur = mysql.connection.cursor()
    if request.method == 'POST':
        amount_to_subtract = request.args.get('amount')
        consumer_id = request.args.get('consumer_id')
        consumer_id_pk = get_consumer_id_pk(consumer_id)
        cur.execute("SELECT wallet_amount FROM consumer_wallet_details where consumer_id_fk=%s", [consumer_id_pk])
        data = cur.fetchone()
        wallet_amount = data[0]
        updated_wallet_amount = int(wallet_amount) - int(amount_to_subtract)
        if updated_wallet_amount > 0:
            json_dict = {
                "statuscode": 200,
                "wallet_amount": updated_wallet_amount
            }
            cur.execute("UPDATE consumer_wallet_details SET wallet_amount=%s WHERE consumer_id_fk=%s",
                        [updated_wallet_amount, consumer_id_pk[0]])
            mysql.connection.commit()
            cur.close()

        else:
            json_dict = {
                "statuscode": 400,
                "message": "Insufficient funds"
            }
        return json_dict


@app.route('/add-money-wallet', methods=['POST'])
def add_money():
    """
    Add Money API
    """
    cur = mysql.connection.cursor()
    if request.method == 'POST':
        amount_to_add = request.args.get('amount')
        consumer_id = request.args.get('consumer_id')
        consumer_id_pk = get_consumer_id_pk(consumer_id)
        cur.execute("SELECT wallet_amount FROM consumer_wallet_details where consumer_id_fk=%s", [consumer_id_pk])
        data = cur.fetchone()
        available_wallet_amount = data[0]
        updated_wallet_amount = int(amount_to_add) + int(available_wallet_amount)
        cur.execute("UPDATE consumer_wallet_details SET wallet_amount=%s WHERE consumer_id_fk=%s",
                    [updated_wallet_amount, consumer_id_pk])
        mysql.connection.commit()
        cur.close()
        json_dict = {
            "statuscode": 200,
            "total_wallet_amount": updated_wallet_amount
        }
        return json_dict


@app.route('/invoice-details', methods=['GET', 'POST'])
def invoice():
    """
    get invoice details  from the database.
    """
    cur = mysql.connection.cursor()
    if request.method == 'POST':
        invoice_obj = request.json
        consumer_id = request.args.get('consumer_id')
        consumer_id_pk = get_consumer_id_pk(consumer_id)
        invoice_json = invoice_obj.get('invoice_details')
        invoice_json_dump = json.dumps(invoice_json)
        cur.execute(
            "INSERT INTO consumer_invoices(consumer_id_fk, invoice_json) VALUES(%s, %s)", [consumer_id_pk, invoice_json_dump])
        cur.execute("SELECT invoice_json FROM consumer_invoices where consumer_id_fk=%s", [consumer_id_pk])
        data = cur.fetchone()
        invoice_json_dict = dict()
        invoice_json_dict['invoice_json'] = json.loads(data[0])
        mysql.connection.commit()
        cur.close()
        json_dict = {
            "statuscode": 200,
            "invoice_details": invoice_json_dict
        }
        return json_dict


@app.route('/get-invoice-details', methods=['GET'])
def fetch_invoice_details():
    """
    get invoice details  from the database.
    """
    cur = mysql.connection.cursor()
    if request.method == 'GET':
        consumer_id = request.args.get('consumer_id')
        consumer_id_pk = get_consumer_id_pk(consumer_id)
        cur.execute("SELECT invoice_json  FROM consumer_invoices where consumer_id_fk=%s", [consumer_id_pk])
        data = cur.fetchall()
        invoice_obj_list = []
        for items in data:
            for item in items:
                invoice_obj_list.append(json.loads(item))
        print(invoice_obj_list)
        mysql.connection.commit()
        cur.close()
        json_dict = {
            "statuscode": 200,
            "invoice_details": invoice_obj_list
        }
        return json_dict


@app.route('/register_fr', methods=["POST"])
def Register_FR():
    global id
    global name
    id1 = 0
    content = request.json
    name1 = content['name']
    # mobile = content['mobile']
    # email = content['email']
    # aadhar = content['aadhar']
    # address = content['address']
    name[id] = name1
    print(name, name1)  # {0:"Dhruvil"}
    images = content['images']
    # creating folders and pasting this images inside that folder
    newpath = r'/home/pranay.p@ah.zymrinc.com/swift-buy/server/People'
    _dir = os.path.join(newpath, '%s' % id)  # named directory is created.
    if not os.path.exists(_dir):
        os.makedirs(_dir)
    for img in images:
        image = base64.b64decode(img)
        img = Image.open(io.BytesIO(image))
        img.save(f"{_dir}/{id1}.jpeg")
        id1 += 1
    # training the model
    faces, faceID = fr.labels_for_training_data('People')
    face_recognizer = fr.train_classifier(faces, faceID)
    face_recognizer.write('trainingData.yml')

    # last step
    id += 1
    return json.dumps({'success': True, "consumer_id": id}), 200, {'ContentType': 'application/json'}


@app.route('/login_fr', methods=["POST"])
def Login_FR():
    content = request.json
    print(name)
    image = base64.b64decode(content['file'])
    fileName = 'test.jpeg'

    # print(name)
    imagePath = ("test.jpeg")
    img = Image.open(io.BytesIO(image))
    img.save(imagePath, 'jpeg')
    # //imagefile = request.files.get('file', '')
    # test_img=cv2.imread(imagefile)#test_img path
    # imagefile.save('./test_image.jpg')
    test_img = cv2.imread("test.jpeg")
    faces_detected, gray_img = fr.faceDetection(test_img)
    print("faces_detected:", faces_detected)
    if len(faces_detected) == 0:
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    face_recognizer = cv2.face.LBPHFaceRecognizer_create()
    face_recognizer.read('trainingData.yml')  # use this to load training data for subsequent runs
    # name={0:"Tarkik",1:"Tatva"}#creating dictionary containing names for each label
    # name={}
    # name[id]=str(id)
    for face in faces_detected:
        (x, y, w, h) = face
        roi_gray = gray_img[y:y + h, x:x + h]
        label, confidence = face_recognizer.predict(roi_gray)  # predicting the label of given image
        print("confidence:", confidence)
        print("label:", label)
        fr.draw_rect(test_img, face)
        predicted_name = name[label]
        print(confidence)
        if (confidence > 50):  # If confidence more than 37 then don't print predicted face text on screen
            continue
        else:
            return Response(status=400)
        fr.put_text(test_img, predicted_name, x, y)
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
