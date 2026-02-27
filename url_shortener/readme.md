# URL Shortner
***by: FayBlaze***

*requierments:*
- Python
    - Flask → mesin aplikasi web
    - render_template → untuk menampilkan HTML
    - request → mengambil data dari user
    - redirect → mengalihkan ke URL lain
    - url_for → membuat URL dinamis
    - urlparse → memecah URL menjadi bagian-bagian (https, domain, dll)
    - abort → menghentikan dan kirim error (misalnya 404)
    - SQLAlchemy → alat untuk berbicara dengan database
    - random & string → membuat kode pendek acak.
- html, js, css

## penjelasan app.py

parsed.scheme = protokolnya(https, ftp).  
parsed.netloc = Lokasi server (Host + Port)