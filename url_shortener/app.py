from flask import Flask, render_template, request, redirect, url_for, abort
from flask_sqlalchemy import SQLAlchemy
from urllib.parse import urlparse
import random
import string

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///urls.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


# ==========================
# Database Model
# ==========================
class Urls(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    long = db.Column(db.String(2048), nullable=False)
    short = db.Column(db.String(6), unique=True, nullable=False)

    def __init__(self, long, short):
        self.long = long
        self.short = short


# ==========================
# Helper Functions
# ==========================
def is_valid_url(url):
    parsed = urlparse(url)
    return bool(parsed.scheme and parsed.netloc)


def shorten_url(length=6):
    letters = string.ascii_letters + string.digits

    while True:
        short_code = ''.join(random.choices(letters, k=length))
        if not Urls.query.filter_by(short=short_code).first():
            return short_code


# ==========================
# Routes
# ==========================
@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == "POST":
        url_received = request.form.get("nm")

        if not is_valid_url(url_received):
            return "Invalid URL format", 400

        found_url = Urls.query.filter_by(long=url_received).first()

        if found_url:
            return redirect(url_for("display_short_url", url=found_url.short))

        short_url = shorten_url()
        new_url = Urls(url_received, short_url)
        db.session.add(new_url)
        db.session.commit()

        return redirect(url_for("display_short_url", url=short_url))

    return render_template('url_page.html')


@app.route('/<short_url>')
def redirection(short_url):
    url_entry = Urls.query.filter_by(short=short_url).first()

    if url_entry:
        return redirect(url_entry.long)

    abort(404)


@app.route('/display/<url>')
def display_short_url(url):
    return render_template('shorturl.html', short_url_display=url)


@app.route('/all_urls')
def display_all():
    return render_template('all_urls.html', vals=Urls.query.all())


# ==========================
# Initialize Database
# ==========================
with app.app_context():
    db.create_all()


if __name__ == '__main__':
    app.run(port=5000, debug=True)