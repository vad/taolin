# Installation instructions

## Index

1. Requirements
1. Installation
    1. Installing Apache and PHP5
    1. Installing PostgreSQL
    1. Installing CakePHP 
    1. Installing Taolin
    1. Creating Taolin database
    1. Configuring Taolin
    1. Access to Taolin


## 1. Requirements 

The following procedure is for installing Taolin on a GNU/Linux machine, running Debian or Ubuntu. For other GNU/Linux flavors (OpenSuse, RedHat) the procedure is almost identical. The installation should be possible also on Windows and MacOSX but we didn't try yet.

* Be a root user
* PostegreSQL
* Apache + PHP
* The latest versions of CakePHP, in tar.gz format, available [here](http://cakephp.org/). Here is the direct link to the [version 1.2.1.8004.tar.gz](http://cakeforge.org/frs/download.php/698/cake_1.2.1.8004.tar.gz/donation=complete)
* The latest version of taolin, in tar.gz format, available [here](http://taolin.fbk.eu)
* Download the latest version of ExtJS from its [website](http://www.extjs.com) (link to the [download page](http://www.extjs.com/products/extjs/download.php)). Then extract all the files from the downloaded archive and copy those files into the directory named "extjs", placed under "webroot" in your taolin installation directory.

## 2. Installation

### 2.1 Installing Apache and PHP5

See also http://www.mysql-apache-php.com/

* Install Apache and PHP5 running this command in your terminal:
        sudo apt-get install apache2 php5 libapache2-mod-php5

* enter your sudo password

* Restart the Apache server to be load the PHP5 libraries:
        sudo /etc/init.d/apache2 restart

* Now Apache configuration file is located at: `/etc/apache2/apache2.conf`  and your web folder is `/var/www`

* Go to `http://localhost/` and if everything is working you should see "It works!"

### 2.1.1 Apache modules and directives

Taolin depends also on `mod_rewrite`. Make sure it's installed and enabled (google for this). You also have to check that .htaccess are enabled. Once they're available, to fully enable htaccess'es directives set `AllowOverride all` for your webroot (probably `/var/www`).


### 2.2 Installing PostegreSQL
    
* Type in your terminal:
        sudo apt-get install php5-pgsql postgresql-client-common postgresql-client-8.3 postgresql-8.3
  and then enter your sudo password

* If you want to use password authentication, append the following line to `/etc/postgresql/8.3/main/pg_hba.conf`
        local   all         all                               trust

### 2.3 Installing CakePHP 

* Copy the CakePHP archive into the `/var/www` directory:
        sudo cp cake_1.2.1.8004.tar.gz /var/www/

* Move into `/var/www` dir by typing:
        cd /var/www

* Extract here the CakePHP archive:
        sudo tar xfvm cake_1.2.1.8004.tar.gz

* Rename CakePHP "cake_1.2.1.8004" directory to "cake":
        sudo mv cake_1.2.1.8004 cake

### 2.4 Installing Taolin

* Copy taolin archive into the CakePHP folder `/var/www/cake`:
        sudo cp taolin /var/www/cake/

* Move into `/var/www/cake/` dir by typing:
        cd /var/www/cake/

* Extract the Taolin archive into CakePHP folder:
        sudo tar xfvm taolin_ver0.8.tar.gz

* Enter the Taolin directory:
        cd cake/taolin

### 2.5 Creating the Taolin database
* Go to the folder where you have the database dump of Taolin, in sql format.
* If you have no superuser, create one:
        $ sudo su postgres
        $ createuser -s -P YOUR_SUPERUSER
* Create a new database named taolin:

        $ createdb -U YOUR_SUPERUSER taolin

* Create plpgsql language for this db:

        $ createlang -U YOUR_SUPERUSER  plpgsql taolin

* Import the Taolin database into your taolin database (install is in taolin root)
        $ psql -U YOUR_SUPERUSER taolin
        # \i config/sql/taolin.struct.sql


### 2.6 Configuring Taolin

* Make tmp folder and its subdirectories writable:
        sudo chmod -R 777 tmp/*

* Create the database.php file from the sample one into the config folder:
        sudo cp config/database.php.default config/database.php

* Open database.php with your favourite text editor and complete the $default array, inserting your data, then save it.
  
  
### 2.7 Access to Taolin
* You can now access Taolin open your web browser and typing the following URL:
        http://localhost/cake/taolin

* Login with the following data:
        login: platone
        password: platone

Have fun!
