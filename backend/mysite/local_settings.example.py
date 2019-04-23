DEBUG = True

SECRET_KEY = 'jstdyvlpcssdo4#2=atx!d=n+qfg#4k=96&yq_%(kay3flwczq'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'DBNAME',
        'USER': 'DBUSER',
        'PASSWORD': 'DBPASSWORD',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'USER@gmail.com'
EMAIL_HOST_PASSWORD = 'PASSWORD'
EMAIL_USE_TLS = True
