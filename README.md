Deployment instructions:
-------------------------
#### Backend:
1. *Create db*
    ```
    $ psql -U postgres
    =# CREATE USER django_user WITH PASSWORD 'supersecret';
    =# CREATE DATABASE django_db WITH OWNER django_user;
    =# \q
    $ psql -U postgres -d django_db -c "CREATE EXTENSION postgis"
    ```

2. *Create venv and install dependecies*
    ```
    $ cd django
    $ python -m venv venv
    $ source venv/bin/activate
    $ pip install -r requirements.txt
    ```
    
3. *Configure and run*
    ```
    $ python manage.py migrate
    $ python manage.py compilemessages -l ru
    $ python manage.py createsuperuser
    $ python manage.py runserver
    ```

And go to [Admin panel](http://127.0.0.1:8000/admin) | [API](http://127.0.0.1:8000/api) | [Geo API](http://127.0.0.1:8000/api/geo)

#### Frontend:
1. *Install dependencies*
    ```
    $ cd frontend
    $ npm install
    ```
2. *Run*
    ```
    $ npm start
    ```
3. *Build (optional)*
    ```
    $ npm run build
    ```
