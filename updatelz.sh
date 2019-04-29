git add .
git commit -m "update"
git push origin master
git push gitlab master
npm run build
scp -r dist root@123.206.178.152:/root/lz/djshop_admin
echo "update finish"
