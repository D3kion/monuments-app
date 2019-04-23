Deployment instructions:
-------------------------
#### Backend:
1. *Create db*
    ```
    $ psql -U postgres
    =# CREATE USER django_user WITH PASSWORD 'supersecret';
    =# ALTER USER django_user CREATEDB;
    =# ALTER ROLE django_user SUPERUSER;
    =# CREATE DATABASE django_db WITH OWNER django_user;
    =# \q
    $ psql -U postgres -d django_db -c "CREATE EXTENSION postgis"
    ```

2. *Create env and install dependecies*
    ```
    $ cd backend
    $ pipenv --three
    $ pipenv shell
    $ pipenv install
    ```
    
3. *Configure and run*
    ```
    $ python manage.py migrate
    $ python manage.py compilemessages -l ru
    $ python manage.py createsuperuser
    $ python manage.py runserver
    ```

4. *Test (optional)*
    ```
    $ coverage run --branch --source=api,core ./manage.py test
    $ coverage report
    ```

And go to [Admin panel](http://127.0.0.1:8000/admin) | [API](http://127.0.0.1:8000/api)

#### Frontend:
1. *Install dependencies*
    ```
    $ cd frontend
    $ npm install
    ```
2. *Build*
    ```
    $ npm run dev (or *prod*)
    ```

And go to [Frontend](http://127.0.0.1:8000/)
