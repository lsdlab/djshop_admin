git add .
git commit -m "update"
git push origin master
git push gitlab master
npm run build
scp -r dist root@118.25.78.11:/root/djshop_admin/
echo "update finish"
