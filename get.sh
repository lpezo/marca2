rsync -ru -e "ssh -p 9090" root@mark:/opt/marca2/ . --exclude "public/lib/" --exclude "node_modules/" -v
