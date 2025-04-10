
🔄 Commandes équivalentes entre MariaDB et PostgreSQL

| Action | MariaDB / MySQL | PostgreSQL (psql) |
|--------|----------------|-------------------|
| Se connecter à une base | `mysql -u user -p` | `psql -U user` |
| Liste des bases | `SHOW DATABASES;` | `\l` ou `\list` |
| Utiliser une base | `USE nom_base;` | `\c nom_base` |
| Voir les tables | `SHOW TABLES;` | `\dt` |
| Voir la structure d'une table | `DESCRIBE ma_table;` | `\d ma_table` |
| Créer une base | `CREATE DATABASE nom;` | `CREATE DATABASE nom;` |
| Supprimer une base | `DROP DATABASE nom;` | `DROP DATABASE nom;` |
| Créer une table | `CREATE TABLE ...` | `CREATE TABLE ...` |
| Supprimer une table | `DROP TABLE nom;` | `DROP TABLE nom;` |
| Voir les utilisateurs | `SELECT User FROM mysql.user;` | `\du` |
| Créer un utilisateur | `CREATE USER 'lucas'@'localhost';` | `CREATE ROLE lucas WITH LOGIN;` |
| Donner tous les droits à un user | `GRANT ALL ON base.* TO user;` | `GRANT ALL PRIVILEGES ON DATABASE base TO user;` |
| Quitter le client | `exit` ou `\q` | `\q` |
